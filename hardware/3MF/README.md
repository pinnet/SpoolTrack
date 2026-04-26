# SpoolTrack 3D Printable Parts

3MF files for 3D printing enclosures and mounting solutions for the SpoolTrack hardware.

## Available Models

### Main Enclosure
Complete case for housing the SpoolTrack electronics.

**Files:**
- `SpoolTrack-Case-Top.3mf` - Top cover with OLED window
- `SpoolTrack-Case-Bottom.3mf` - Bottom case with mounting posts
- `SpoolTrack-Case-Complete.3mf` - Combined model for preview

**Features:**
- Snap-fit assembly (no screws required)
- OLED display window
- NFC scanning area (thin top for better range)
- USB port access
- Ventilation slots
- Mounting holes for wall/desk mount

**Print Settings:**
```
Material: PLA or PETG
Layer Height: 0.2mm
Infill: 20%
Supports: No
Print Time: ~2-3 hours (both parts)
Filament: ~40-60g
```

### Wall Mount Bracket
Mount the SpoolTrack device on wall or side panel.

**Files:**
- `Wall-Mount-Bracket.3mf` - Universal wall mount

**Features:**
- Secure clip attachment
- 2x mounting holes (M4 or drywall anchors)
- 15° angle for easier scanning
- Cable management slot

**Print Settings:**
```
Material: PETG or ABS (stronger)
Layer Height: 0.2mm
Infill: 40%
Supports: Yes (minimal)
Print Time: ~1 hour
```

### Desk Stand
Freestanding desk mount with weighted base.

**Files:**
- `Desk-Stand.3mf` - Angled desk stand

**Features:**
- Stable base design
- 45° viewing angle
- Integrated cable routing
- Optional: Add washers/coins for weight

**Print Settings:**
```
Material: PLA or PETG
Layer Height: 0.2mm
Infill: 30%
Supports: Yes
Print Time: ~2 hours
```

### Spool Holder Integration
Attach SpoolTrack directly to your spool holder.

**Files:**
- `Spool-Holder-Clip-Universal.3mf` - Fits standard holders
- `Spool-Holder-Clip-Prusament.3mf` - Optimized for Prusa spools
- `Spool-Holder-Clip-3DFillies.3mf` - For cardboard-less spools

**Features:**
- Quick attach/detach
- Adjustable for different holder sizes
- Integrated scanning position

**Print Settings:**
```
Material: PETG (flexibility helps)
Layer Height: 0.2mm
Infill: 50%
Supports: No
Print Time: ~30-45 minutes
```

### Printer Frame Mount
Mount for 2020/2040 aluminum extrusion.

**Files:**
- `Frame-Mount-2020.3mf` - For 20x20mm extrusion
- `Frame-Mount-2040.3mf` - For 20x40mm extrusion

**Features:**
- T-nut compatible (M5)
- Tool-free device attachment
- Adjustable angle
- Cable management

**Print Settings:**
```
Material: PETG or ASA (heat resistant)
Layer Height: 0.2mm
Infill: 50%
Supports: Minimal
Print Time: ~1.5 hours
```

## General Print Guidelines

### Recommended Materials

| Material | Use Case | Pros | Cons |
|----------|----------|------|------|
| **PLA** | Indoor, room temp | Easy to print, looks good | Lower strength |
| **PETG** | General use | Strong, durable | Slightly harder to print |
| **ABS** | Near heat sources | Heat resistant | Requires enclosure |
| **ASA** | Outdoors, UV | Weather resistant | Requires enclosure |

### Print Settings Summary

```
Nozzle: 0.4mm standard
Layer Height: 0.2mm (0.15mm for better detail)
First Layer Height: 0.2mm
Perimeters: 3-4 
Top/Bottom Layers: 5
Infill: 20-30% (gyroid or grid)
Supports: Only where noted
Brim/Raft: Not needed
Speed: 50-60mm/s
```

### Post-Processing

**Required:**
- Remove supports carefully
- Test fit before assembly
- Clean up any stringing

**Optional:**
- Sand for smooth finish (start 220 grit)
- Prime and paint
- Vapor smooth (ABS only)
- Apply clear coat for protection

## Assembly Instructions

### Main Enclosure Assembly

1. **Print Parts:**
   - Bottom case
   - Top cover

2. **Install Electronics:**
   - Place PCB in bottom case
   - Align mounting holes
   - Secure with M3 screws (if using screw version)
   - Connect OLED display

3. **Position OLED:**
   - Thread OLED cable through opening
   - Mount OLED in top cover recess
   - Secure with small screws or adhesive

4. **Close Case:**
   - Align top cover with bottom
   - Press firmly until clips engage
   - Ensure USB port is accessible

5. **Add Feet (Optional):**
   - Apply rubber feet to bottom
   - Or mount using bracket

### Wall Mount Installation

1. **Print Bracket:**
   - Print in PETG for strength

2. **Attach to Wall:**
   - Mark mounting holes
   - Drill pilot holes
   - Insert anchors (if drywall)
   - Secure bracket with screws

3. **Mount Device:**
   - Slide case into bracket
   - Ensure secure fit
   - Route cable through channel

### Desk Stand Assembly

1. **Print Stand:**
   - Print with brim for adhesion

2. **Add Weight (Optional):**
   - Place washers or coins in base cavity
   - Seal with hot glue or epoxy

3. **Mount Device:**
   - Slide case into stand clip
   - Adjust cable routing

## Customization

### Modifying 3MF Files

**Tools:**
- Fusion 360 (free for hobbyists)
- FreeCAD (open source)
- Tinkercad (web-based, simple)
- Blender (advanced)

### Common Modifications

**Resize for Different Boards:**
1. Import 3MF into CAD software
2. Measure your PCB dimensions
3. Adjust internal cavity size
4. Export as 3MF/STL

**Add Logo/Text:**
1. Import model
2. Add text/logo in relief or recessed
3. Depth: 0.5-1mm for best results
4. Export and slice

**Change Mounting Options:**
1. Edit mounting hole positions
2. Add/remove clips
3. Adjust angles

## Source Files

For easier modification, STEP files are also available:
- `SpoolTrack-Case.step` - Parametric CAD file
- `Mounts.step` - All mounting options

## Color Combinations

**Recommended Color Schemes:**

**Classic:**
- Case: Black
- Top: Black with transparent OLED window

**High Contrast:**
- Bottom: Black
- Top: White or Light Gray

**Match Your Printer:**
- Prusa: Orange accents
- Creality: Gray/Orange
- Bambu: Black/Gray

**Custom:**
- Print top in glow-in-the-dark PLA
- Use multi-material for logo
- Translucent PETG for LED indicators

## Print Orientation

### Case Bottom
- Print upside down (mounting posts up)
- No supports needed
- Flat base for good adhesion

### Case Top
- Print right-side up
- OLED window facing up
- Support for overhangs (if any)

### Brackets
- Print with mounting surface on bed
- Minimizes supports
- Better strength in mounting direction

## Troubleshooting

### Parts Don't Fit
- Check you scaled correctly (should be 100%)
- Verify printer is calibrated
- Try printing at 101% if too tight
- Sand contact surfaces lightly

### Clips Breaking
- Increase perimeters to 4
- Use stronger material (PETG > PLA)
- Anneal PLA parts (heat treatment)
- Add small amount of support

### OLED Window Not Clear
- Use transparent or translucent filament
- Reduce infill in window area (0-5%)
- Sand with progressively finer grits
- Use clear epoxy resin to fill

### Weak Mounting Points
- Increase infill in stress areas
- Add perimeters
- Use solid layers around holes
- Consider heat-set inserts

## Alternative Designs

Community members have created variations:

- Compact version (smaller footprint)
- Lanyard/portable version
- Magnetic mount version
- RGB LED ring integration

Check [GitHub Discussions](https://github.com/yourusername/SpoolTrack/discussions) for community designs.

## Sharing Your Designs

Made an improvement or custom design?

1. Export as 3MF (preferred) or STL
2. Include print settings in filename
3. Add preview image (PNG/JPG)
4. Submit pull request or share in discussions
5. License: same as project (CERN-OHL-P v2)

## Support

- **Print Issues**: [3D Printing Discord](https://discord.gg/yourserver)
- **Design Questions**: [GitHub Discussions](https://github.com/yourusername/SpoolTrack/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)

## Gallery

See completed builds and custom designs in our [Gallery Wiki](https://github.com/yourusername/SpoolTrack/wiki/Gallery).

## License

3D designs are licensed under CERN-OHL-P v2.

Free to use, modify, and distribute (even commercially).

## Credits

- Original design: SpoolTrack contributors
- Community variations: See individual file credits
- Testing: SpoolTrack community members

---

**Ready to print?** Download the 3MF files and start building!

**No 3D printer?** Many libraries and makerspaces offer printing services, or check online services like Shapeways or Xometry.
