const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');

// POST process NFC read data
router.post('/read', nfcController.processNfcRead);

// POST generate NFC write data
router.post('/write', nfcController.generateNfcWrite);

module.exports = router;
