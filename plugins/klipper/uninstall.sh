# SpoolTrack Klipper Plugin - Uninstall Script

set -e

echo "==========================================="
echo "SpoolTrack Klipper Plugin Uninstaller"
echo "==========================================="
echo ""

KLIPPER_EXTRAS_DIR="${HOME}/klipper/klippy/extras"
PLUGIN_FILE="spooltrack.py"
CONFIG_FILE="${HOME}/printer_data/config/printer.cfg"
BACKUP_DIR="${HOME}/spooltrack_backup"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create backup
mkdir -p "${BACKUP_DIR}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Remove plugin file
if [ -f "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}" ]; then
    cp "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}" "${BACKUP_DIR}/${PLUGIN_FILE}.${TIMESTAMP}"
    rm "${KLIPPER_EXTRAS_DIR}/${PLUGIN_FILE}"
    echo -e "${GREEN}✓${NC} Plugin removed (backed up to ${BACKUP_DIR})"
else
    echo -e "${YELLOW}!${NC} Plugin file not found"
fi

# Remove config section
if [ -f "${CONFIG_FILE}" ]; then
    cp "${CONFIG_FILE}" "${BACKUP_DIR}/printer.cfg.${TIMESTAMP}"
    
    # Remove [spooltrack] section
    sed -i '/^# SpoolTrack Configuration/,/^$/d' "${CONFIG_FILE}"
    sed -i '/^\[spooltrack\]/,/^$/d' "${CONFIG_FILE}"
    
    echo -e "${GREEN}✓${NC} Configuration removed from printer.cfg (backed up)"
else
    echo -e "${YELLOW}!${NC} printer.cfg not found"
fi

echo ""
read -p "Restart Klipper now? (y/n): " RESTART

if [ "${RESTART}" = "y" ] || [ "${RESTART}" = "Y" ]; then
    sudo systemctl restart klipper
    echo -e "${GREEN}✓${NC} Klipper restarted"
fi

echo ""
echo "Uninstallation complete!"
echo "Backups saved to: ${BACKUP_DIR}"
