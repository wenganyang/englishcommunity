const http = require('http');

// 测试本地登录API
function testLocalLogin() {
  const username = 'testuser1774696624378';
  const password = '123456';
  
  const data = JSON.stringify({ username, password });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('响应状态码:', res.statusCode);
      console.log('响应数据:', responseData);
      try {
        const result = JSON.parse(responseData);
        console.log('解析后的响应数据:', result);
        if (res.statusCode === 200) {
          console.log('登录测试成功！');
        } else {
          console.log('登录测试失败:', result.message);
        }
      } catch (e) {
        console.error('解析响应数据错误:', e);
      }
    });
  });

  req.on('error', (e) => {
    console.error('连接错误:', e);
  });

  req.write(data);
  req.end();
}

// 运行测试
testLocalLogin();
