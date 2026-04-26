const db = require('../database').getDb;
const logger = require('../utils/logger');

const processNfcRead = (req, res) => {
  try {
    const { nfc_uid, tag_data } = req.body;

    if (!nfc_uid) {
      return res.status(400).json({ success: false, error: 'nfc_uid is required' });
    }

    // Find spool by NFC UID
    const spool = db().prepare('SELECT * FROM spools WHERE nfc_uid = ?').get(nfc_uid);

    if (!spool) {
      return res.status(404).json({ 
        success: false, 
        error: 'No spool found with this NFC tag',
        nfc_uid 
      });
    }

    // Get usage history
    const usageHistory = db().prepare(`
      SELECT * FROM usage_history 
      WHERE spool_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 5
    `).all(spool.id);

    // Calculate percentage remaining
    const percentageRemaining = (spool.current_weight / spool.initial_weight) * 100;

    logger.info(`NFC tag scanned: ${nfc_uid} (Spool ID: ${spool.id})`);

    res.json({
      success: true,
      data: {
        ...spool,
        percentage_remaining: Math.round(percentageRemaining),
        recent_usage: usageHistory
      }
    });
  } catch (error) {
    logger.error('Error processing NFC read:', error);
    res.status(500).json({ success: false, error: 'Failed to process NFC read' });
  }
};

const generateNfcWrite = (req, res) => {
  try {
    const { spool_id } = req.body;

    if (!spool_id) {
      return res.status(400).json({ success: false, error: 'spool_id is required' });
    }

    const spool = db().prepare('SELECT * FROM spools WHERE id = ?').get(spool_id);

    if (!spool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    // Generate OpenTag3D compatible data structure
    const openTag3DData = {
      version: process.env.OPENTAG3D_VERSION || "1.0",
      material: spool.material,
      color: spool.color,
      weight: spool.initial_weight,
      diameter: spool.diameter,
      manufacturer: spool.manufacturer,
      brand: spool.brand || spool.manufacturer,
      lot_number: spool.lot_number,
      spool_id: spool.id,
      nfc_uid: spool.nfc_uid,
      created: spool.created_at
    };

    logger.info(`Generated NFC write data for spool ${spool_id}`);

    res.json({
      success: true,
      data: openTag3DData,
      instructions: 'Write this JSON data to NFC tag NDEF record'
    });
  } catch (error) {
    logger.error('Error generating NFC write data:', error);
    res.status(500).json({ success: false, error: 'Failed to generate NFC data' });
  }
};

module.exports = {
  processNfcRead,
  generateNfcWrite
};
