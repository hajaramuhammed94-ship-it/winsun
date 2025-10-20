/**
 * 认证中间件
 * 验证JWT token
 */

const jwt = require('jsonwebtoken');

/**
 * 验证JWT token
 */
function authenticateToken(req, res, next) {
    try {
        // 从请求头获取token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌'
            });
        }

        // 验证token
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: '无效的认证令牌'
                });
            }

            // 将用户信息添加到请求对象
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('认证错误:', error);
        res.status(500).json({
            success: false,
            message: '认证失败'
        });
    }
}

/**
 * 可选的认证中间件
 * 如果有token则验证，没有token也允许通过
 */
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                req.user = null;
            } else {
                req.user = user;
            }
            next();
        });
    } catch (error) {
        req.user = null;
        next();
    }
}

module.exports = {
    authenticateToken,
    optionalAuth
};

