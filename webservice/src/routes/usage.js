const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');

// POST report usage
router.post('/', usageController.reportUsage);

// GET usage history for a spool
router.get('/:spoolId', usageController.getUsageHistory);

module.exports = router;
