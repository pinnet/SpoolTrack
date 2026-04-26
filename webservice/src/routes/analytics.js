const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET overall analytics
router.get('/', analyticsController.getOverallAnalytics);

// GET spool-specific analytics
router.get('/spools/:id', analyticsController.getSpoolAnalytics);

module.exports = router;
