# SpoolTrack Klipper Plugin

Automatic filament usage tracking plugin for Klipper that integrates with SpoolTrack web service.

## Features

- 📊 **Automatic Tracking**: Monitors E-axis movement to calculate filament usage
- 🔄 **Real-time Updates**: Sends usage data to SpoolTrack web service periodically
- 📏 **Accurate Measurements**: Tracks both length (meters) and weight (grams)
- 🎯 **UUID-based**: Links usage to specific spools using global UUIDs
- 🖨️ **Print Awareness**: Associates usage with print jobs
- 💪 **Robust**: Handles network failures gracefully with retry logic

## Installation

### Method 1: Manual Installation

1. **Copy the plugin file to Klipper extras directory:**

```bash
# SSH into your Klipper host
ssh pi@your-printer-ip

# Navigate to Klipper extras directory
cd ~/klipper/klippy/extras/

# Download the plugin
wget https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py

# Set proper permissions
chmod 644 spooltrack.py
```

2. **Add configuration to printer.cfg:**

```bash
nano ~/printer_data/config/printer.cfg
```

Add the following section:

```ini
[spooltrack]
server_url: http://192.168.1.100:3000/api
api_key: your-api-key-here
update_interval: 60
filament_diameter: 1.75
default_spool_uuid: your-default-uuid
```

3. **Restart Klipper:**

```bash
sudo systemctl restart klipper
```

4. **Verify installation:**

Run `SPOOLTRACK_STATUS` in your printer console to verify the plugin is loaded.

### Method 2: KIAUH Installation

If using KIAUH (Klipper Installation and Update Helper):

```bash
cd ~/kiauh
./kiauh.sh
# Select option 4: Advanced
# Select option to install custom extensions
# Provide the SpoolTrack repository URL
```

## Configuration

### Required Settings

```ini
[spooltrack]
# Web service URL endpoint (required)
server_url: http://192.168.1.100:3000/api

# API key for authentication (optional)
api_key: your-api-key-here
```

### Optional Settings

```ini
# How often to send updates (seconds, default: 60)
update_interval: 60

# Filament diameter in mm (default: 1.75)
filament_diameter: 1.75

# 2.85mm filament example:
# filament_diameter: 2.85

# Default spool UUID (can be overridden via G-code)
default_spool_uuid: 12345678-90ab-cdef-1234-567890abcdef
```

## Usage

### Setting Spool UUID

Before starting a print, set the current spool UUID:

```gcode
SET_SPOOL_UUID UUID=12345678-90ab-cdef-1234-567890abcdef
```

**Integration with Start G-code:**

Add to your slicer's start G-code:

```gcode
; SpoolTrack - Set active spool
SET_SPOOL_UUID UUID=12345678-90ab-cdef-1234-567890abcdef

; Your other start G-code...
G28
G29
```

### Checking Status

View current tracking status:

```gcode
SPOOLTRACK_STATUS
```

Output example:
```
SpoolTrack Status:
  Spool UUID: 12345678-90ab-cdef-1234-567890abcdef
  Server: http://192.168.1.100:3000/api
  Printing: True
  Current Print: benchy.gcode
  Total Extrusion: 45.678m (123.45g)
  Session Pending: 2.345m (6.78g)
```

### Manual Sync

Force immediate update to web service:

```gcode
SPOOLTRACK_SYNC
```

### Query Current UUID

Check which spool is currently active:

```gcode
SET_SPOOL_UUID
```

## G-code Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `SET_SPOOL_UUID` | Set or query current spool UUID | `UUID=<uuid>` (optional) |
| `SPOOLTRACK_STATUS` | Display tracking statistics | None |
| `SPOOLTRACK_SYNC` | Force immediate sync to server | None |

## How It Works

1. **Monitoring**: Plugin monitors the E-axis position every 10 seconds
2. **Calculation**: Converts extrusion distance to filament length and weight
3. **Aggregation**: Accumulates usage data over the update interval
4. **Transmission**: Sends batched updates to web service via HTTP POST
5. **Confirmation**: Logs success/failure of each update

### Weight Calculation

The plugin calculates weight using:
- Filament diameter (from config)
- Material density (1.24 g/cm³ for PLA - typical average)
- Extrusion length

**Formula:**
```
Volume = π × (diameter/2)² × length
Weight = Volume × Density
```

## API Integration

The plugin sends POST requests to: `{server_url}/usage`

**Request payload:**
```json
{
  "spool_uuid": "12345678-90ab-cdef-1234-567890abcdef",
  "amount_used": 123.45,
  "length_meters": 45.678,
  "print_name": "benchy.gcode",
  "print_duration": 3600
}
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "spool_id": 1,
    "current_weight": 876.55
  }
}
```

## Troubleshooting

### Plugin Not Loading

**Check Klipper logs:**
```bash
tail -f ~/printer_data/logs/klippy.log
```

**Look for errors:**
- File permissions issues
- Syntax errors in configuration
- Missing dependencies

### No Updates Reaching Server

1. **Verify network connectivity:**
```bash
ping 192.168.1.100
```

2. **Test API endpoint:**
```bash
curl -X GET http://192.168.1.100:3000/health
```

3. **Check firewall:**
```bash
sudo ufw status
```

4. **Review plugin logs:**
```bash
grep SpoolTrack ~/printer_data/logs/klippy.log
```

### Inaccurate Measurements

- Verify `filament_diameter` setting matches your actual filament
- Check for E-step calibration issues
- Ensure no extrusion conflicts with other plugins

### UUID Not Persisting

- UUID changes between prints by design
- Add `SET_SPOOL_UUID` to your start G-code
- Or set `default_spool_uuid` in config for testing

## Multi-Extruder Support

The plugin currently tracks the primary extruder (extruder0). For multi-extruder setups, usage from all extruders is combined.

Future versions may support per-extruder tracking with different UUIDs.

## Advanced Configuration

### Custom Material Density

To track materials other than PLA, modify the density constant in `spooltrack.py`:

```python
# Line ~125
# Default: PLA (1.24 g/cm³)
density = 1.24

# PETG: 1.27 g/cm³
# ABS: 1.04 g/cm³
# TPU: 1.21 g/cm³
```

### Adjust Update Frequency

Balance between real-time updates and network traffic:

```ini
# More frequent updates (every 30 seconds)
update_interval: 30

# Less frequent (every 5 minutes)
update_interval: 300
```

## Performance Impact

- **CPU Usage**: Negligible (~0.1%)
- **Network Traffic**: ~1 KB per update
- **Print Quality**: No impact on print performance

## Security Considerations

- Use API key authentication in production
- Consider HTTPS for sensitive environments
- Restrict API access to local network

## Integration Examples

### Orca Slicer Custom G-code

```gcode
; Start G-code
SET_SPOOL_UUID UUID={filament_spool_id}
G28
G29
; ... rest of start code
```

### Moonraker Integration

Add to `moonraker.conf`:

```ini
[spooltrack]
server_url: http://localhost:3000/api
api_key: ${secrets.spooltrack_api_key}
```

## Contributing

Found a bug or want to add a feature? Please submit issues and PRs to the main SpoolTrack repository.

## License

MIT License - See parent repository for details

## Support

- **Documentation**: https://github.com/yourusername/SpoolTrack/wiki
- **Issues**: https://github.com/yourusername/SpoolTrack/issues
- **Discord**: https://discord.gg/yourserver
