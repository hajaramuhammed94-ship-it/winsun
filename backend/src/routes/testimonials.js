const express = require('express');
const router = express.Router();
const db = require('../../config/database-mock');

// 获取所有用户反馈
router.get('/', async (req, res) => {
  try {
    const { featured, limit = 10 } = req.query;

    let query = 'SELECT * FROM testimonials';
    let params = [];

    if (featured === 'true') {
      query += ' WHERE is_featured = true';
    }

    query += ' ORDER BY created_at DESC LIMIT $1';
    params.push(limit);

    const result = await db.query(query, params);

    res.json({
      success: true,
      testimonials: result.rows
    });
  } catch (error) {
    console.error('获取用户反馈错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单个反馈
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM testimonials WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '未找到该反馈' });
    }

    res.json({
      success: true,
      testimonial: result.rows[0]
    });
  } catch (error) {
    console.error('获取反馈详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

