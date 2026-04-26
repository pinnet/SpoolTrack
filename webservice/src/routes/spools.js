const express = require('express');
const router = express.Router();
const spoolController = require('../controllers/spoolController');
const { validateSpool } = require('../middleware/validation');

// GET all spools
router.get('/', spoolController.getAllSpools);

// GET spool by ID or UUID
router.get('/:id', spoolController.getSpoolByIdentifier);

// POST create new spool
router.post('/', validateSpool, spoolController.createSpool);

// PUT update spool
router.put('/:id', validateSpool, spoolController.updateSpool);

// DELETE spool
router.delete('/:id', spoolController.deleteSpool);

// PATCH update spool weight (for usage tracking)
router.patch('/:id/weight', spoolController.updateSpoolWeight);

module.exports = router;
