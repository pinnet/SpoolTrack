#!/bin/bash

# SpoolTrack Klipper Plugin Installer
# Quick installation script for the SpoolTrack plugin

set -e

echo "==========================================="
echo "SpoolTrack Klipper Plugin Installer"
echo "==========================================="
echo ""

# Variables
KLIPPER_EXTRAS_DIR="${HOME}/klipper/klippy/extras"
PLUGIN_FILE="spooltrack.py"
CONFIG_FILE="${HOME}/printer_data/config/printer.cfg"
BACKUP_DIR="${HOME}/spooltrack_backup"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Klipper is installed
if [ ! -d "${HOME}/klipper" ]; then
    echo -e "${RED}Error: Klipper installation not found at ${HOME}/klipper${NC}"
    echo "Please install Klipper first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Klipper installation found"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Download plugin if not present
if [ ! -f "${PLUGIN_FILE}" ]; then
    echo ""
    echo "Downloading SpoolTrack plugin..."
    
    if command -v wget &> /dev/null; then
        wget -q https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py
    elif command -v curl &> /dev/null; then
        curl -sO https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py
    else
        echo -e "${RED}Error: Neither wget nor curl found. Please install one of them.${NC}"
        exit 1
    fi
    
    if [ ! -f "${PLUGIN_FILE}" ]; then
        echo -e "${RED}Error: Failed to download plugin file${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Plugin downloaded"
fi

# Copy plugin to Klipper extras
echo ""
echo "Installing plugin..."

# Backup existing file if present
if [ -f "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    cp "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}" "${BACKUP_DIR}/${PLUGIN_FILE}.${TIMESTAMP}"
    echo -e "${YELLOW}!${NC} Existing plugin backed up to ${BACKUP_DIR}"
fi

# Copy new file
cp "${PLUGIN_FILE}" "${KLIPPER_EXTRAS_DIR}/"
chmod 644 "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}"

echo -e "${GREEN}✓${NC} Plugin installed to ${KLIPPER_EXTRAS_DIR}"

# Configuration
echo ""
echo "==========================================="
echo "Configuration"
echo "==========================================="
echo ""

read -p "Enter SpoolTrack server URL (e.g., http://192.168.1.100:3000/api): " SERVER_URL
read -p "Enter API key (press Enter to skip): " API_KEY
read -p "Enter default filament diameter in mm (default: 1.75): " DIAMETER
DIAMETER=${DIAMETER:-1.75}

# Create config snippet
CONFIG_SNIPPET="
# SpoolTrack Configuration (Added by installer on $(date))
[spooltrack]
server_url: ${SERVER_URL}
filament_diameter: ${DIAMETER}
update_interval: 60
"

if [ ! -z "${API_KEY}" ]; then
    CONFIG_SNIPPET="${CONFIG_SNIPPET}api_key: ${API_KEY}
"
fi

echo ""
echo "Configuration to be added:"
echo "-------------------------------------------"
echo "${CONFIG_SNIPPET}"
echo "-------------------------------------------"
echo ""

read -p "Add this configuration to printer.cfg? (y/n): " ADD_CONFIG

if [ "${ADD_CONFIG}" = "y" ] || [ "${ADD_CONFIG}" = "Y" ]; then
    # Backup printer.cfg
    if [ -f "${CONFIG_FILE}" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        cp "${CONFIG_FILE}" "${BACKUP_DIR}/printer.cfg.${TIMESTAMP}"
        echo -e "${YELLOW}!${NC} printer.cfg backed up to ${BACKUP_DIR}"
        
        # Add configuration
        echo "${CONFIG_SNIPPET}" >> "${CONFIG_FILE}"
        echo -e "${GREEN}✓${NC} Configuration added to printer.cfg"
    else
        echo -e "${YELLOW}!${NC} printer.cfg not found at ${CONFIG_FILE}"
        echo "Please add the configuration manually."
    fi
else
    echo -e "${YELLOW}!${NC} Configuration not added. Please add manually to printer.cfg"
fi

# Restart Klipper
echo ""
read -p "Restart Klipper now? (y/n): " RESTART_KLIPPER

if [ "${RESTART_KLIPPER}" = "y" ] || [ "${RESTART_KLIPPER}" = "Y" ]; then
    echo "Restarting Klipper..."
    sudo systemctl restart klipper
    
    # Wait a moment
    sleep 3
    
    # Check status
    if systemctl is-active --quiet klipper; then
        echo -e "${GREEN}✓${NC} Klipper restarted successfully"
    else
        echo -e "${RED}✗${NC} Klipper failed to restart. Check logs:"
        echo "    tail -f ~/printer_data/logs/klippy.log"
    fi
else
    echo -e "${YELLOW}!${NC} Please restart Klipper manually:"
    echo "    sudo systemctl restart klipper"
fi

# Final instructions
echo ""
echo "==========================================="
echo "Installation Complete!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Verify plugin is loaded: SPOOLTRACK_STATUS"
echo "2. Set spool UUID in your slicer start G-code:"
echo "   SET_SPOOL_UUID UUID=your-spool-uuid"
echo "3. Check logs if needed:"
echo "   tail -f ~/printer_data/logs/klippy.log | grep SpoolTrack"
echo ""
echo "Documentation: https://github.com/yourusername/SpoolTrack"
echo "==========================================="
