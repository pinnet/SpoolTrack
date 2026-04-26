# SpoolTrack Project Structure

Complete overview of the SpoolTrack repository organization.

## Directory Structure

```
SpoolTrack/
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # 15-minute setup guide
├── LICENSE                            # AGPL-3.0-or-later (root/webservice)
├── .gitignore                         # Root gitignore
│
├── webservice/                        # Web Service & API
│   ├── src/
│   │   ├── index.js                   # Express server entry point
│   │   ├── controllers/               # Request handlers
│   │   ├── routes/                    # API route definitions
│   │   ├── middleware/                # Express middleware
│   │   ├── database/                  # SQLite database setup
│   │   └── utils/                     # Utility functions
│   ├── data/                          # Database files (gitignored)
│   ├── logs/                          # Application logs
│   ├── package.json                   # Node.js dependencies
│   ├── Dockerfile                     # Multi-stage Docker build
│   ├── docker-compose.dev.yml         # Development container
│   ├── docker-compose.prod.yml        # Production container
│   ├── .env.example                   # Environment template
│   ├── .gitignore                     # Service-specific ignores
│   └── README.md                      # Service documentation
│
├── plugins/                           # Printer Software Plugins
│   ├── klipper/                       # Klipper integration
│   │   ├── spooltrack.py              # Main plugin (350+ lines)
│   │   ├── printer.cfg.example        # Configuration example
│   │   ├── install.sh                 # Automated installer
│   │   ├── uninstall.sh               # Uninstaller
│   │   ├── EXAMPLES.md                # Usage examples
│   │   └── README.md                  # Plugin documentation
│   ├── orca-slicer/                   # Orca Slicer (planned)
│   ├── prusaslicer/                   # PrusaSlicer (planned)
│   └── README.md                      # Plugins overview
│
├── hardware/                          # Hardware Designs
│   ├── firmware/                      # ESP32 Firmware
│   │   ├── SpoolTrack.ino             # Main Arduino sketch
│   │   ├── config.h.example           # Configuration template
│   │   ├── platformio.ini             # PlatformIO config
│   │   └── README.md                  # Firmware documentation
│   │
│   ├── PCB/                           # Circuit Board Design
│   │   ├── SpoolTrack.kicad_pro       # KiCad project (TBA)
│   │   ├── SpoolTrack.kicad_sch       # Schematic (TBA)
│   │   ├── SpoolTrack.kicad_pcb       # PCB layout (TBA)
│   │   ├── gerbers/                   # Manufacturing files
│   │   ├── 3d/                        # 3D models (STEP)
│   │   └── README.md                  # PCB documentation
│   │
│   ├── 3MF/                           # 3D Printable Parts
│   │   ├── SpoolTrack-Case-Top.3mf    # Top enclosure (TBA)
│   │   ├── SpoolTrack-Case-Bottom.3mf # Bottom enclosure (TBA)
│   │   ├── Wall-Mount-Bracket.3mf     # Wall mount (TBA)
│   │   ├── Desk-Stand.3mf             # Desk stand (TBA)
│   │   ├── Frame-Mount-2020.3mf       # Extrusion mount (TBA)
│   │   └── README.md                  # 3D printing guide
│   │
│   ├── documentation/                 # Technical Docs
│   │   ├── breadboard-assembly.md     # Prototype guide
│   │   ├── pcb-assembly.md            # PCB build guide
│   │   ├── wiring-diagrams.md         # Connection diagrams
│   │   ├── troubleshooting.md         # Problem solving
│   │   └── README.md                  # Documentation index
│   │
│   ├── .gitignore                     # Hardware ignores
│   └── README.md                      # Hardware overview
│
└── docs/                              # Additional Documentation
    ├── API.md                         # API reference
    ├── CONTRIBUTING.md                # Contribution guidelines
    ├── CHANGELOG.md                   # Version history
    └── TROUBLESHOOTING.md             # Common issues
```

## Component Breakdown

### Web Service (`/webservice`)
**Purpose:** Central management system for filament inventory  
**Tech Stack:** Node.js, Express, SQLite, Docker  
**Key Features:**
- RESTful API for spool management
- Usage tracking and analytics
- User authentication
- NFC tag data processing
- OpenTag3D support

**Entry Points:**
- Development: `npm run dev`
- Docker: `npm run docker:dev`
- Production: `npm run docker:prod`

### Klipper Plugin (`/plugins/klipper`)
**Purpose:** Automatic filament usage tracking during prints  
**Tech Stack:** Python 3, Klipper API  
**Key Features:**
- E-axis monitoring
- Real-time usage calculation
- UUID-based spool identification
- Periodic server updates
- Offline caching

**Installation:** `bash install.sh` on Klipper host

### ESP32 Firmware (`/hardware/firmware`)
**Purpose:** NFC reader device with display  
**Tech Stack:** Arduino/ESP32, C++  
**Key Features:**
- PN532 NFC reading
- OLED display (SSD1306/SH1106)
- WiFi connectivity
- REST API client
- OTA updates

**Build:** Arduino IDE or PlatformIO

### PCB Design (`/hardware/PCB`)
**Purpose:** Custom integrated circuit board  
**Tech Stack:** KiCad 7.0  
**Key Features:**
- ESP32-WROOM-32 integration
- PN532 circuit
- USB-C power/programming
- Battery charging (optional)
- Compact design

**Status:** Design templates ready, full design TBA

### 3D Models (`/hardware/3MF`)
**Purpose:** Enclosures and mounting solutions  
**Tech Stack:** 3MF, STEP files  
**Key Features:**
- Main enclosure (snap-fit)
- Wall mounts
- Desk stands
- Printer frame clips
- Customizable

**Status:** Design templates ready, models TBA

## Development Workflow

### Working on Web Service
```bash
cd webservice
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Working on Klipper Plugin
```bash
# Edit plugins/klipper/spooltrack.py
# Copy to Klipper host
scp spooltrack.py pi@printer:/home/pi/klipper/klippy/extras/
# Restart Klipper
ssh pi@printer "sudo systemctl restart klipper"
```

### Working on Firmware
```bash
cd hardware/firmware
# Copy config template
cp config.h.example config.h
# Edit config.h with your settings

# Option 1: Arduino IDE
# Open SpoolTrack.ino and upload

# Option 2: PlatformIO
pio run --target upload
pio device monitor
```

### Working on PCB
```bash
cd hardware/PCB
# Open with KiCad 7.0+
# Edit schematic → Update PCB → Generate Gerbers
```

### Working on 3D Models
```bash
cd hardware/3MF
# Edit with Fusion 360, FreeCAD, or Blender
# Export as 3MF or STL
```

## File Naming Conventions

### Code Files
- **Lowercase with hyphens:** `spool-controller.js`
- **CamelCase for classes:** `SpoolController.js`
- **Snake_case for Python:** `spool_track.py`
- **Config files:** `config.h.example`, `.env.example`

### Documentation
- **UPPERCASE for root docs:** `README.md`, `LICENSE`
- **Lowercase for guides:** `installation.md`
- **Descriptive names:** `troubleshooting-hardware.md`

### Hardware Files
- **KiCad:** `SpoolTrack.kicad_pro` (project name)
- **3D Models:** `SpoolTrack-Case-Top.3mf` (descriptive)
- **Images:** Use lowercase with hyphens

## Configuration Files

### Global
- `.gitignore` - Root ignore patterns
- `LICENSE` - AGPL-3.0-or-later for root/webservice

### Web Service
- `.env` - Environment variables (secret, gitignored)
- `.env.example` - Template for .env
- `package.json` - Node dependencies
- `docker-compose.*.yml` - Container configs

### Hardware
- `config.h` - Firmware config (gitignored)
- `config.h.example` - Template
- `platformio.ini` - PlatformIO settings
- `printer.cfg.example` - Klipper config template

## Data Flow

```
┌─────────────┐
│  NFC Tag    │───┐
└─────────────┘   │
                  ↓
┌─────────────────────────┐
│  ESP32 Device           │
│  - Reads NFC            │──→ Display Info
│  - Sends to Server      │
└─────────────────────────┘
         │
         ↓
┌─────────────────────────┐
│  Web Service (API)      │
│  - Stores spool data    │
│  - Tracks usage         │
│  - Provides analytics   │
└─────────────────────────┘
         ↑
         │
┌─────────────────────────┐
│  Klipper Plugin         │
│  - Monitors extrusion   │
│  - Reports usage        │
└─────────────────────────┘
         │
         ↓
┌─────────────────────────┐
│  3D Printer             │
│  - Executes prints      │
└─────────────────────────┘
```

## Technology Stack Summary

| Component | Languages | Frameworks | Tools |
|-----------|-----------|------------|-------|
| Web Service | JavaScript | Express.js, Node.js | Docker, SQLite |
| Klipper Plugin | Python | Klipper | - |
| ESP32 Firmware | C++ | Arduino | PlatformIO |
| PCB Design | - | - | KiCad |
| 3D Models | - | - | CAD software |
| Documentation | Markdown | - | GitHub |

## Version Control

### Branching Strategy
- `main` - Stable releases
- `develop` - Active development
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hardware/*` - Hardware changes

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(webservice): add UUID support to spools
fix(klipper): correct weight calculation
docs(hardware): update assembly guide
```

## Build & Release

### Web Service Release
```bash
# Update version in package.json
npm version patch/minor/major

# Build Docker image
docker build -t spooltrack-webservice:v1.0.0 .

# Tag and push
git tag v1.0.0
git push --tags
```

### Firmware Release
```bash
# Update FIRMWARE_VERSION in code
# Build release binaries
pio run --environment esp32dev

# Create release with binaries
gh release create v1.0.0 .pio/build/esp32dev/firmware.bin
```

### Hardware Release
```bash
# Export Gerbers
# Package 3MF files
# Update documentation
# Create release
gh release create hardware-v1.0
```

## Testing Structure

### Web Service Tests
```bash
cd webservice
npm test                    # Run all tests
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report
```

### Firmware Tests
```bash
cd hardware/firmware
pio test                   # Unit tests
pio test -e native        # Local tests
```

### Manual Testing
- Hardware: Follow `hardware/documentation/testing-guide.md`
- Integration: Follow `QUICKSTART.md`
- End-to-end: Print a test object and verify tracking

## Dependencies

### Web Service
- Runtime: Node.js 16+
- Database: SQLite 3
- Container: Docker (optional)

### Klipper Plugin
- Runtime: Python 3.7+
- Klipper: Latest stable
- Network: HTTP client

### Firmware
- SDK: ESP-IDF via Arduino
- Libraries: See `platformio.ini`
- Hardware: See BOM

### Development Tools
- Code Editor: VS Code recommended
- Version Control: Git 2.x
- PCB: KiCad 6.0+
- 3D: Any CAD software

## Documentation Standards

### README Files
- Must be in every major directory
- Include purpose, usage, and examples
- Link to related documentation

### Code Comments
- Document complex logic
- Explain "why" not "what"
- Keep up to date

### API Documentation
- OpenAPI/Swagger for REST APIs
- Inline comments for functions
- Example requests/responses

## Contributing

See `CONTRIBUTING.md` for:
- Code style guidelines
- Pull request process
- Testing requirements
- Documentation standards

## Support & Community

- **Issues:** Report bugs on GitHub Issues
- **Discussions:** Ask questions in GitHub Discussions
- **Discord:** Join community chat
- **Wiki:** Extended documentation

## License

- **Software:** AGPL-3.0-or-later (root/webservice), GPL-3.0-or-later (plugins/firmware)
- **Hardware:** CERN-OHL-P v2
- **Documentation:** CC BY-SA 4.0

See LICENSE file in each directory for details.

---

**Last Updated:** 2026-04-26  
**Maintainers:** SpoolTrack Contributors
