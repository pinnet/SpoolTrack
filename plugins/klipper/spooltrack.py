# SpoolTrack Klipper Plugin
# Tracks filament usage and reports to SpoolTrack web service
# Copyright (C) 2026 SpoolTrack Contributors
#
# This file may be distributed under the terms of the MIT license.

import logging
import json
import threading
import time
from urllib import request as urllib_request
from urllib.error import URLError, HTTPError

class SpoolTrack:
    def __init__(self, config):
        self.printer = config.get_printer()
        self.name = config.get_name()
        
        # Configuration
        self.server_url = config.get('server_url')
        self.api_key = config.get('api_key', None)
        self.update_interval = config.getfloat('update_interval', 60.0)  # seconds
        self.filament_diameter = config.getfloat('filament_diameter', 1.75)  # mm
        
        # Current spool UUID (can be changed via G-code)
        self.current_spool_uuid = config.get('default_spool_uuid', None)
        
        # Tracking variables
        self.total_extrusion = 0.0  # Total mm of filament extruded
        self.session_extrusion = 0.0  # Extrusion since last update
        self.last_e_pos = {}  # Last known E position per extruder
        self.print_stats = None
        self.toolhead = None
        self.last_update_time = time.time()
        self.lock = threading.Lock()
        
        # State
        self.is_printing = False
        self.current_print_name = None
        self.print_start_time = None
        
        # Register event handlers
        self.printer.register_event_handler("klippy:ready", self._handle_ready)
        self.printer.register_event_handler("klippy:shutdown", self._handle_shutdown)
        
        # Register G-code command
        self.gcode = self.printer.lookup_object('gcode')
        self.gcode.register_command('SET_SPOOL_UUID', 
                                   self.cmd_SET_SPOOL_UUID,
                                   desc=self.cmd_SET_SPOOL_UUID_help)
        self.gcode.register_command('SPOOLTRACK_STATUS',
                                   self.cmd_SPOOLTRACK_STATUS,
                                   desc=self.cmd_SPOOLTRACK_STATUS_help)
        self.gcode.register_command('SPOOLTRACK_SYNC',
                                   self.cmd_SPOOLTRACK_SYNC,
                                   desc=self.cmd_SPOOLTRACK_SYNC_help)
        
        # Timer for periodic updates
        self.reactor = self.printer.get_reactor()
        self.update_timer = self.reactor.register_timer(self._update_timer_event)
        
        logging.info("SpoolTrack plugin initialized")
    
    def _handle_ready(self):
        """Called when Klipper is ready"""
        self.toolhead = self.printer.lookup_object('toolhead')
        self.print_stats = self.printer.lookup_object('print_stats', None)
        
        # Start update timer
        self.reactor.update_timer(self.update_timer, self.reactor.NOW)
        logging.info("SpoolTrack ready")
    
    def _handle_shutdown(self):
        """Called on Klipper shutdown"""
        # Send final update
        if self.session_extrusion > 0:
            self._send_usage_update(force=True)
    
    def _update_timer_event(self, eventtime):
        """Called periodically to check for updates"""
        try:
            # Check if we're printing
            if self.print_stats:
                state = self.print_stats.get_status(eventtime)
                self.is_printing = state['state'] == 'printing'
                
                if self.is_printing:
                    # Get current print info
                    self.current_print_name = state.get('filename', 'Unknown')
                    
                    # Track extrusion
                    self._update_extrusion()
            
            # Send update if interval has passed or significant extrusion
            current_time = time.time()
            time_since_update = current_time - self.last_update_time
            
            if (time_since_update >= self.update_interval and self.session_extrusion > 0):
                self._send_usage_update()
        
        except Exception as e:
            logging.error(f"SpoolTrack update error: {e}")
        
        # Schedule next update
        return eventtime + 10.0  # Check every 10 seconds
    
    def _update_extrusion(self):
        """Calculate filament extrusion since last check"""
        try:
            toolhead_status = self.toolhead.get_status(time.time())
            
            # Get all extruder positions
            # Klipper tracks position as [X, Y, Z, E]
            if 'position' in toolhead_status:
                position = toolhead_status['position']
                if len(position) >= 4:
                    current_e_pos = position[3]  # E axis position
                    
                    # Calculate delta
                    extruder_name = 'extruder'  # Default extruder
                    if extruder_name not in self.last_e_pos:
                        self.last_e_pos[extruder_name] = current_e_pos
                    
                    delta_e = current_e_pos - self.last_e_pos[extruder_name]
                    
                    # Only count positive extrusion (ignore retractions)
                    if delta_e > 0:
                        with self.lock:
                            self.total_extrusion += delta_e
                            self.session_extrusion += delta_e
                    
                    # Update last position
                    self.last_e_pos[extruder_name] = current_e_pos
        
        except Exception as e:
            logging.error(f"SpoolTrack extrusion tracking error: {e}")
    
    def _calculate_filament_length(self, extrusion_mm):
        """
        Convert raw extrusion distance to actual filament length in meters
        
        Args:
            extrusion_mm: Raw E-axis movement in mm
        
        Returns:
            float: Filament length in meters
        """
        # The extrusion_mm is already the length of filament
        # Just convert mm to meters
        return extrusion_mm / 1000.0
    
    def _calculate_filament_weight(self, length_meters):
        """
        Calculate filament weight in grams
        
        Args:
            length_meters: Filament length in meters
        
        Returns:
            float: Weight in grams (approximate for PLA)
        """
        # Calculate volume
        radius_mm = self.filament_diameter / 2.0
        area_mm2 = 3.14159 * (radius_mm ** 2)
        volume_mm3 = area_mm2 * (length_meters * 1000)  # Convert meters to mm
        
        # Convert to cm³ and multiply by density (1.24 g/cm³ for PLA)
        volume_cm3 = volume_mm3 / 1000.0
        weight_grams = volume_cm3 * 1.24
        
        return weight_grams
    
    def _send_usage_update(self, force=False):
        """Send usage data to web service"""
        if not self.current_spool_uuid:
            logging.warning("SpoolTrack: No spool UUID set, skipping update")
            return
        
        with self.lock:
            if self.session_extrusion <= 0 and not force:
                return
            
            extrusion_to_send = self.session_extrusion
            self.session_extrusion = 0.0  # Reset session counter
            self.last_update_time = time.time()
        
        # Calculate metrics
        length_meters = self._calculate_filament_length(extrusion_to_send)
        weight_grams = self._calculate_filament_weight(length_meters)
        
        # Prepare data
        data = {
            'spool_uuid': self.current_spool_uuid,
            'amount_used': round(weight_grams, 2),
            'length_meters': round(length_meters, 3),
            'print_name': self.current_print_name,
            'print_duration': int(time.time() - self.print_start_time) if self.print_start_time else None
        }
        
        logging.info(f"SpoolTrack: Sending update - {weight_grams:.2f}g ({length_meters:.3f}m)")
        
        # Send in background thread to avoid blocking
        thread = threading.Thread(target=self._send_http_request, args=(data,))
        thread.daemon = True
        thread.start()
    
    def _send_http_request(self, data):
        """Send HTTP POST request to web service"""
        try:
            url = f"{self.server_url}/usage"
            
            # Prepare request
            json_data = json.dumps(data).encode('utf-8')
            req = urllib_request.Request(url, data=json_data)
            req.add_header('Content-Type', 'application/json')
            
            if self.api_key:
                req.add_header('X-API-Key', self.api_key)
            
            # Send request
            with urllib_request.urlopen(req, timeout=10) as response:
                response_data = response.read().decode('utf-8')
                result = json.loads(response_data)
                
                if result.get('success'):
                    logging.info(f"SpoolTrack: Update successful")
                else:
                    logging.error(f"SpoolTrack: Update failed - {result.get('error')}")
        
        except HTTPError as e:
            logging.error(f"SpoolTrack: HTTP error {e.code} - {e.reason}")
        except URLError as e:
            logging.error(f"SpoolTrack: Connection error - {e.reason}")
        except Exception as e:
            logging.error(f"SpoolTrack: Update error - {e}")
    
    # G-code commands
    
    cmd_SET_SPOOL_UUID_help = "Set the current spool UUID for tracking"
    def cmd_SET_SPOOL_UUID(self, gcmd):
        """Handle SET_SPOOL_UUID command"""
        uuid = gcmd.get('UUID', None)
        
        if uuid:
            with self.lock:
                # Send any pending usage for old spool
                if self.session_extrusion > 0:
                    self._send_usage_update(force=True)
                
                # Set new spool
                self.current_spool_uuid = uuid
                self.print_start_time = time.time()
            
            gcmd.respond_info(f"SpoolTrack: Spool UUID set to {uuid}")
            logging.info(f"SpoolTrack: Spool UUID changed to {uuid}")
        else:
            gcmd.respond_info(f"SpoolTrack: Current UUID: {self.current_spool_uuid}")
    
    cmd_SPOOLTRACK_STATUS_help = "Show SpoolTrack status and statistics"
    def cmd_SPOOLTRACK_STATUS(self, gcmd):
        """Handle SPOOLTRACK_STATUS command"""
        with self.lock:
            length_total = self._calculate_filament_length(self.total_extrusion)
            length_session = self._calculate_filament_length(self.session_extrusion)
            weight_total = self._calculate_filament_weight(length_total)
            weight_session = self._calculate_filament_weight(length_session)
        
        status = [
            "SpoolTrack Status:",
            f"  Spool UUID: {self.current_spool_uuid or 'Not set'}",
            f"  Server: {self.server_url}",
            f"  Printing: {self.is_printing}",
            f"  Current Print: {self.current_print_name or 'None'}",
            f"  Total Extrusion: {length_total:.3f}m ({weight_total:.2f}g)",
            f"  Session Pending: {length_session:.3f}m ({weight_session:.2f}g)"
        ]
        
        gcmd.respond_info("\n".join(status))
    
    cmd_SPOOLTRACK_SYNC_help = "Force immediate sync to web service"
    def cmd_SPOOLTRACK_SYNC(self, gcmd):
        """Handle SPOOLTRACK_SYNC command"""
        if self.session_extrusion > 0:
            self._send_usage_update(force=True)
            gcmd.respond_info("SpoolTrack: Sync initiated")
        else:
            gcmd.respond_info("SpoolTrack: No usage to sync")

def load_config(config):
    return SpoolTrack(config)
