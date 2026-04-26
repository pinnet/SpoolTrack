const db = require('../database').getDb;
const logger = require('../utils/logger');

const getAllSpools = (req, res) => {
  try {
    const spools = db().prepare('SELECT * FROM spools ORDER BY updated_at DESC').all();
    res.json({
      success: true,
      count: spools.length,
      data: spools
    });
  } catch (error) {
    logger.error('Error fetching spools:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch spools' });
  }
};

const getSpoolById = (req, res) => {
  try {
    const { id } = req.params;
    const spool = db().prepare('SELECT * FROM spools WHERE id = ?').get(id);
    
    if (!spool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    res.json({ success: true, data: spool });
  } catch (error) {
    logger.error('Error fetching spool:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch spool' });
  }
};

const getSpoolByIdentifier = (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try as UUID first (contains dashes), then as ID
    let spool;
    if (identifier.includes('-')) {
      spool = db().prepare('SELECT * FROM spools WHERE uuid = ?').get(identifier);
    } else {
      spool = db().prepare('SELECT * FROM spools WHERE id = ?').get(identifier);
    }
    
    if (!spool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    res.json({ success: true, data: spool });
  } catch (error) {
    logger.error('Error fetching spool:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch spool' });
  }
};

const createSpool = (req, res) => {
  try {
    const {
      uuid,
      user_id = 1,
      nfc_uid,
      manufacturer,
      brand,
      material,
      color,
      diameter = 1.75,
      initial_weight,
      price,
      purchase_date,
      lot_number,
      notes
    } = req.body;

    // Generate UUID if not provided
    const crypto = require('crypto');
    const spoolUuid = uuid || crypto.randomUUID();

    const stmt = db().prepare(`
      INSERT INTO spools (
        uuid, user_id, nfc_uid, manufacturer, brand, material, color,
        diameter, initial_weight, current_weight, price,
        purchase_date, lot_number, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      spoolUuid, user_id, nfc_uid, manufacturer, brand, material, color,
      diameter, initial_weight, initial_weight, price,
      purchase_date, lot_number, notes
    );

    const newSpool = db().prepare('SELECT * FROM spools WHERE id = ?').get(result.lastInsertRowid);

    logger.info(`Created new spool: ${newSpool.id} (UUID: ${spoolUuid})`);
    res.status(201).json({ success: true, data: newSpool });
  } catch (error) {
    logger.error('Error creating spool:', error);
    res.status(500).json({ success: false, error: 'Failed to create spool' });
  }
};

const updateSpool = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db().prepare(`
      UPDATE spools 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    stmt.run(...values, id);

    const updatedSpool = db().prepare('SELECT * FROM spools WHERE id = ?').get(id);

    if (!updatedSpool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    logger.info(`Updated spool: ${id}`);
    res.json({ success: true, data: updatedSpool });
  } catch (error) {
    logger.error('Error updating spool:', error);
    res.status(500).json({ success: false, error: 'Failed to update spool' });
  }
};

const deleteSpool = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db().prepare('DELETE FROM spools WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    logger.info(`Deleted spool: ${id}`);
    res.json({ success: true, message: 'Spool deleted successfully' });
  } catch (error) {
    logger.error('Error deleting spool:', error);
    res.status(500).json({ success: false, error: 'Failed to delete spool' });
  }
};

const updateSpoolWeight = (req, res) => {
  try {
    const { id } = req.params;
    const { current_weight } = req.body;

    if (!current_weight || current_weight < 0) {
      return res.status(400).json({ success: false, error: 'Invalid weight value' });
    }

    const stmt = db().prepare(`
      UPDATE spools 
      SET current_weight = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    stmt.run(current_weight, id);

    const updatedSpool = db().prepare('SELECT * FROM spools WHERE id = ?').get(id);

    if (!updatedSpool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    logger.info(`Updated weight for spool ${id}: ${current_weight}g`);
    res.json({ success: true, data: updatedSpool });
  } catch (error) {
    logger.error('Error updating spool weight:', error);
    res.status(500).json({ success: false, error: 'Failed to update weight' });
  }
};

module.exports = {
  getAllSpools,
  getSpoolById,
  getSpoolByIdentifier,
  createSpool,
  updateSpool,
  deleteSpool,
  updateSpoolWeight
};
