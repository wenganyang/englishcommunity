const sqlite3 = require('sqlite3').verbose();

// 连接数据库
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 检查所有作文
    checkAllEssays();
  }
});

// 检查所有作文
function checkAllEssays() {
  db.all('SELECT * FROM essays ORDER BY id DESC', (err, essays) => {
    if (err) {
      console.error('查询作文错误:', err);
    } else {
      console.log('所有作文数量:', essays.length);
      console.log('所有作文:', essays);
    }
    db.close();
  });
}
