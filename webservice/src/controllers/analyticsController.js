const db = require('../database').getDb;
const logger = require('../utils/logger');

const getOverallAnalytics = (req, res) => {
  try {
    // Total spools
    const totalSpools = db().prepare('SELECT COUNT(*) as count FROM spools').get().count;

    // Active spools (> 10% remaining)
    const activeSpools = db().prepare(`
      SELECT COUNT(*) as count FROM spools 
      WHERE (current_weight / initial_weight) > 0.1
    `).get().count;

    // Low spools (< 10% remaining)
    const lowSpools = db().prepare(`
      SELECT COUNT(*) as count FROM spools 
      WHERE (current_weight / initial_weight) <= 0.1 AND current_weight > 0
    `).get().count;

    // Empty spools
    const emptySpools = db().prepare(`
      SELECT COUNT(*) as count FROM spools 
      WHERE current_weight = 0
    `).get().count;

    // Total filament weight
    const totalWeight = db().prepare(`
      SELECT COALESCE(SUM(current_weight), 0) as total FROM spools
    `).get().total;

    // Material breakdown
    const materialBreakdown = db().prepare(`
      SELECT material, COUNT(*) as count, SUM(current_weight) as total_weight
      FROM spools 
      GROUP BY material
    `).all();

    // Recent usage (last 30 days)
    const recentUsage = db().prepare(`
      SELECT DATE(timestamp) as date, SUM(amount_used) as total_used
      FROM usage_history 
      WHERE timestamp >= DATE('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `).all();

    // Most used spools
    const mostUsedSpools = db().prepare(`
      SELECT s.*, 
             COUNT(u.id) as print_count,
             COALESCE(SUM(u.amount_used), 0) as total_used
      FROM spools s
      LEFT JOIN usage_history u ON s.id = u.spool_id
      GROUP BY s.id
      ORDER BY total_used DESC
      LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        overview: {
          total_spools: totalSpools,
          active_spools: activeSpools,
          low_spools: lowSpools,
          empty_spools: emptySpools,
          total_weight_remaining: Math.round(totalWeight)
        },
        material_breakdown: materialBreakdown,
        recent_usage: recentUsage,
        most_used_spools: mostUsedSpools
      }
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
};

const getSpoolAnalytics = (req, res) => {
  try {
    const { id } = req.params;

    // Get spool details
    const spool = db().prepare('SELECT * FROM spools WHERE id = ?').get(id);

    if (!spool) {
      return res.status(404).json({ success: false, error: 'Spool not found' });
    }

    // Usage statistics
    const usageStats = db().prepare(`
      SELECT 
        COUNT(*) as print_count,
        COALESCE(SUM(amount_used), 0) as total_used,
        COALESCE(AVG(amount_used), 0) as avg_per_print,
        COALESCE(MIN(amount_used), 0) as min_used,
        COALESCE(MAX(amount_used), 0) as max_used
      FROM usage_history 
      WHERE spool_id = ?
    `).get(id);

    // Usage over time
    const usageTimeline = db().prepare(`
      SELECT 
        DATE(timestamp) as date,
        SUM(amount_used) as daily_usage
      FROM usage_history 
      WHERE spool_id = ?
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
      LIMIT 30
    `).all(id);

    // Environmental data
    const envData = db().prepare(`
      SELECT * FROM environmental_logs 
      WHERE spool_id = ?
      ORDER BY timestamp DESC
      LIMIT 10
    `).all(id);

    // Calculate metrics
    const percentageUsed = ((spool.initial_weight - spool.current_weight) / spool.initial_weight) * 100;
    const percentageRemaining = 100 - percentageUsed;
    
    const daysInUse = spool.first_used_date && spool.last_used_date
      ? Math.ceil((new Date(spool.last_used_date) - new Date(spool.first_used_date)) / (1000 * 60 * 60 * 24))
      : 0;

    res.json({
      success: true,
      data: {
        spool,
        metrics: {
          percentage_used: Math.round(percentageUsed),
          percentage_remaining: Math.round(percentageRemaining),
          days_in_use: daysInUse
        },
        usage_stats: usageStats,
        usage_timeline: usageTimeline,
        environmental_data: envData
      }
    });
  } catch (error) {
    logger.error('Error fetching spool analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch spool analytics' });
  }
};

module.exports = {
  getOverallAnalytics,
  getSpoolAnalytics
};
