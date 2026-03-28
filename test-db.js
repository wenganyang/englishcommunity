const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 检查待修改的作文
    checkPendingEssays();
  }
});

// 检查待修改的作文
function checkPendingEssays() {
  db.all('SELECT * FROM essays WHERE status = ?', ['pending'], (err, essays) => {
    if (err) {
      console.error('查询待修改作文错误:', err);
    } else {
      console.log('待修改作文数量:', essays.length);
      console.log('待修改作文:', essays);
    }
    db.close();
  });
}
