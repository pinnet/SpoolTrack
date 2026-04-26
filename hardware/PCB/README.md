# SpoolTrack PCB Design Files

KiCad project files for the SpoolTrack NFC reader custom PCB.

## Overview

This folder contains the complete KiCad design for a custom SpoolTrack PCB that integrates:
- ESP32-WROOM-32 module
- PN532 NFC reader circuit
- OLED display connector
- Power management
- USB-C connector
- Optional battery charging circuit

## PCB Specifications

### Board Details
- **Size**: 60mm x 40mm (approximate)
- **Layers**: 2-layer PCB
- **Thickness**: 1.6mm
- **Material**: FR-4
- **Surface Finish**: HASL (lead-free) or ENIG
- **Copper Weight**: 1oz (35µm)
- **Minimum Track/Space**: 0.2mm/0.2mm
- **Minimum Drill**: 0.3mm

### Features
- ✅ Integrated ESP32 module footprint
- ✅ PN532 breakout connector
- ✅ OLED display header (I2C)
- ✅ USB-C programming and power
- ✅ 3.3V voltage regulator (AMS1117-3.3)
- ✅ Auto-reset circuit for programming
- ✅ Status LEDs (Power, WiFi, NFC)
- ✅ Optional JST connector for LiPo battery
- ✅ Optional TP4056 battery charger
- ✅ Button footprints (Reset, Boot, User buttons)
- ✅ Mounting holes (M3)
- ✅ Expansion header for GPIO

## File Structure

```
PCB/
├── SpoolTrack.kicad_pro      # KiCad project file
├── SpoolTrack.kicad_sch      # Schematic file
├── SpoolTrack.kicad_pcb      # PCB layout file
├── SpoolTrack-cache.lib      # Symbol cache
├── SpoolTrack.csv            # Bill of Materials (BOM)
├── gerbers/                  # Gerber files for manufacturing
│   ├── SpoolTrack-F_Cu.gbr
│   ├── SpoolTrack-B_Cu.gbr
│   ├── SpoolTrack-F_Mask.gbr
│   ├── SpoolTrack-B_Mask.gbr
│   ├── SpoolTrack-F_Silkscreen.gbr
│   ├── SpoolTrack-B_Silkscreen.gbr
│   ├── SpoolTrack-Edge_Cuts.gbr
│   └── SpoolTrack-PTH.drl
├── 3d/                       # 3D models
│   └── SpoolTrack.step
├── images/                   # Preview images
│   ├── schematic.png
│   ├── pcb-top.png
│   └── pcb-bottom.png
└── README.md                 # This file
```

## Bill of Materials (BOM)

### Main Components

| Reference | Component | Value | Package | Quantity | Notes |
|-----------|-----------|-------|---------|----------|-------|
| U1 | ESP32-WROOM-32 | 4MB Flash | Module | 1 | Main controller |
| U2 | AMS1117-3.3 | 3.3V 1A | SOT-223 | 1 | Voltage regulator |
| U3 | PN532 Module | - | Breakout | 1 | NFC reader |
| J1 | USB Type-C | - | SMD | 1 | Programming/Power |
| J2 | OLED Header | 4-pin | 2.54mm | 1 | Display connector |
| J3 | JST-PH | 2-pin | SMD | 1 | Battery (optional) |
| J4 | GPIO Header | 8-pin | 2.54mm | 1 | Expansion |
| SW1 | Reset Button | - | 6x6mm | 1 | Reset |
| SW2 | Boot Button | - | 6x6mm | 1 | Programming |
| SW3-5 | User Buttons | - | 6x6mm | 3 | Optional UI |
| LED1 | Power LED | Red | 0805 | 1 | Power indicator |
| LED2 | WiFi LED | Blue | 0805 | 1 | WiFi status |
| LED3 | NFC LED | Green | 0805 | 1 | NFC activity |
| C1, C2 | Capacitor | 10µF | 0805 | 2 | Power filtering |
| C3-C6 | Capacitor | 100nF | 0603 | 4 | Decoupling |
| R1-R3 | Resistor | 330Ω | 0603 | 3 | LED current limit |
| R4, R5 | Resistor | 10kΩ | 0603 | 2 | Pull-up |
| R6, R7 | Resistor | 4.7kΩ | 0603 | 2 | I2C pull-up |

### Optional Components (Battery Operation)

| Reference | Component | Value | Package | Quantity | Notes |
|-----------|-----------|-------|---------|----------|-------|
| U4 | TP4056 | - | SOP-8 | 1 | Charging IC |
| R8 | Resistor | 1.2kΩ | 0603 | 1 | Charge current |
| D1 | Schottky Diode | SS34 | SMA | 1 | Reverse protection |

## KiCad Version

**Minimum Required**: KiCad 6.0 or later

Developed with: KiCad 7.0

## How to Use These Files

### Opening the Project

1. Install KiCad 6.0 or later
2. Clone the repository
3. Navigate to `hardware/PCB/`
4. Open `SpoolTrack.kicad_pro`

### Viewing Schematic

1. Open project in KiCad
2. Click "Schematic Editor" icon
3. Review circuit design

### Viewing PCB Layout

1. Open project in KiCad
2. Click "PCB Editor" icon
3. Press `3` for 3D view

### Generating Gerbers

1. Open PCB Editor
2. File → Plot
3. Select Gerber format
4. Select required layers:
   - F.Cu (Front Copper)
   - B.Cu (Back Copper)
   - F.Mask (Front Soldermask)
   - B.Mask (Back Soldermask)
   - F.Silkscreen
   - B.Silkscreen
   - Edge.Cuts
5. Click "Plot"
6. Click "Generate Drill Files"

## Manufacturing

### Ordering PCBs

**Recommended Manufacturers:**
- JLCPCB (China) - Low cost, 2-3 day production
- PCBWay (China) - Good quality, assembly service
- OSH Park (USA) - Premium quality, slower
- Seeed Studio (China) - Assembly available

### Upload Files

1. Compress gerbers folder to ZIP
2. Upload to manufacturer's website
3. Select options:
   - Layers: 2
   - PCB Thickness: 1.6mm
   - Copper Weight: 1oz
   - Surface Finish: HASL or ENIG
   - Soldermask Color: Green (or preference)
   - Silkscreen: White

### Assembly Options

**DIY Assembly:**
- Order bare PCB
- Purchase components separately
- Hand solder all components
- Estimated time: 2-3 hours

**PCBA Service:**
- Upload BOM and CPL files
- Manufacturer assembles board
- Only solder through-hole components
- More expensive but faster

## Assembly Instructions

### Tools Required
- Soldering iron (temperature controlled)
- Solder (lead-free recommended)
- Flux
- Tweezers
- Multimeter
- Magnifying glass or microscope

### Assembly Order

1. **SMD Components First** (smallest to largest)
   - Resistors (0603/0805)
   - Capacitors (0603/0805)
   - LEDs (0805)
   - Voltage regulator (SOT-223)
   - USB-C connector

2. **ESP32 Module**
   - Apply flux to pads
   - Align carefully
   - Solder all pins
   - Check for bridges

3. **Through-Hole Components**
   - Headers
   - Buttons
   - JST connector (if used)

4. **Modules**
   - PN532 (via header)
   - OLED display (via header)

### Testing Procedure

1. **Visual Inspection**
   - Check for solder bridges
   - Verify component orientation
   - Check for cold joints

2. **Power Test**
   - Connect USB (NO ESP32 yet)
   - Measure 3.3V at test points
   - Check for short circuits

3. **ESP32 Test**
   - Install ESP32 module
   - Connect USB
   - Upload blink sketch
   - Verify LED blinks

4. **Peripheral Test**
   - Connect OLED - test display
   - Connect PN532 - test I2C
   - Test buttons
   - Test LEDs

## Design Notes

### I2C Bus
All I2C devices share the same bus (SDA=GPIO21, SCL=GPIO22) with 4.7kΩ pull-up resistors on the PCB.

### Power Supply
The AMS1117-3.3 provides 3.3V from the 5V USB input. Maximum current: 1A.

For battery operation, a TP4056 charging circuit can be populated with automatic path switching.

### Programming
The PCB includes an auto-reset circuit (RTS/DTR) allowing automatic programming without pressing buttons.

### Expansion
The GPIO header breaks out commonly used pins for future expansion:
- GPIO4, 16, 17 (buttons)
- GPIO34 (ADC for battery)
- GPIO13, 14, 15 (spare)
- 3.3V and GND

## Modifications

### Variant: Battery-Free
Do not populate: U4, R8, D1, J3

### Variant: No Buttons
Do not populate: SW3, SW4, SW5

### Variant: Minimal
Only populate: U1, U2, J1, J2, U3, essential passives

## Design Changes

When modifying the PCB:
1. Update schematic first
2. Update PCB from schematic (Tools → Update PCB)
3. Re-run DRC (Design Rule Check)
4. Re-generate Gerbers
5. Update BOM
6. Update documentation

## Known Issues

### v1.0
- None reported yet

## Future Improvements

### v1.1 (Planned)
- [ ] Add USB ESD protection
- [ ] Improve battery circuit
- [ ] Add programming LED
- [ ] Optimize component placement
- [ ] Reduce board size to 50x35mm

### v2.0 (Planned)
- [ ] USB-C PD support
- [ ] Integrated battery
- [ ] Environmental sensors (temp/humidity)
- [ ] Touch button alternatives
- [ ] Better EMI shielding

## Support

- **KiCad Help**: https://docs.kicad.org
- **Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/SpoolTrack/discussions)

## License

This hardware design is licensed under CERN-OHL-P v2 (permissive).

You are free to:
- Use commercially
- Modify and redistribute
- Share derived works

See LICENSE file for details.

## Credits

- PCB design: SpoolTrack contributors
- ESP32 reference design: Espressif
- PN532 circuit: Adafruit/NXP
- KiCad libraries: KiCad team

---

**Note**: PCB files are currently placeholders. Full design coming in v1.0 release.
