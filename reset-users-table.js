const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 删除users表
    dropUsersTable();
  }
});

// 删除users表
function dropUsersTable() {
  db.run('DROP TABLE IF EXISTS users;', (err) => {
    if (err) {
      console.error('删除users表错误:', err);
    } else {
      console.log('users表删除成功');
      // 关闭数据库连接
      db.close();
      console.log('数据库连接已关闭');
      console.log('请重新启动服务器以重新创建users表');
    }
  });
}
