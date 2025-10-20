const express = require('express');
const router = express.Router();
const db = require('../../config/database-mock');

// 获取所有定价方案
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM pricing_plans WHERE is_active = true ORDER BY price ASC'
    );

    res.json({
      success: true,
      plans: result.rows
    });
  } catch (error) {
    console.error('获取定价方案错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个定价方案
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM pricing_plans WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '未找到该方案' });
    }

    res.json({
      success: true,
      plan: result.rows[0]
    });
  } catch (error) {
    console.error('获取定价方案详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

