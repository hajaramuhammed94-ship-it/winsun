// 直接添加VIP2订阅码的脚本
const db = require('../config/database-mock');

async function addVIP2Subscription() {
    try {
        // 用户ID为1（12345@qq.com）
        const userId = 1;
        
        // 生成VIP2订阅码
        const subcode = 'VIP2-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        
        // 计算日期
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1); // 1年有效期
        
        // 创建订阅记录
        const result = await db.query(
            `INSERT INTO subscriptions 
            (user_id, subcode, plan_type, status, exchange, exchange_uid, start_date, end_date, vip_level, max_devices) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [
                userId,
                subcode,
                'vip2',
                'active',
                'manual',
                'ADMIN_GRANTED',
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                'VIP2',
                3
            ]
        );
        
        console.log('✅ VIP2订阅码创建成功！');
        console.log('订阅码:', result.rows[0].subcode);
        console.log('VIP等级:', result.rows[0].vip_level);
        console.log('最大设备数:', result.rows[0].max_devices);
        console.log('开始日期:', result.rows[0].start_date);
        console.log('结束日期:', result.rows[0].end_date);
        console.log('状态:', result.rows[0].status);
        
    } catch (error) {
        console.error('❌ 创建VIP2订阅码失败:', error);
    }
}

addVIP2Subscription();

