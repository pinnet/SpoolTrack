# SpoolTrack Quick Start Guide

Get SpoolTrack up and running in under 15 minutes.

## What You'll Need

- **Hardware**:
  - ESP32 board with OLED display
  - PN532 NFC reader module
  - NTAG215 NFC tags (one per spool)
  
- **Software**:
  - Node.js 16+ (for web service)
  - Klipper-based 3D printer
  - Arduino IDE or PlatformIO (for ESP32)

- **Network**:
  - Local network access for all devices
  - Static IP or hostname for web service

## Step 1: Web Service Setup (5 minutes)

### Option A: Docker (Recommended)

```bash
cd SpoolTrack/webservice

# Copy environment file
cp .env.example .env

# Edit with your settings
nano .env

# Start in development mode
npm run docker:dev
```

### Option B: Direct Install

```bash
cd SpoolTrack/webservice

# Install dependencies
npm install

# Configure
cp .env.example .env
nano .env

# Start server
npm run dev
```

**Verify**: Visit `http://localhost:3000/health`

## Step 2: Klipper Plugin Installation (3 minutes)

```bash
# SSH to your printer
ssh pi@your-printer-ip

# Install plugin
cd ~/klipper/klippy/extras/
wget https://raw.githubusercontent.com/yourusername/SpoolTrack/main/plugins/klipper/spooltrack.py

# Configure
nano ~/printer_data/config/printer.cfg
```

Add this configuration:
```ini
[spooltrack]
server_url: http://YOUR_SERVER_IP:3000/api
api_key: your-api-key
filament_diameter: 1.75
update_interval: 60
```

Restart Klipper:
```bash
sudo systemctl restart klipper
```

**Verify**: Run `SPOOLTRACK_STATUS` in printer console

## Step 3: Create Your First Spool (2 minutes)

### Using API:

```bash
curl -X POST http://localhost:3000/api/spools \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer": "Polymaker",
    "brand": "PolyLite",
    "material": "PLA",
    "color": "Galaxy Black",
    "diameter": 1.75,
    "initial_weight": 1000,
    "purchase_date": "2026-04-26"
  }'
```

**Save the UUID returned!** You'll need it for tracking.

### Using Web Interface:

1. Navigate to `http://localhost:3000`
2. Click "Add New Spool"
3. Fill in details
4. Copy the generated UUID

## Step 4: First Print with Tracking (5 minutes)

### Add to your Start G-code:

```gcode
; SpoolTrack - Set active spool
SET_SPOOL_UUID UUID=your-uuid-from-step-3

; Rest of your start G-code
G28
G29
; ... etc
```

### Print Something Small:

- Slice a small test print (e.g., calibration cube)
- Upload to printer
- Start print

### Monitor Progress:

**In printer console:**
```gcode
SPOOLTRACK_STATUS
```

**In web browser:**
- Visit `http://localhost:3000/api/spools`
- Watch `current_weight` decrease as filament is used

## Verification Checklist

- [ ] Web service responds at `/health` endpoint
- [ ] Can create spools via API or web interface
- [ ] Klipper plugin loads without errors
- [ ] `SPOOLTRACK_STATUS` command works
- [ ] UUID set before print
- [ ] Usage data appears in database after print
- [ ] Spool weight updates correctly

## Common Issues & Quick Fixes

### Plugin Not Loaded
```bash
# Check Klipper logs
tail -f ~/printer_data/logs/klippy.log | grep -i spooltrack

# Verify file exists
ls -la ~/klipper/klippy/extras/spooltrack.py

# Check permissions
chmod 644 ~/klipper/klippy/extras/spooltrack.py
```

### Can't Connect to Web Service
```bash
# Test from printer
curl http://YOUR_SERVER_IP:3000/health

# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp
```

### UUID Not Working
```bash
# Verify UUID format (should have dashes)
# Correct:   a1b2c3d4-e5f6-7890-abcd-ef1234567890
# Incorrect: a1b2c3d4e5f67890abcdef1234567890

# List all spools
curl http://localhost:3000/api/spools
```

## Next Steps

Once everything is working:

### 1. Add More Spools
Create entries for all your filament spools in the database.

### 2. Write NFC Tags
Use the ESP32 device to write spool data to NFC tags (instructions in ESP32 firmware docs).

### 3. Set Up Analytics
Access the web dashboard to view usage statistics:
```
http://localhost:3000/api/analytics
```

### 4. Configure Macros
Create Klipper macros for your common spools:
```ini
[gcode_macro SELECT_PLA_BLACK]
gcode:
    SET_SPOOL_UUID UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### 5. Automate Backups
Set up automated database backups:
```bash
# Add to crontab
0 2 * * * cp ~/SpoolTrack/webservice/data/spooltrack.db ~/backups/spooltrack-$(date +\%Y\%m\%d).db
```

## Production Deployment

When ready for production:

### 1. Secure the Web Service
```env
# .env
NODE_ENV=production
API_KEY=generate-strong-random-key
JWT_SECRET=another-strong-random-key
```

### 2. Run with Docker Production Mode
```bash
npm run docker:prod
```

### 3. Set Up Reverse Proxy (Optional)
Use nginx or Caddy for HTTPS:
```nginx
server {
    listen 443 ssl;
    server_name spooltrack.local;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

### 4. Configure Auto-start
```bash
# Docker compose with restart policy
docker-compose -f docker-compose.prod.yml up -d
```

## Support & Resources

- **📖 Full Documentation**: [README.md](README.md)
- **🔧 Klipper Plugin Guide**: [plugins/klipper/README.md](plugins/klipper/README.md)
- **💡 Examples**: [plugins/klipper/EXAMPLES.md](plugins/klipper/EXAMPLES.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/SpoolTrack/issues)
- **💬 Community**: [Discord](https://discord.gg/yourserver)

## Maintenance

### Weekly
- Check logs for errors
- Verify backups are running
- Review usage statistics

### Monthly
- Update dependencies: `npm update`
- Review and archive old data
- Check for firmware updates

### As Needed
- Add new spools to inventory
- Update spool information
- Generate reports for analysis

---

**Congratulations!** You now have a fully functional filament tracking system. Happy printing! 🎉
