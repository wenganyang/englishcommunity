const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 检查管理员用户
    checkAdminUser();
  }
});

// 检查管理员用户
function checkAdminUser() {
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, user) => {
    if (err) {
      console.error('查询管理员用户错误:', err);
    } else {
      console.log('管理员用户:', user);
    }
    db.close();
  });
}
