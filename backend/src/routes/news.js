const express = require('express');
const router = express.Router();
const db = require('../../config/database-mock');

// 获取所有新闻
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM news WHERE is_published = true';
    let params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      news: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('获取新闻列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取单篇新闻
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.query(
      'SELECT * FROM news WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '未找到该文章' });
    }

    res.json({
      success: true,
      article: result.rows[0]
    });
  } catch (error) {
    console.error('获取新闻详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

