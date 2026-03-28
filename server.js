const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 静态文件服务
app.use(express.static(path.join(__dirname, '.')));

// SQLite数据库连接
const db = new sqlite3.Database('./englishcommunity.db', (err) => {
  if (err) {
    console.error('数据库连接错误:', err);
  } else {
    console.log('SQLite数据库连接成功');
    // 初始化数据库表
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建作文表
  db.run(`
    CREATE TABLE IF NOT EXISTS essays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userName TEXT NOT NULL,
      content TEXT NOT NULL,
      correctedContent TEXT,
      feedback TEXT,
      status TEXT DEFAULT 'pending',
      submittedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      correctedAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // 创建话题表
  db.run(`
    CREATE TABLE IF NOT EXISTS threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userName TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // 创建回复表
  db.run(`
    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      threadId INTEGER,
      userId INTEGER,
      userName TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (threadId) REFERENCES threads(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // 创建管理员用户
  createAdminUser();
}

// 创建管理员用户
function createAdminUser() {
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
    if (!row) {
      bcrypt.hash('admin123', 10, (err, hash) => {
        if (!err) {
          db.run(
            'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@example.com', hash, 1],
            (err) => {
              if (err) {
                console.error('创建管理员用户错误:', err);
              } else {
                console.log('管理员用户创建成功');
              }
            }
          );
        }
      });
    }
  });
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
app.post('/api/auth/register', (req, res) => {
  const { username, email = '', password } = req.body;
  
  console.log('注册请求:', { username, email, password });
  
  // 检查用户是否已存在
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('检查用户是否存在错误:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // 密码加密
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('密码加密错误:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      // 创建新用户
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        function(err) {
          if (err) {
            console.error('创建用户错误:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          
          // 获取新创建的用户
          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user) => {
            if (err) {
              console.error('获取新用户错误:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            
            const token = generateToken(user);
            res.status(201).json({
              message: 'User registered successfully',
              token,
              user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin }
            });
          });
        }
      );
    });
  });
});

// 用户登录
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 查找用户
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // 验证密码
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = generateToken(user);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin }
      });
    });
  });
});

// 提交流文
app.post('/api/essays', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  // 获取用户信息
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    // 插入作文
    db.run(
      'INSERT INTO essays (userId, userName, content, status) VALUES (?, ?, ?, ?)',
      [req.user.id, user.username, content, 'pending'],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        
        // 获取新创建的作文
        db.get('SELECT * FROM essays WHERE id = ?', [this.lastID], (err, essay) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          
          res.status(201).json({ message: 'Essay submitted successfully', essay });
        });
      }
    );
  });
});

// 获取用户的已修改作文
app.get('/api/essays/corrected', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM essays WHERE userId = ? AND status = ? ORDER BY correctedAt DESC',
    [req.user.id, 'corrected'],
    (err, essays) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json({ essays });
    }
  );
});

// 管理员获取待修改作文
app.get('/api/admin/essays/pending', authenticateToken, authenticateAdmin, (req, res) => {
  db.all(
    'SELECT * FROM essays WHERE status = ? ORDER BY submittedAt DESC',
    ['pending'],
    (err, essays) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json({ essays });
    }
  );
});

// 管理员修改作文
app.put('/api/admin/essays/:id', authenticateToken, authenticateAdmin, (req, res) => {
  const { correctedContent, feedback } = req.body;
  const essayId = req.params.id;
  
  // 更新作文
  db.run(
    'UPDATE essays SET correctedContent = ?, feedback = ?, status = ?, correctedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [correctedContent, feedback, 'corrected', essayId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Essay not found' });
      }
      
      // 获取更新后的作文
      db.get('SELECT * FROM essays WHERE id = ?', [essayId], (err, essay) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.status(200).json({ message: 'Essay corrected successfully', essay });
      });
    }
  );
});

// 发布话题
app.post('/api/threads', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  
  // 获取用户信息
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    // 插入话题
    db.run(
      'INSERT INTO threads (userId, userName, title, content) VALUES (?, ?, ?, ?)',
      [req.user.id, user.username, title, content],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        
        // 获取新创建的话题
        db.get('SELECT * FROM threads WHERE id = ?', [this.lastID], (err, thread) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          
          res.status(201).json({ message: 'Thread posted successfully', thread });
        });
      }
    );
  });
});

// 获取话题列表
app.get('/api/threads', (req, res) => {
  db.all('SELECT * FROM threads ORDER BY createdAt DESC', (err, threads) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    // 为每个话题获取回复数
    const getRepliesCount = (threads, callback) => {
      let count = 0;
      threads.forEach(thread => {
        db.get('SELECT COUNT(*) as count FROM replies WHERE threadId = ?', [thread.id], (err, result) => {
          thread.repliesCount = result.count;
          count++;
          if (count === threads.length) {
            callback(threads);
          }
        });
      });
    };
    
    getRepliesCount(threads, (threadsWithReplies) => {
      res.status(200).json({ threads: threadsWithReplies });
    });
  });
});

// 首页路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
