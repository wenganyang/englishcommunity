const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 静态文件服务
app.use(express.static(path.join(__dirname, '.')));

// MySQL数据库连接
let db;

async function connectDatabase() {
  try {
    console.log('正在连接MySQL数据库...');
    db = await mysql.createPool({
      host: 'rm-bp1b3713xj28b75k3eo.mysql.rds.aliyuncs.com',
      port: 3306,
      user: 'Wenganyang163',
      password: 'Weng1234%',
      database: 'englishcommunity',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('MySQL数据库连接成功');
    // 测试连接
    const [rows] = await db.execute('SELECT 1');
    console.log('数据库连接测试成功:', rows);
    // 初始化数据库表
    await initDatabase();
  } catch (error) {
    console.error('数据库连接错误:', error);
    console.error('错误详情:', JSON.stringify(error, null, 2));
    // 尝试重新连接
    setTimeout(connectDatabase, 5000);
  }
}

// 启动时连接数据库
connectDatabase();

// 初始化数据库表
async function initDatabase() {
  try {
    // 创建用户表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        isAdmin INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建作文表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS essays (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        userName VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        correctedContent TEXT,
        feedback TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        correctedAt TIMESTAMP NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // 创建话题表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS threads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        userName VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // 创建回复表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS replies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        threadId INT,
        userId INT,
        userName VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (threadId) REFERENCES threads(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // 创建管理员用户
    await createAdminUser();
  } catch (error) {
    console.error('初始化数据库表错误:', error);
  }
}

// 创建管理员用户
async function createAdminUser() {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await db.execute(
        'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@example.com', hash, 1]
      );
      console.log('管理员用户创建成功');
    }
  } catch (error) {
    console.error('创建管理员用户错误:', error);
  }
}

// 生成JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, 'secretkey', { expiresIn: '7d' });
};

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// 管理员认证中间件
const authenticateAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// API路由

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email = '', password } = req.body;
    
    console.log('注册请求:', { username, email, password });
    
    // 检查用户是否已存在
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // 密码加密
    const hash = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    
    // 获取新创建的用户
    const [newUserRows] = await db.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const user = newUserRows[0];
    
    const token = generateToken(user);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 提交流文
app.post('/api/essays', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    // 获取用户信息
    const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = userRows[0];
    
    // 插入作文
    const [result] = await db.execute(
      'INSERT INTO essays (userId, userName, content, status) VALUES (?, ?, ?, ?)',
      [req.user.id, user.username, content, 'pending']
    );
    
    // 获取新创建的作文
    const [essayRows] = await db.execute('SELECT * FROM essays WHERE id = ?', [result.insertId]);
    const essay = essayRows[0];
    
    res.status(201).json({ message: 'Essay submitted successfully', essay });
  } catch (error) {
    console.error('提交流文错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 获取用户的已修改作文
app.get('/api/essays/corrected', authenticateToken, async (req, res) => {
  try {
    const [essays] = await db.execute(
      'SELECT * FROM essays WHERE userId = ? AND status = ? ORDER BY correctedAt DESC',
      [req.user.id, 'corrected']
    );
    res.status(200).json({ essays });
  } catch (error) {
    console.error('获取已修改作文错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 管理员获取待修改作文
app.get('/api/admin/essays/pending', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const [essays] = await db.execute(
      'SELECT * FROM essays WHERE status = ? ORDER BY submittedAt DESC',
      ['pending']
    );
    res.status(200).json({ essays });
  } catch (error) {
    console.error('获取待修改作文错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 管理员修改作文
app.put('/api/admin/essays/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { correctedContent, feedback } = req.body;
    const essayId = req.params.id;
    
    // 更新作文
    const [result] = await db.execute(
      'UPDATE essays SET correctedContent = ?, feedback = ?, status = ?, correctedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [correctedContent, feedback, 'corrected', essayId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Essay not found' });
    }
    
    // 获取更新后的作文
    const [essayRows] = await db.execute('SELECT * FROM essays WHERE id = ?', [essayId]);
    const essay = essayRows[0];
    
    res.status(200).json({ message: 'Essay corrected successfully', essay });
  } catch (error) {
    console.error('修改作文错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 发布话题
app.post('/api/threads', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // 获取用户信息
    const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = userRows[0];
    
    // 插入话题
    const [result] = await db.execute(
      'INSERT INTO threads (userId, userName, title, content) VALUES (?, ?, ?, ?)',
      [req.user.id, user.username, title, content]
    );
    
    // 获取新创建的话题
    const [threadRows] = await db.execute('SELECT * FROM threads WHERE id = ?', [result.insertId]);
    const thread = threadRows[0];
    
    res.status(201).json({ message: 'Thread posted successfully', thread });
  } catch (error) {
    console.error('发布话题错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 获取话题列表
app.get('/api/threads', async (req, res) => {
  try {
    // 获取所有话题
    const [threads] = await db.execute('SELECT * FROM threads ORDER BY createdAt DESC');
    
    // 为每个话题获取回复数
    const threadsWithReplies = await Promise.all(
      threads.map(async (thread) => {
        const [result] = await db.execute('SELECT COUNT(*) as count FROM replies WHERE threadId = ?', [thread.id]);
        thread.repliesCount = result[0].count;
        return thread;
      })
    );
    
    res.status(200).json({ threads: threadsWithReplies });
  } catch (error) {
    console.error('获取话题列表错误:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 首页路由（只处理非API请求）
app.get('*', (req, res) => {
  // 跳过API请求，让它们由专门的API路由处理
  if (req.url.startsWith('/api/')) {
    res.status(404).json({ message: 'API endpoint not found' });
    return;
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
