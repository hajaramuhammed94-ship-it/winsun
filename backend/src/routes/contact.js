const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../../config/database-mock');

// 提交联系表单
router.post('/submit', [
  body('name').trim().notEmpty().withMessage('请输入姓名'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('message').trim().notEmpty().withMessage('请输入留言内容')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    await db.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) 
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({
      success: true,
      message: '感谢您的留言，我们会尽快回复您！'
    });
  } catch (error) {
    console.error('提交联系表单错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有联系消息 (管理员功能)
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 20, is_read } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contact_messages';
    let params = [];

    if (is_read !== undefined) {
      query += ' WHERE is_read = $1';
      params.push(is_read === 'true');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      success: true,
      messages: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('获取联系消息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

