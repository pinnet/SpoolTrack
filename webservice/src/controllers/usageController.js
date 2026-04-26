const db = require('../database').getDb;
const logger = require('../utils/logger');

const reportUsage = (req, res) => {
  try {
    const { spool_id, spool_uuid, amount_used, length_meters, print_name, print_duration } = req.body;

    if ((!spool_id && !spool_uuid) || !amount_used) {
      return res.status(400).json({ 
        success: false, 
        error: 'spool_id or spool_uuid, and amount_used are required' 
      });
    }

    // Get current spool by UUID or ID
    let spool;
    if (spool_uuid) {
      spool = db().prepare('SELECT * FROM spools WHERE uuid = ?').get(spool_uuid);
    } else {
      spool = db().prepare('SELECT * FROM spools WHERE id = ?').get(spool_id);
    }

    if (!spool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    // Calculate new weight
    const newWeight = Math.max(0, spool.current_weight - amount_used);

    // Start transaction
    const transaction = db().transaction(() => {
      // Insert usage record
      const usageStmt = db().prepare(`
        INSERT INTO usage_history (spool_id, amount_used, print_name, print_duration)
        VALUES (?, ?, ?, ?)
      `);
      usageStmt.run(spool.id, amount_used, print_name, print_duration);

      // Update spool weight and last used date
      const updateStmt = db().prepare(`
        UPDATE spools 
        SET current_weight = ?,
            last_used_date = DATE('now'),
            first_used_date = COALESCE(first_used_date, DATE('now')),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(newWeight, spool.id);
    });

    transaction();

    const updatedSpool = db().prepare('SELECT * FROM spools WHERE id = ?').get(spool.id);

    logger.info(`Reported usage for spool ${spool.uuid}: ${amount_used}g (${length_meters || 'N/A'}m)`);
    res.json({ 
      success: true, 
      message: 'Usage reported successfully',
      data: updatedSpool
    });
  } catch (error) {
    logger.error('Error reporting usage:', error);
    res.status(500).json({ success: false, error: 'Failed to report usage' });
  }
};

const getUsageHistory = (req, res) => {
  try {
    const { spoolId } = req.params;

    const history = db().prepare(`
      SELECT * FROM usage_history 
      WHERE spool_id = ? 
      ORDER BY timestamp DESC
    `).all(spoolId);

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    logger.error('Error fetching usage history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch usage history' });
  }
};

module.exports = {
  reportUsage,
  getUsageHistory
};
