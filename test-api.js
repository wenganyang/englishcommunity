const fetch = require('node-fetch');

// 测试管理员登录
async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    const data = await response.json();
    console.log('管理员登录响应:', data);
    
    if (response.ok && data.token) {
      // 测试获取待修改作文
      await testGetPendingEssays(data.token);
    }
  } catch (error) {
    console.error('测试管理员登录错误:', error);
  }
}

// 测试获取待修改作文
async function testGetPendingEssays(token) {
  try {
    const response = await fetch('http://localhost:3000/api/admin/essays/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('获取待修改作文响应:', data);
  } catch (error) {
    console.error('测试获取待修改作文错误:', error);
  }
}

// 运行测试
testAdminLogin();
