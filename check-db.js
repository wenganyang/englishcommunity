const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 检查users表结构
    checkUsersTable();
  }
});

// 检查users表结构
function checkUsersTable() {
  db.all('PRAGMA table_info(users);', (err, columns) => {
    if (err) {
      console.error('查询users表结构错误:', err);
    } else {
      console.log('users表结构:', columns);
    }
    db.close();
  });
}
