const http = require('http');

// 测试管理员登录
function testAdminLogin() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify({ username: 'admin', password: 'admin123' }))
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const result = JSON.parse(data);
      console.log('管理员登录响应:', result);
      if (result.token) {
        testGetPendingEssays(result.token);
      }
    });
  });

  req.on('error', (e) => {
    console.error('连接错误:', e);
  });

  req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
  req.end();
}

// 测试获取待修改作文
function testGetPendingEssays(token) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/essays/pending',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('响应状态码:', res.statusCode);
      console.log('响应头:', res.headers);
      console.log('响应数据:', data);
      try {
        const result = JSON.parse(data);
        console.log('解析后的响应数据:', result);
      } catch (e) {
        console.error('解析响应数据错误:', e);
      }
    });
  });

  req.on('error', (e) => {
    console.error('连接错误:', e);
  });

  req.end();
}

// 运行测试
testAdminLogin();
