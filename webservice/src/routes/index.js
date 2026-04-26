const express = require('express');
const router = express.Router();

const spoolsRoutes = require('./spools');
const usageRoutes = require('./usage');
const nfcRoutes = require('./nfc');
const analyticsRoutes = require('./analytics');

// Mount routes
router.use('/spools', spoolsRoutes);
router.use('/usage', usageRoutes);
router.use('/nfc', nfcRoutes);
router.use('/analytics', analyticsRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      spools: {
        'GET /api/spools': 'List all spools',
        'GET /api/spools/:id': 'Get spool by ID or UUID',
        'POST /api/spools': 'Create new spool (auto-generates UUID)',
        'PUT /api/spools/:id': 'Update spool',
        'DELETE /api/spools/:id': 'Delete spool'
      },
      usage: {
        'POST /api/usage': 'Report filament usage (accepts spool_id or spool_uuid)',
        'GET /api/usage/:spoolId': 'Get usage history for spool'
      },
      nfc: {
        'POST /api/nfc/read': 'Process NFC tag data',
        'POST /api/nfc/write': 'Generate NFC write data'
      },
      analytics: {
        'GET /api/analytics': 'Get usage statistics',
        'GET /api/analytics/spools/:id': 'Get spool analytics'
      }
    },
    notes: {
      uuid_support: 'All spool operations support UUID-based identification for Klipper plugin integration',
      usage_tracking: 'Usage endpoint accepts both spool_id (legacy) and spool_uuid (recommended) parameters'
    }
  });
});

module.exports = router;
