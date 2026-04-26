# SpoolTrack Plugins

Integration plugins for 3D printer software to enable automatic filament tracking.

## Available Plugins

### ✅ Klipper Plugin
**Status**: Complete and ready to use

Automatic filament usage tracking for Klipper-based 3D printers.

**Features:**
- Real-time extrusion monitoring
- Automatic weight/length calculation
- UUID-based spool identification
- Periodic updates to web service
- G-code commands for spool management

**[📖 Documentation](klipper/README.md)** | **[⚙️ Installation](klipper/README.md#installation)**

**Quick Install:**
```bash
cd ~/klipper/klippy/extras/
wget https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py
# Add configuration to printer.cfg
sudo systemctl restart klipper
```

---

### 🚧 Orca Slicer Plugin
**Status**: Planned

Pre-print filament estimation and integration with Orca Slicer.

**Planned Features:**
- Read spool data from SpoolTrack
- Validate sufficient filament before printing
- Auto-generate G-code with spool UUID
- Material consumption predictions

**Coming Soon**

---

### 🚧 PrusaSlicer Plugin
**Status**: Planned

Integration with PrusaSlicer for filament management.

**Coming Soon**

---

## Plugin Comparison

| Feature | Klipper | Orca Slicer | PrusaSlicer |
|---------|---------|-------------|-------------|
| **Automatic Tracking** | ✅ | Planned | Planned |
| **Real-time Updates** | ✅ | N/A | N/A |
| **Pre-print Validation** | ❌ | Planned | Planned |
| **UUID Management** | ✅ Manual | Planned Auto | Planned Auto |
| **Spool Selection** | G-code | Planned GUI | Planned GUI |
| **Multi-extruder** | Partial | Planned | Planned |

## Architecture

```
┌──────────────────┐
│  Slicer Plugins  │
│ (Pre-print setup)│
└────────┬─────────┘
         │ Configure UUID
         ▼
┌──────────────────┐      ┌──────────────────┐
│   3D Printer     │      │ Klipper Plugin   │
│   (Executes)     │◄────►│ (Tracks usage)   │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         │ Real-time tracking      │
         ▼                         ▼
    ┌──────────────────────────────────┐
    │    SpoolTrack Web Service        │
    │  (Central database & analytics)  │
    └──────────────────────────────────┘
```

## Workflow

### 1. Setup (One-time)
- Install desired plugins
- Configure web service URL
- Set API authentication

### 2. Before Printing (Manual with Klipper)
```gcode
; Set current spool UUID
SET_SPOOL_UUID UUID=12345678-90ab-cdef-1234-567890abcdef
```

### 3. During Printing (Automatic)
- Klipper plugin monitors extrusion
- Calculates filament consumption
- Sends periodic updates to web service

### 4. After Printing (Automatic)
- Final usage update sent
- Database updated with total consumption
- Analytics updated

## Configuration Requirements

All plugins require:
- **Web Service URL**: Your SpoolTrack server address
- **API Key**: Optional but recommended for security
- **Spool UUID**: Global identifier for each filament spool

### Getting Spool UUIDs

**Option 1: Web Interface**
1. Log into SpoolTrack web dashboard
2. Navigate to spool details
3. Copy the UUID field

**Option 2: API Query**
```bash
curl http://your-server:3000/api/spools
```

**Option 3: Auto-generation**
When creating spools via API, UUIDs are automatically generated.

## Development

Want to contribute or create a new plugin? See our development guide:

### Plugin Requirements
1. **Track or estimate filament usage**
2. **Use UUID for spool identification**
3. **Communicate with web service API**
4. **Handle network failures gracefully**
5. **Provide user feedback**

### API Integration

All plugins should use the usage reporting endpoint:

```http
POST /api/usage
Content-Type: application/json
X-API-Key: your-api-key

{
  "spool_uuid": "12345678-90ab-cdef-1234-567890abcdef",
  "amount_used": 123.45,
  "length_meters": 45.678,
  "print_name": "benchy.gcode",
  "print_duration": 3600
}
```

**Required fields:**
- `spool_uuid`: UUID of the spool
- `amount_used`: Weight in grams

**Optional fields:**
- `length_meters`: Filament length used
- `print_name`: Name of the print job
- `print_duration`: Time in seconds

### Testing

Test your plugin against the web service:

```bash
# Start development server
cd webservice
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "spool_uuid": "test-uuid-1234",
    "amount_used": 10.5,
    "length_meters": 3.5
  }'
```

## Troubleshooting

### Plugin Not Loading
- Check installation path
- Verify file permissions
- Review application logs
- Confirm configuration syntax

### Network Connection Issues
- Verify web service URL
- Check firewall rules
- Test API endpoint manually
- Review network logs

### Inaccurate Tracking
- Verify filament diameter setting
- Check printer calibration
- Ensure no conflicting plugins
- Review calculation formulas

## Support

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/SpoolTrack/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **Discussions**: [Community Forum](https://github.com/yourusername/SpoolTrack/discussions)

## Contributing

We welcome contributions! To add a new plugin:

1. Fork the repository
2. Create a plugin directory under `plugins/`
3. Implement core functionality
4. Add comprehensive documentation
5. Include installation scripts
6. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

All plugins are licensed under the MIT License. See [LICENSE](../LICENSE) for details.
