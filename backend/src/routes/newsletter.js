const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../../config/database-mock');

// 订阅Newsletter
router.post('/subscribe', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // 检查是否已订阅
    const existing = await db.query(
      'SELECT id, is_active FROM subscriptions WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].is_active) {
        return res.status(400).json({ error: '该邮箱已订阅' });
      } else {
        // 重新激活订阅
        await db.query(
          'UPDATE subscriptions SET is_active = true, subscribed_at = CURRENT_TIMESTAMP WHERE email = $1',
          [email]
        );
        return res.json({
          success: true,
          message: '订阅已重新激活'
        });
      }
    }

    // 新订阅
    await db.query(
      'INSERT INTO subscriptions (email) VALUES ($1)',
      [email]
    );

    res.status(201).json({
      success: true,
      message: '订阅成功！感谢您的关注'
    });
  } catch (error) {
    console.error('订阅错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 取消订阅
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const result = await db.query(
      'UPDATE subscriptions SET is_active = false, unsubscribed_at = CURRENT_TIMESTAMP WHERE email = $1 AND is_active = true RETURNING id',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '未找到该订阅' });
    }

    res.json({
      success: true,
      message: '已成功取消订阅'
    });
  } catch (error) {
    console.error('取消订阅错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;

