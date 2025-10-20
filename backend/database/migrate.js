const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigration() {
  try {
    console.log('🚀 开始数据库迁移...\n');

    // 读取schema.sql文件
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 执行SQL
    await pool.query(schema);

    console.log('✅ 数据库表创建成功！\n');

    // 读取seed.sql文件
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 开始填充种子数据...\n');
      const seedData = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedData);
      console.log('✅ 种子数据填充成功！\n');
    }

    console.log('🎉 数据库迁移完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

runMigration();

