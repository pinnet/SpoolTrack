# SpoolTrack Hardware

Hardware designs and firmware for the SpoolTrack NFC reader device.

## Overview

The SpoolTrack hardware consists of an ESP32-based NFC reader with OLED display that allows you to scan filament spools equipped with OpenTag3D-compatible NFC tags.

## Components

### 📱 [Firmware](firmware/)
ESP32 firmware for reading NFC tags, displaying spool information, and communicating with the SpoolTrack web service.

**Features:**
- NFC tag reading (PN532)
- OLED display interface
- WiFi connectivity
- REST API integration
- OTA updates support

### 🔌 [PCB](PCB/)
Custom PCB design files for KiCad to create a compact, integrated SpoolTrack reader.

**Includes:**
- Schematic diagrams
- PCB layouts
- Bill of Materials (BOM)
- Assembly instructions

### 🖨️ [3MF](3MF/)
3D printable enclosure and mounting solutions for the SpoolTrack hardware.

**Includes:**
- Device enclosure
- Wall mount brackets
- Spool holder integration
- Stand designs

### 📚 [Documentation](documentation/)
Technical documentation, assembly guides, and troubleshooting resources.

## Quick Start

### What You Need

| Component | Specification | Quantity | Est. Cost |
|-----------|--------------|----------|-----------|
| ESP32 DevKit | ESP32-WROOM-32 | 1 | $5-10 |
| OLED Display | 0.96" or 1.3" I2C SSD1306/SH1106 | 1 | $3-8 |
| PN532 Module | NFC/RFID reader | 1 | $5-12 |
| NFC Tags | NTAG215 (recommended) | 10+ | $10-15 |
| Jumper Wires | Female-Female | 8 | $2-5 |
| USB Cable | Micro USB or USB-C | 1 | $2-5 |
| **Total** | | | **$27-55** |

### Assembly Options

#### Option 1: Breadboard Prototype
Perfect for testing and development.
- No soldering required
- Quick setup
- Easy modifications
- [Assembly Guide](documentation/breadboard-assembly.md)

#### Option 2: Custom PCB
Professional, compact solution.
- Order PCB from manufacturer
- Solder components
- 3D print enclosure
- [Assembly Guide](documentation/pcb-assembly.md)

#### Option 3: Perfboard/Veroboard
Budget-friendly permanent solution.
- Minimal tools required
- Customizable layout
- [Assembly Guide](documentation/perfboard-assembly.md)

## Wiring Diagram

### I2C Configuration (Recommended)

```
ESP32          PN532 (I2C Mode)         OLED Display
--------------------------------------------------------
3.3V    --->   VCC   ------------------> VCC
GND     --->   GND   ------------------> GND
GPIO21  --->   SDA   ------------------> SDA
GPIO22  --->   SCL   ------------------> SCL
```

**Note:** Both PN532 and OLED share the same I2C bus.

### PN532 Mode Configuration

Set PN532 to I2C mode using onboard switches:
```
CH1: OFF
CH2: ON
```

## Firmware Installation

### Using Arduino IDE

1. Install ESP32 board support
2. Install required libraries
3. Configure WiFi credentials
4. Upload firmware
5. Test functionality

**[Detailed Instructions](firmware/README.md)**

### Using PlatformIO

1. Open project in PlatformIO
2. Edit `config.h`
3. Build and upload
4. Monitor serial output

## Supported OLED Displays

| Size | Resolution | Driver | I2C Address |
|------|------------|--------|-------------|
| 0.96" | 128x64 | SSD1306 | 0x3C |
| 1.3" | 128x64 | SH1106 | 0x3C |
| 0.91" | 128x32 | SSD1306 | 0x3C |

## NFC Tag Compatibility

- ✅ NTAG213 (144 bytes)
- ✅ NTAG215 (504 bytes) - **Recommended**
- ✅ NTAG216 (888 bytes)
- ✅ ISO14443A compatible
- ❌ Mifare Classic (not OpenTag3D compatible)

## Power Options

### USB Power
- Standard 5V USB power
- Typical consumption: 120-250mA
- Suitable for desktop use

### Battery Power
- 3.7V LiPo battery with charger module
- Estimated runtime: 8-12 hours (2000mAh)
- Optional for portable use

### External Power
- 5V DC power supply
- 500mA minimum recommended
- For permanent installations

## Features by Version

### v1.0 (Current)
- [x] NFC tag reading
- [x] OLED display output
- [x] WiFi connectivity
- [x] REST API integration
- [x] Basic UI navigation
- [x] OpenTag3D support

### v1.1 (In Development)
- [ ] Tactile button controls
- [ ] Battery level indicator
- [ ] SD card logging
- [ ] Offline cache mode
- [ ] Multi-language support

### v2.0 (Planned)
- [ ] Bluetooth connectivity
- [ ] Mobile app integration
- [ ] E-ink display option
- [ ] Environmental sensors
- [ ] Custom PCB design

## Building the Hardware

### Step 1: Order Components
See BOM in [documentation/BOM.md](documentation/BOM.md)

### Step 2: Prepare Firmware
Follow [firmware setup guide](firmware/README.md)

### Step 3: Assemble Hardware
Choose your assembly method and follow the corresponding guide

### Step 4: Install in Enclosure
3D print case from [3MF folder](3MF/) and assemble

### Step 5: Test and Calibrate
Run diagnostic tests and configure settings

## Troubleshooting

### NFC Reader Not Detected
- Check I2C connections
- Verify PN532 mode switches
- Test I2C scanner sketch
- Check power supply

### OLED Not Displaying
- Verify I2C address (0x3C or 0x78)
- Check wiring connections
- Try different OLED library
- Test with example sketch

### WiFi Connection Issues
- Verify credentials in config
- Check 2.4GHz WiFi availability
- Monitor serial output
- Review firewall settings

### No Communication with Server
- Ping server from ESP32 network
- Check API endpoint URL
- Verify API key
- Review server logs

## PCB Manufacturing

### Recommended Manufacturers
- **JLCPCB** - Low cost, fast shipping
- **PCBWay** - Quality builds, good support
- **OSH Park** - USA-based, premium quality
- **Seeed Studio** - Good for prototypes

### Upload Files
- Gerber files from PCB folder
- Select specifications (1.6mm, HASL, Green)
- Order quantity (5-10 for prototyping)

## Case Printing

### Recommended Settings
```
Layer Height: 0.2mm
Infill: 20%
Supports: Yes (for mounting holes)
Material: PLA or PETG
Print Time: ~3-4 hours
Filament: ~50-80g
```

## Contributing

We welcome hardware improvements!

### How to Contribute
- Submit PCB improvements
- Design alternative enclosures
- Create mounting solutions
- Write documentation
- Report hardware issues

### Design Guidelines
- Use KiCad 6.0+ for PCB designs
- Include 3D STEP models
- Document all modifications
- Test before submitting

## Safety & Compliance

### Electrical Safety
- Use proper power supplies
- Avoid short circuits
- Follow ESD precautions
- Don't exceed voltage ratings

### FCC/CE Compliance
This is a development project. If manufacturing commercially:
- Conduct EMC testing
- Obtain certifications
- Follow local regulations

## Support

- **Hardware Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **PCB Questions**: [Discussions](https://github.com/yourusername/SpoolTrack/discussions)
- **Assembly Help**: [Discord](https://discord.gg/yourserver)
- **Documentation**: [Wiki](https://github.com/yourusername/SpoolTrack/wiki)

## License

Hardware designs are licensed under CERN-OHL-P v2.

Firmware is licensed under MIT License.

See individual folders for specific license details.

## Acknowledgments

- Adafruit for excellent NFC libraries
- ESP32 community for Arduino support
- OpenTag3D contributors for the standard
- Community members for testing and feedback

---

**Ready to build?** Start with the [firmware setup guide](firmware/README.md)!
