# SpoolTrack Klipper Integration Example

This example demonstrates how to integrate SpoolTrack with your Klipper printer workflow.

## Scenario

You have three spools in your inventory:
1. **Polymaker PolyLite PLA Black** - UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
2. **Prusament PETG Orange** - UUID: `b2c3d4e5-f6a7-8901-bcde-f12345678901`
3. **eSun ABS+ White** - UUID: `c3d4e5f6-a7b8-9012-cdef-123456789012`

## Start G-code Template

Add this to your slicer's start G-code:

```gcode
; ============================================
; SpoolTrack Integration
; ============================================
; Set the active spool UUID for tracking
SET_SPOOL_UUID UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

; Verify tracking is active
SPOOLTRACK_STATUS

; ============================================
; Standard Start Sequence
; ============================================
G28                    ; Home all axes
G29                    ; Bed leveling
G1 Z15.0 F6000        ; Move Z up
G92 E0                ; Reset extruder
G1 F200 E3            ; Purge line
G92 E0                ; Reset extruder

; Start print
M117 Printing...
```

## Mid-print Spool Change

If you need to change spools during a print (pause/resume):

```gcode
; Pause sequence
PAUSE
M117 Change Filament

; After loading new spool:
SET_SPOOL_UUID UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901

; Resume
RESUME
M117 Printing...
```

## End G-code Template

```gcode
; ============================================
; End Sequence
; ============================================
G91                    ; Relative positioning
G1 E-2 F2700          ; Retract
G1 Z10                ; Move Z up
G90                   ; Absolute positioning
G1 X0 Y220            ; Present print
M104 S0               ; Turn off hotend
M140 S0               ; Turn off bed
M107                  ; Turn off fan
M84                   ; Disable motors

; Force final sync to SpoolTrack
SPOOLTRACK_SYNC

; Show tracking summary
SPOOLTRACK_STATUS

M117 Print Complete!
```

## Automated Spool Selection (Advanced)

For different materials, create macros:

```ini
[gcode_macro SELECT_PLA_BLACK]
gcode:
    SET_SPOOL_UUID UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
    M117 PLA Black Selected

[gcode_macro SELECT_PETG_ORANGE]
gcode:
    SET_SPOOL_UUID UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901
    M117 PETG Orange Selected

[gcode_macro SELECT_ABS_WHITE]
gcode:
    SET_SPOOL_UUID UUID=c3d4e5f6-a7b8-9012-cdef-123456789012
    M117 ABS White Selected
```

Then in your start G-code, just call:
```gcode
SELECT_PLA_BLACK
```

## Monitoring During Print

You can check status at any time via console:

```gcode
SPOOLTRACK_STATUS
```

Output:
```
SpoolTrack Status:
  Spool UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Server: http://192.168.1.100:3000/api
  Printing: True
  Current Print: benchy_v2.gcode
  Total Extrusion: 12.456m (33.78g)
  Session Pending: 0.234m (0.63g)
```

## Multi-color/Multi-material Prints

For IDEX or toolchanger printers (future support):

```gcode
; Tool 0 - PLA Black
T0
SET_SPOOL_UUID UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890

; Tool 1 - PLA White
T1
SET_SPOOL_UUID UUID=d4e5f6a7-b8c9-0123-def1-234567890123
```

## Troubleshooting Examples

### Check if plugin is loaded
```gcode
SPOOLTRACK_STATUS
```
If you get "Unknown command", the plugin isn't loaded.

### Force immediate sync
If you want to ensure data is sent right away:
```gcode
SPOOLTRACK_SYNC
```

### Check current UUID
```gcode
SET_SPOOL_UUID
```
Returns current active UUID without changing it.

## Integration with Print Farm

For multiple printers:

**Printer 1 - printer.cfg:**
```ini
[spooltrack]
server_url: http://192.168.1.100:3000/api
api_key: printer1-api-key
filament_diameter: 1.75
```

**Printer 2 - printer.cfg:**
```ini
[spooltrack]
server_url: http://192.168.1.100:3000/api
api_key: printer2-api-key
filament_diameter: 1.75
```

Each printer reports to the same server, tracking different spools independently.

## Best Practices

### 1. Always Set UUID Before Printing
```gcode
SET_SPOOL_UUID UUID=your-uuid
G28  ; Home
```

### 2. Sync After Long Prints
```gcode
SPOOLTRACK_SYNC  ; Ensure data is saved
M117 Print Complete
```

### 3. Use Macros for Common Spools
Create macros for frequently used spools to avoid typing UUIDs.

### 4. Monitor Low Filament
Check web dashboard before starting large prints to ensure sufficient filament.

### 5. Update Spool Changes
Always update UUID when changing spools, even mid-print.

## Example: Complete Print Workflow

**1. Pre-print Check (Web Dashboard)**
- Verify spool has sufficient filament
- Note the UUID

**2. Slicer (Orca Slicer)**
- Add to start G-code: `SET_SPOOL_UUID UUID=...`
- Export G-code

**3. During Print (Automatic)**
- Klipper plugin tracks usage
- Updates sent every 60 seconds

**4. Post-print (Web Dashboard)**
- View updated spool weight
- Check usage history
- Monitor lifetime statistics

## Real Usage Data

After a successful print, the web service will show:

```json
{
  "spool_id": 1,
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "material": "PLA",
  "initial_weight": 1000,
  "current_weight": 966.22,
  "usage_history": [
    {
      "timestamp": "2026-04-26T10:30:00Z",
      "amount_used": 33.78,
      "print_name": "benchy_v2.gcode",
      "print_duration": 3840
    }
  ]
}
```

## Advanced: Custom Update Intervals

For very long prints, you might want more frequent updates:

```ini
[spooltrack]
server_url: http://192.168.1.100:3000/api
api_key: your-api-key
update_interval: 30  ; Updates every 30 seconds
```

Or less frequent for network bandwidth concerns:
```ini
update_interval: 300  ; Updates every 5 minutes
```

## Resources

- **Plugin Documentation**: [README.md](README.md)
- **API Reference**: http://your-server:3000/api/docs
- **Web Dashboard**: http://your-server:3000
- **Support**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
