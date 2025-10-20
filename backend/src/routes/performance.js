const express = require('express');
const router = express.Router();
const db = require('../../config/database-mock');

// 获取性能数据 (用于图表)
router.get('/', async (req, res) => {
  try {
    const { metric_type = 'net_value', start_date, end_date } = req.query;

    let query = 'SELECT * FROM performance_data WHERE metric_type = $1';
    let params = [metric_type];

    if (start_date) {
      query += ' AND date >= $2';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND date <= $' + (params.length + 1);
      params.push(end_date);
    }

    query += ' ORDER BY date ASC';

    const result = await db.query(query, params);

    // 格式化数据用于图表
    const chartData = result.rows.map(row => ({
      date: row.date,
      value: parseFloat(row.value)
    }));

    res.json({
      success: true,
      data: chartData,
      metric_type
    });
  } catch (error) {
    console.error('获取性能数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取统计摘要
router.get('/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        metric_type,
        COUNT(*) as data_points,
        MIN(value) as min_value,
        MAX(value) as max_value,
        AVG(value) as avg_value,
        MIN(date) as start_date,
        MAX(date) as end_date
      FROM performance_data
      GROUP BY metric_type
    `);

    res.json({
      success: true,
      summary: result.rows
    });
  } catch (error) {
    console.error('获取统计摘要错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

