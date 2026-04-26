# SpoolTrack

<div align="center">

**A Smart 3D Printer Filament Management System**

Track your filament spools with NFC technology, monitor usage in real-time, and never run out mid-print again.

[![OpenTag3D Compatible](https://img.shields.io/badge/OpenTag3D-Compatible-blue)](https://github.com/HWHardsoft/OpenTag3D)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📋 Overview

SpoolTrack is an intelligent filament management solution for 3D printing enthusiasts and professionals. Using NFC technology and the OpenTag3D standard, it automatically tracks your filament inventory, monitors usage during prints, and provides real-time information about spool weight, age, humidity exposure, and remaining material.

### Key Features

- 🏷️ **NFC Tag Reading**: Scan OpenTag3D-compatible NFC tags for instant spool identification
- 📊 **Real-time Tracking**: Monitor filament usage during active prints via Orca Slicer/Klipper integration
- 🌐 **Web Dashboard**: Manage your entire filament inventory from any device
- 📱 **OLED Display**: View spool information directly on the ESP32 device
- 💧 **Environmental Monitoring**: Track humidity exposure and material age
- ⚡ **Automatic Updates**: Usage data syncs automatically between printer and web app
- 📈 **Analytics**: Historical data on filament consumption and spool lifecycle

---

## 🔧 Hardware Requirements

### Core Components

| Component | Description | Quantity |
|-----------|-------------|----------|
| **ESP32** | Microcontroller with WiFi | 1 |
| **OLED Display** | 0.96" or 1.3" I2C OLED (SSD1306/SH1106) | 1 |
| **PN532 NFC Module** | NFC reader supporting ISO14443A | 1 |
| **NFC Tags** | NTAG213/215/216 (OpenTag3D compatible) | Per spool |

### Wiring Diagram

```
ESP32          PN532 (I2C Mode)
-----------------------------
3.3V    --->   VCC
GND     --->   GND
GPIO21  --->   SDA
GPIO22  --->   SCL

ESP32          OLED Display
-----------------------------
3.3V    --->   VCC
GND     --->   GND
GPIO21  --->   SDA
GPIO22  --->   SCL
```

> **Note**: Both the OLED and PN532 can share the same I2C bus as shown above.

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   3D Printer    │
│ (Klipper/Orca)  │
└────────┬────────┘
         │ Usage Reports
         ▼
┌─────────────────┐      ┌──────────────┐
│   Web Service   │◄────►│   Database   │
│   (REST API)    │      │  (Inventory) │
└────────┬────────┘      └──────────────┘
         │ Sync
         ▼
┌─────────────────┐      ┌──────────────┐
│  ESP32 Device   │◄────►│  NFC Reader  │
│  (OLED Screen)  │      │   (PN532)    │
└─────────────────┘      └──────────────┘
         │
         ▼
    [NFC Tags on Spools]
```

### Components

1. **ESP32 Device**: Reads NFC tags, displays spool info, communicates with web service
2. **Web Service**: Central management system with REST API for inventory tracking
3. **Printer Plugin**: Orca Slicer/Klipper plugin that reports actual filament usage
4. **NFC Tags**: OpenTag3D-compatible tags attached to each filament spool

---

## � Hardware

SpoolTrack includes complete hardware designs for building your own NFC reader device:

### 🔌 [ESP32 Firmware](hardware/firmware/)
Arduino-based firmware with NFC reading, OLED display, and WiFi connectivity.

**Features:** PN532 integration, SSD1306/SH1106 support, OTA updates, offline caching

### 🔧 [Custom PCB](hardware/PCB/)
KiCad design files for a professional integrated board.

**Includes:** Schematics, PCB layouts, Gerber files, BOM

### 🖨️ [3D Printable Cases](hardware/3MF/)
Enclosures and mounting solutions for your device.

**Options:** Wall mount, desk stand, spool holder clips, printer frame mounts

### 📚 [Hardware Documentation](hardware/documentation/)
Assembly guides, wiring diagrams, and troubleshooting resources.

**[📖 Hardware Quick Start Guide](hardware/README.md)**

---

## �🚀 Getting Started

### Prerequisites

- [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/)
- [Node.js](https://nodejs.org/) (v16 or higher) for web service
- [Python 3.x](https://www.python.org/) for Klipper plugin
- OpenTag3D-compatible NFC tags

### Installation

#### 1. ESP32 Firmware

```bash
# Clone the repository
git clone https://github.com/yourusername/SpoolTrack.git
cd SpoolTrack/firmware

# Copy config template
cp config.h.example config.h

# Edit config.h with your WiFi credentials and web service URL
nano config.h

# Upload to ESP32 using Arduino IDE or PlatformIO
```

**Required Libraries:**
- Adafruit PN532
- Adafruit GFX
- Adafruit SSD1306
- ArduinoJson
- ESP32 WiFi

#### 2. Web Service

```bash
# Navigate to web service directory
cd SpoolTrack/webservice

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Set database connection, port, etc.

# Initialize database
npm run migrate

# Start the service
npm start
```

The web interface will be available at `http://localhost:3000`

#### 3. Orca Slicer Plugin

```bash
# Copy plugin to Orca Slicer plugins directory
cp plugins/orca-slicer/spooltrack.py ~/.config/OrcaSlicer/plugins/

# Configure plugin settings in Orca Slicer
# Set web service URL and API key
```

#### 4. Klipper Plugin

```bash
# SSH into your Klipper host
ssh pi@your-printer-ip

# Copy plugin files
cd ~/klipper/klippy/extras/
wget https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py

# Add to printer.cfg
echo "[spooltrack]" >> ~/printer_data/config/printer.cfg
echo "server_url: http://your-server-ip:3000/api" >> ~/printer_data/config/printer.cfg
echo "api_key: your-api-key" >> ~/printer_data/config/printer.cfg
echo "filament_diameter: 1.75" >> ~/printer_data/config/printer.cfg

# Restart Klipper
sudo systemctl restart klipper
```

**Usage in G-code:**
```gcode
; Set spool UUID before printing
SET_SPOOL_UUID UUID=your-spool-uuid-here
```

**[📖 Full Klipper Plugin Documentation](plugins/klipper/README.md)**

---

## 📖 Usage

### Initial Setup

1. **Register Spools in Web Interface**
   - Navigate to web dashboard
   - Click "Add New Spool"
   - Enter spool details (manufacturer, material, weight, color, etc.)
   - System generates OpenTag3D data

2. **Write NFC Tags**
   - Use the ESP32 device in "Write Mode" or web interface NFC writer
   - Scan blank NFC tag
   - Select spool from inventory to write to tag
   - Attach tag to physical spool

3. **Start Tracking**
   - Mount ESP32 device near your printer
   - Scan spool before starting print
   - Device displays current spool information
   - Usage automatically tracked during print

### Reading Spool Information

1. Power on the ESP32 device
2. Hold NFC tag near the PN532 reader
3. OLED displays:
   - Material type and color
   - Manufacturer and brand
   - Remaining weight
   - Age and humidity exposure
   - Last used date

### Monitoring via Web Dashboard

The web interface provides:
- **Inventory Overview**: All spools with status indicators
- **Usage Analytics**: Charts showing consumption over time
- **Low Stock Alerts**: Notifications when spools are running low
- **Environmental Tracking**: Humidity and temperature logs
- **Print History**: Which spools were used for each print

---

## 🏷️ OpenTag3D Standard Support

SpoolTrack fully implements the [OpenTag3D specification](https://github.com/HWHardsoft/OpenTag3D), ensuring compatibility with:

- **Standardized Data Format**: Material type, color, weight, diameter
- **Manufacturer Information**: Brand, product name, lot number
- **User Data Storage**: Custom fields for tracking
- **Interoperability**: Works with other OpenTag3D-compatible systems

### Supported Tag Types

- NTAG213 (144 bytes user memory)
- NTAG215 (504 bytes user memory) - Recommended
- NTAG216 (888 bytes user memory)

### Data Structure

```json
{
  "version": "1.0",
  "material": "PLA",
  "color": "Galaxy Black",
  "weight": 1000,
  "diameter": 1.75,
  "manufacturer": "Polymaker",
  "remaining": 750,
  "firstUsed": "2026-01-15",
  "lastUsed": "2026-04-20",
  "humidity": 45
}
```

---

## 🎨 Features in Detail

### Web Service Features

- **RESTful API**: Complete API for integration with other tools
- **User Authentication**: Secure multi-user support
- **Inventory Management**: Add, edit, delete, and organize spools
- **Batch Operations**: Update multiple spools at once
- **Export/Import**: CSV and JSON support for data portability
- **Backup/Restore**: Automated database backups

### ESP32 Device Features

- **WiFi Connectivity**: Automatic reconnection and OTA updates
- **Multiple Display Modes**: 
  - Spool information display
  - Real-time usage during print
  - Inventory summary
  - System status
- **Offline Mode**: Cache recent spools for offline operation
- **Button Controls**: Navigate menus without web interface

### Printer Plugin Features

- **Automatic Tracking**: No manual intervention during prints
- **Pause/Resume Support**: Accurate tracking even with interrupted prints
- **Multi-Extruder Support**: Track usage per extruder
- **Filament Change Detection**: Automatic updates when switching spools
- **Waste Calculation**: Account for purge towers and support material

---

## 🛠️ Configuration

### Web Service Configuration

Edit `.env` file:

```env
PORT=3000
DATABASE_URL=sqlite:./spooltrack.db
JWT_SECRET=your-secret-key
API_RATE_LIMIT=100
LOG_LEVEL=info
```

### ESP32 Configuration

Edit `config.h`:

```cpp
#define WIFI_SSID "YourNetworkName"
#define WIFI_PASSWORD "YourPassword"
#define SERVER_URL "http://192.168.1.100:3000/api"
#define API_KEY "your-api-key"
#define OLED_WIDTH 128
#define OLED_HEIGHT 64
#define UPDATE_INTERVAL 5000  // ms
```

---

## 📊 API Documentation

### Endpoints

```
GET    /api/spools              - List all spools
GET    /api/spools/:id          - Get spool details
POST   /api/spools              - Create new spool
PUT    /api/spools/:id          - Update spool
DELETE /api/spools/:id          - Delete spool
POST   /api/usage               - Report filament usage
GET    /api/analytics           - Get usage statistics
POST   /api/nfc/read            - Process NFC tag data
POST   /api/nfc/write           - Generate NFC write data
```

Full API documentation available at: `http://localhost:3000/api/docs`

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

See our [Contributors](CONTRIBUTORS.md) page to recognize everyone who has helped make SpoolTrack possible.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/SpoolTrack.git
cd SpoolTrack

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push and create pull request
git push origin feature/amazing-feature
```

---

## 🐛 Troubleshooting

### ESP32 Won't Connect to WiFi

- Verify SSID and password in `config.h`
- Check 2.4GHz WiFi compatibility (ESP32 doesn't support 5GHz)
- Ensure router is not using MAC filtering

### NFC Tags Not Reading

- Check PN532 wiring and I2C address
- Verify tag compatibility (NTAG213/215/216)
- Ensure tag is properly formatted for OpenTag3D

### Usage Not Syncing from Printer

- Verify web service URL in plugin configuration
- Check API key is valid
- Ensure printer has network connectivity
- Review plugin logs for error messages

---

## 📝 Roadmap

- [ ] Mobile app for iOS and Android
- [ ] Bluetooth support for ESP32 device
- [ ] Integration with Bambu Lab printers
- [ ] Temperature sensor support
- [ ] Automatic reorder suggestions
- [ ] Cloud sync option
- [ ] Multi-language support
- [ ] Prusaslicer plugin

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenTag3D](https://github.com/HWHardsoft/OpenTag3D) - For the NFC tag standard
- [Adafruit](https://www.adafruit.com/) - For excellent hardware libraries
- [Klipper](https://www.klipper3d.org/) - For the extensible firmware
- [Orca Slicer](https://github.com/SoftFever/OrcaSlicer) - For plugin support

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SpoolTrack/discussions)
- **Discord**: [Join our community](https://discord.gg/yourserver)
- **Wiki**: [Documentation Wiki](https://github.com/yourusername/SpoolTrack/wiki)

---

<div align="center">

**Made with ❤️ for the 3D printing community**

[⭐ Star on GitHub](https://github.com/yourusername/SpoolTrack) | [🐛 Report Bug](https://github.com/yourusername/SpoolTrack/issues) | [💡 Request Feature](https://github.com/yourusername/SpoolTrack/issues)

</div>
