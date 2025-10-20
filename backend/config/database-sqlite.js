const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/winsun.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite连接错误:', err);
  } else {
    console.log('✅ SQLite数据库连接成功');
  }
});

// 包装为Promise风格的query方法
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ rows: [{ id: this.lastID }], rowCount: this.changes });
      });
    }
  });
};

module.exports = {
  query,
  db
};

