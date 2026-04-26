# SpoolTrack Web Service

RESTful API for managing 3D printing filament inventory with NFC integration.

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Server will start at `http://localhost:3000`

### Docker Development

```bash
# Start containers in development mode (with hot reload)
npm run docker:dev

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

### Docker Production

```bash
# Build production image
npm run docker:build

# Start production containers
npm run docker:prod

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

## Development vs Production

### Development Mode
- **Hot reload**: Code changes automatically restart server
- **Verbose logging**: Debug-level logs enabled
- **Source maps**: Full error traces
- **Mounted volumes**: Code synced from host
- **All dependencies**: Includes dev dependencies

### Production Mode
- **Optimized build**: Minimal image size
- **Production logging**: Info-level logs only
- **Security hardened**: Non-root user, health checks
- **Data persistence**: Only data directory mounted
- **Resource limits**: CPU and memory constraints

## API Endpoints

### Spools
- `GET /api/spools` - List all spools
- `GET /api/spools/:id` - Get spool by ID
- `POST /api/spools` - Create new spool
- `PUT /api/spools/:id` - Update spool
- `DELETE /api/spools/:id` - Delete spool
- `PATCH /api/spools/:id/weight` - Update weight

### Usage Tracking
- `POST /api/usage` - Report filament usage (UUID or ID)
- `GET /api/usage/:spoolId` - Get usage history

### NFC Operations
- `POST /api/nfc/read` - Process NFC tag scan
- `POST /api/nfc/write` - Generate tag write data

### Analytics
- `GET /api/analytics` - Overall statistics
- `GET /api/analytics/spools/:id` - Spool-specific analytics

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_PATH` - SQLite database location
- `JWT_SECRET` - Secret for JWT tokens
- `API_KEY` - API key for ESP32 devices

## Database

SQLite database with the following tables:
- **users** - User accounts
- **spools** - Filament spool inventory (with UUID support)
- **usage_history** - Print usage tracking
- **environmental_logs** - Temperature/humidity data

### UUID Support

All spools are assigned a unique UUID for integration with printer plugins:
- Auto-generated on spool creation
- Used by Klipper plugin for usage tracking
- Enables global identification across systems

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Linting

```bash
# Check code style
npm run lint

# Fix issues automatically
npm run lint:fix
```

## Project Structure

```
webservice/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── database/         # Database setup
│   ├── utils/            # Utility functions
│   └── index.js          # App entry point
├── data/                 # Database files (gitignored)
├── logs/                 # Log files (gitignored)
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.dev.yml   # Development config
├── docker-compose.prod.yml  # Production config
└── package.json
```

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill the process
taskkill /PID <pid> /F
```

### Docker containers won't start
```bash
# Remove all containers and volumes
docker-compose -f docker-compose.dev.yml down -v
# Rebuild images
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Database locked error
- Ensure only one instance is running
- Check file permissions on data directory
- Restart the service

## License

AGPL-3.0-or-later

See [../LICENSE](../LICENSE) for full terms.
