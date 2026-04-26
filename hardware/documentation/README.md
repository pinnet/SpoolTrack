# SpoolTrack Hardware Documentation

Technical documentation, assembly guides, and troubleshooting resources.

## Documentation Index

### Getting Started
- [Quick Start Guide](#quick-start-guide)
- [Bill of Materials (BOM)](#bill-of-materials)
- [Tools Required](#tools-required)

### Assembly Guides
- [Breadboard Prototype Assembly](breadboard-assembly.md)
- [PCB Assembly Guide](pcb-assembly.md)
- [Enclosure Assembly](enclosure-assembly.md)
- [Final Integration](final-assembly.md)

### Technical Documentation
- [Wiring Diagrams](wiring-diagrams.md)
- [Pin Mapping Reference](pinout-reference.md)
- [Power Requirements](power-specs.md)
- [I2C Address Map](i2c-addresses.md)

### Troubleshooting
- [Common Issues](troubleshooting-hardware.md)
- [Testing Procedures](testing-guide.md)
- [Debugging Guide](debugging-hardware.md)

### Advanced Topics
- [Battery Operation](battery-guide.md)
- [OTA Updates](ota-updates.md)
- [Custom Modifications](modifications.md)
- [Performance Tuning](performance-tuning.md)

## Quick Start Guide

### Step 1: Gather Components

**Minimum Required:**
- ESP32 development board
- PN532 NFC module
- OLED display (0.96" or 1.3")
- Breadboard and jumper wires
- USB cable

### Step 2: Wiring

Connect components using I2C shared bus:

```
ESP32 Pin → Component
-------------------------
3.3V      → PN532 VCC, OLED VCC
GND       → PN532 GND, OLED GND
GPIO21    → PN532 SDA, OLED SDA
GPIO22    → PN532 SCL, OLED SCL
```

### Step 3: Flash Firmware

1. Download firmware from `hardware/firmware/`
2. Open in Arduino IDE or PlatformIO
3. Configure `config.h` with your settings
4. Upload to ESP32

### Step 4: Test

1. Power on device
2. Check OLED displays "Scan Tag"
3. Hold NFC tag near reader
4. Verify tag is read successfully

### Step 5: Enclosure (Optional)

3D print case from `hardware/3MF/` folder.

## Bill of Materials

### Core Components

| Item | Specification | Quantity | Est. Cost | Link |
|------|---------------|----------|-----------|------|
| ESP32 DevKit | ESP32-WROOM-32 | 1 | $8 | [Buy](#) |
| PN532 Module | I2C NFC Reader | 1 | $10 | [Buy](#) |
| OLED Display | 0.96" I2C SSD1306 | 1 | $5 | [Buy](#) |
| NFC Tags | NTAG215 (10 pack) | 1 | $12 | [Buy](#) |
| Breadboard | 400 point | 1 | $3 | [Buy](#) |
| Jumper Wires | Male-Female (40pc) | 1 | $3 | [Buy](#) |
| USB Cable | Micro USB or USB-C | 1 | $3 | [Buy](#) |
| **TOTAL** | | | **~$44** | |

### Optional Components

| Item | Purpose | Quantity | Est. Cost |
|------|---------|----------|-----------|
| LiPo Battery | 3.7V 2000mAh | 1 | $10 |
| TP4056 Module | Battery charger | 1 | $2 |
| Push Buttons | User interface | 3 | $2 |
| Buzzer | Audio feedback | 1 | $2 |
| LEDs | Status indicators | 3 | $1 |
| Resistors | 330Ω for LEDs | 3 | $1 |
| Switch | Power on/off | 1 | $2 |

### PCB Version (Custom Board)

See `hardware/PCB/README.md` for complete BOM for custom PCB.

## Tools Required

### Essential
- ✅ Soldering iron (temperature controlled)
- ✅ Solder (0.8mm lead-free recommended)
- ✅ Wire strippers
- ✅ Small screwdriver set
- ✅ Multimeter (for testing)
- ✅ USB cable for programming

### Recommended
- 🔧 Helping hands/PCB holder
- 🔧 Soldering flux
- 🔧 Desoldering wick or pump
- 🔧 Tweezers (for SMD)
- 🔧 Wire cutters
- 🔧 Heat shrink tubing

### Optional
- 💡 Magnifying glass or microscope
- 💡 Hot air station (for SMD rework)
- 💡 Oscilloscope (for debugging)
- 💡 Logic analyzer (for I2C debugging)
- 💡 3D printer (for enclosure)

## Assembly Options Comparison

| Method | Difficulty | Time | Cost | Durability | Recommended For |
|--------|------------|------|------|------------|-----------------|
| **Breadboard** | Easy | 30min | Low | Temporary | Testing |
| **Perfboard** | Medium | 2hr | Low | Good | Budget build |
| **Custom PCB** | Medium | 3hr | Medium | Excellent | Production |

### Breadboard Prototype
**Pros:** No soldering, easy to modify, quick setup
**Cons:** Not permanent, less reliable, bulky
**Best for:** Development and testing

### Perfboard/Veroboard
**Pros:** Permanent, compact, low cost
**Cons:** Manual layout, time-consuming, no solder mask
**Best for:** One-off builds, learning

### Custom PCB
**Pros:** Professional, reliable, compact, repeatable
**Cons:** Requires PCB order, higher initial cost
**Best for:** Multiple units, final product

## Safety Guidelines

### Electrical Safety
- ⚠️ Always disconnect power before wiring
- ⚠️ Double-check polarity before powering on
- ⚠️ Use proper fuses for battery operation
- ⚠️ Avoid short circuits
- ⚠️ Keep liquids away from electronics

### Soldering Safety
- 🔥 Use in well-ventilated area
- 🔥 Don't touch hot parts
- 🔥 Use lead-free solder when possible
- 🔥 Wash hands after soldering
- 🔥 Keep iron in stand when not in use

### Battery Safety (If Using LiPo)
- 🔋 Never over-discharge (<3.0V)
- 🔋 Don't overcharge (>4.2V)
- 🔋 Monitor temperature during charging
- 🔋 Use proper charger (TP4056 recommended)
- 🔋 Store in fireproof container
- 🔋 Dispose properly if damaged/swollen

## Testing Procedures

### 1. Visual Inspection
- Check all connections
- Verify no solder bridges
- Confirm component orientation
- Look for cold solder joints

### 2. Power Test
- Connect USB power
- Measure voltage at 3.3V rail
- Check current draw (<300mA typical)
- Verify no heating components

### 3. Component Tests

**OLED Display:**
```cpp
// Upload test sketch to verify display
display.clearDisplay();
display.println("Test");
display.display();
```

**PN532 NFC:**
```cpp
// Check I2C communication
uint32_t version = nfc.getFirmwareVersion();
Serial.println(version, HEX);
```

**WiFi:**
```cpp
// Test WiFi connection
WiFi.begin(SSID, PASSWORD);
// Check connection status
```

### 4. Integration Test
- Upload full firmware
- Test all functions
- Verify server communication
- Test NFC tag reading

## Common Problems & Solutions

### Problem: Nothing Happens
**Check:**
- Power supply connected
- USB cable working (try different cable)
- ESP32 has firmware uploaded
- COM port selected correctly

### Problem: OLED Blank
**Solutions:**
- Check I2C address (0x3C vs 0x3D)
- Verify wiring (SDA/SCL not swapped)
- Run I2C scanner sketch
- Try different OLED library

### Problem: NFC Not Reading
**Solutions:**
- Verify PN532 in I2C mode (check switches)
- Confirm I2C address (0x24)
- Check wiring connections
- Reduce distance (try <1cm)
- Test with different NFC tags

### Problem: Won't Connect to WiFi
**Solutions:**
- Verify SSID/password in config
- Check 2.4GHz WiFi (not 5GHz)
- Move closer to router
- Check router MAC filtering
- Try different WiFi network

## Performance Specifications

### Power Consumption
- **Idle**: 80-120mA @ 3.3V
- **WiFi Active**: 150-200mA @ 3.3V
- **NFC Reading**: 180-250mA @ 3.3V
- **Peak**: 300mA @ 3.3V

### Operating Conditions
- **Temperature**: 0°C to 60°C
- **Humidity**: 20% to 80% RH (non-condensing)
- **Altitude**: 0 to 2000m
- **Storage**: -20°C to 70°C

### NFC Performance
- **Read Range**: 0-4cm (depends on tag)
- **Read Time**: 100-300ms
- **Supported Tags**: NTAG213/215/216, ISO14443A
- **Frequency**: 13.56 MHz

### Network Performance
- **WiFi Standard**: 802.11 b/g/n
- **Frequency**: 2.4 GHz only
- **Range**: 50m (open space)
- **Data Rate**: Up to 150 Mbps

## Maintenance

### Weekly
- Check connections if using breadboard
- Verify firmware still responding
- Test NFC reading

### Monthly
- Clean OLED display (soft cloth)
- Check for loose wires/connections
- Backup configuration
- Update firmware if available

### As Needed
- Replace damaged components
- Re-flash firmware after errors
- Clean dust from enclosure
- Tighten mounting screws

## Revision History

### Hardware
- **v1.0** (2026-04) - Initial release
  - Breadboard design
  - Basic enclosure

### Documentation
- **v1.0** (2026-04) - Initial documentation
  - Assembly guides
  - Troubleshooting

## Contributing

Found an issue or have an improvement?

1. Check existing issues on GitHub
2. Create detailed bug report with:
   - Hardware version
   - Problem description
   - Photos if applicable
   - Steps to reproduce
3. Submit pull request with fixes

## Support Resources

- **Hardware Forum**: [GitHub Discussions](https://github.com/yourusername/SpoolTrack/discussions)
- **Live Chat**: [Discord Server](https://discord.gg/yourserver)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **Wiki**: [Technical Wiki](https://github.com/yourusername/SpoolTrack/wiki)

## Additional Resources

### External Documentation
- [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- [PN532 User Manual](https://www.nxp.com/docs/en/user-guide/141520.pdf)
- [SSD1306 Datasheet](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf)
- [I2C Specification](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)

### Video Tutorials
- Assembly walkthrough (YouTube - Coming soon)
- Troubleshooting guide (YouTube - Coming soon)
- Advanced modifications (YouTube - Coming soon)

### Community Projects
- Custom PCB designs
- Alternative enclosures
- Firmware modifications
- Integration examples

## License

Hardware documentation licensed under CERN-OHL-P v2.

Documentation content licensed under CC BY-SA 4.0.

---

**Need help?** Check the troubleshooting guide or ask in our community forums!
