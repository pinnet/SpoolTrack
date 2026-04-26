# SpoolTrack ESP32 Firmware

Arduino-based firmware for the SpoolTrack NFC reader device.

## Features

- 📡 NFC tag reading with PN532
- 📺 OLED display support (SSD1306/SH1106)
- 🌐 WiFi connectivity and REST API integration
- 🏷️ OpenTag3D standard support
- 🔄 Automatic synchronization with web service
- ⚙️ Over-the-Air (OTA) updates
- 💾 Offline caching of recent scans

## Hardware Requirements

- ESP32 development board (ESP32-WROOM-32 or similar)
- PN532 NFC/RFID module (I2C mode)
- OLED display 0.96" or 1.3" (I2C, SSD1306 or SH1106)
- USB cable for programming
- NTAG215 NFC tags

## Pin Configuration

```cpp
// I2C Pins (shared)
#define I2C_SDA 21
#define I2C_SCL 22

// OLED Display
#define OLED_WIDTH 128
#define OLED_HEIGHT 64
#define OLED_ADDRESS 0x3C

// Optional: Buttons (if using physical controls)
#define BTN_SELECT 4
#define BTN_PREV 16
#define BTN_NEXT 17
```

## Software Dependencies

### Arduino IDE

Install these libraries via Library Manager:
- **Adafruit PN532** (v1.3.0+)
- **Adafruit GFX** (v1.11.0+)
- **Adafruit SSD1306** (v2.5.0+)
- **ArduinoJson** (v6.21.0+)
- **WiFi** (bundled with ESP32)
- **HTTPClient** (bundled with ESP32)

### PlatformIO

Dependencies are automatically managed via `platformio.ini`.

## Installation

### Method 1: Arduino IDE

1. **Install ESP32 Board Support:**
   - Open Arduino IDE
   - Go to File → Preferences
   - Add to Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Board Manager
   - Search "ESP32" and install

2. **Install Libraries:**
   - Sketch → Include Library → Manage Libraries
   - Install all required libraries listed above

3. **Configure:**
   - Copy `config.h.example` to `config.h`
   - Edit `config.h` with your settings:
     ```cpp
     #define WIFI_SSID "YourNetworkName"
     #define WIFI_PASSWORD "YourPassword"
     #define SERVER_URL "http://192.168.1.100:3000/api"
     #define API_KEY "your-api-key"
     ```

4. **Upload:**
   - Connect ESP32 via USB
   - Select Tools → Board → ESP32 Dev Module
   - Select correct COM port
   - Click Upload

### Method 2: PlatformIO

```bash
# Clone repository and navigate to firmware
cd hardware/firmware

# Build project
pio run

# Upload to device
pio run --target upload

# Monitor serial output
pio device monitor
```

## Configuration

### WiFi Settings

Edit `config.h`:
```cpp
#define WIFI_SSID "YourNetwork"
#define WIFI_PASSWORD "YourPassword"
#define WIFI_TIMEOUT_MS 20000
```

### Server Settings

```cpp
#define SERVER_URL "http://192.168.1.100:3000/api"
#define API_KEY "your-api-key-here"
#define UPDATE_INTERVAL 5000  // milliseconds
```

### Display Settings

```cpp
#define OLED_WIDTH 128
#define OLED_HEIGHT 64
#define OLED_RESET -1  // Reset pin (or -1 if sharing ESP reset pin)
#define SCREEN_TIMEOUT 30000  // Turn off after 30 seconds
```

### NFC Settings

```cpp
#define NFC_TIMEOUT 100  // milliseconds
#define NFC_RETRY_DELAY 500
#define MAX_NFC_RETRIES 3
```

## Usage

### Power On
Device boots and connects to WiFi automatically.

### Scan NFC Tag
1. Hold NFC tag near PN532 reader
2. Wait for beep/vibration (if available)
3. View spool information on OLED
4. Data automatically synced to server

### Display Modes

**Mode 1: Idle Screen**
- Shows device status
- WiFi connection indicator
- Last scan timestamp

**Mode 2: Spool Information**
- Material type and color
- Manufacturer and brand
- Remaining weight
- Age and humidity data

**Mode 3: System Status**
- IP address
- Server connection status
- Memory usage
- Uptime

### Button Controls (Optional)

If physical buttons are installed:
- **SELECT**: Switch display modes
- **PREV**: Scroll up through cached spools
- **NEXT**: Scroll down through cached spools

## Serial Commands

Connect via serial monitor (115200 baud) for debugging:

```
help        - Show available commands
status      - Display system status
wifi        - Show WiFi information
scan        - Read NFC tag
server      - Test server connection
reboot      - Restart device
clear       - Clear OLED display
cache       - Show cached spools
```

## OTA Updates

Enable OTA in `config.h`:
```cpp
#define ENABLE_OTA true
#define OTA_HOSTNAME "spooltrack"
#define OTA_PASSWORD "your-ota-password"
```

Update via Arduino IDE:
- Tools → Port → Network Ports → spooltrack

## Troubleshooting

### Device Won't Connect to WiFi

**Check:**
- SSID and password are correct
- Router uses 2.4GHz (ESP32 doesn't support 5GHz)
- MAC filtering is disabled or ESP32 is allowed
- Signal strength is adequate

**Debug:**
```cpp
Serial.println(WiFi.status());
// WL_CONNECTED = 3
// WL_NO_SSID_AVAIL = 1
// WL_CONNECT_FAILED = 4
```

### NFC Reader Not Working

**Check:**
- PN532 is in I2C mode (CH1=OFF, CH2=ON)
- Correct I2C address (usually 0x24)
- Wiring is correct (SDA=21, SCL=22)
- Power supply is adequate (3.3V, 100mA+)

**Test:**
```cpp
// Run I2C scanner sketch first
// Should detect PN532 at 0x24
```

### OLED Display Blank

**Check:**
- I2C address (0x3C or 0x3D)
- Display initialization in code
- Power connections
- Try different OLED library version

**Test:**
```cpp
// Try basic display test
display.clearDisplay();
display.setTextSize(1);
display.setTextColor(SSD1306_WHITE);
display.setCursor(0, 0);
display.println("Test");
display.display();
```

### Server Connection Fails

**Check:**
- Server is running and accessible
- Correct URL in config
- API key is valid
- Firewall allows connections
- ESP32 can ping server

**Debug:**
```cpp
Serial.print("HTTP Response: ");
Serial.println(httpResponseCode);
```

### Memory Issues

ESP32 has limited RAM. If experiencing crashes:
- Reduce string buffer sizes
- Limit cached spool count
- Decrease update frequency
- Monitor heap usage

## File Structure

```
firmware/
├── SpoolTrack.ino          # Main sketch
├── config.h.example        # Configuration template
├── config.h                # Your configuration (gitignored)
├── display.cpp/h           # OLED display functions
├── nfc.cpp/h              # NFC reader functions
├── network.cpp/h          # WiFi and HTTP functions
├── storage.cpp/h          # SPIFFS/preferences storage
├── ui.cpp/h               # User interface logic
├── platformio.ini         # PlatformIO configuration
└── README.md              # This file
```

## Development

### Building from Source

```bash
# Arduino CLI
arduino-cli compile --fqbn esp32:esp32:esp32 SpoolTrack

# PlatformIO
pio run
```

### Running Tests

```bash
pio test
```

### Code Style

Follow Arduino style guide:
- 2 spaces for indentation
- camelCase for functions and variables
- UPPER_CASE for constants

### Adding Features

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

## Performance

### Typical Operation
- **Boot time**: 3-5 seconds
- **NFC scan**: 100-300ms
- **Display update**: <50ms
- **Server sync**: 200-500ms
- **Power consumption**: 120-180mA

### Memory Usage
- **Flash**: ~800KB / 4MB
- **Heap**: ~120KB / 320KB
- **Stack**: ~8KB

## Known Issues

1. **WiFi Reconnection**: Occasional failures after router restart
   - Workaround: Watchdog reset after 60s no connection

2. **I2C Bus Conflicts**: Rare hangs with multiple devices
   - Workaround: Add pull-up resistors (4.7kΩ)

3. **OLED Ghosting**: Image retention on some displays
   - Workaround: Periodic full clear

## Roadmap

### v1.1
- [ ] Battery level monitoring
- [ ] Deep sleep mode
- [ ] SD card support for logging
- [ ] Buzzer feedback
- [ ] Multi-language UI

### v2.0
- [ ] Bluetooth connectivity
- [ ] Mobile app pairing
- [ ] Touchscreen support
- [ ] Advanced analytics on device
- [ ] QR code generation

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test on real hardware
5. Submit pull request

## License

GPL-3.0-or-later - See [LICENSE](LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **Forum**: [Discussions](https://github.com/yourusername/SpoolTrack/discussions)
- **Chat**: [Discord](https://discord.gg/yourserver)

## Credits

- Adafruit for NFC and display libraries
- ESP32 community
- OpenTag3D standard contributors
