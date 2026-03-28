// 导航切换功能
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// 词汇量检测功能
function setupVocabularyTest() {
    const startTestBtn = document.getElementById('start-test');
    const submitTestBtn = document.getElementById('submit-test');
    const retakeTestBtn = document.getElementById('retake-test');
    const testQuestions = document.getElementById('test-questions');
    const testResult = document.getElementById('test-result');
    const vocabularyLevel = document.getElementById('vocabulary-level');
    const vocabularySize = document.getElementById('vocabulary-size');
    
    // 正确答案
    const correctAnswers = {
        q1: 'b',
        q2: 'a',
        q3: 'b'
    };
    
    startTestBtn.addEventListener('click', () => {
        startTestBtn.classList.add('hidden');
        testQuestions.classList.remove('hidden');
    });
    
    submitTestBtn.addEventListener('click', () => {
        let score = 0;
        
        // 检查答案
        Object.keys(correctAnswers).forEach(question => {
            const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
            if (selectedOption && selectedOption.value === correctAnswers[question]) {
                score++;
            }
        });
        
        // 计算词汇量水平
        let level, size;
        if (score === 3) {
            level = '高级';
            size = '8000+';
        } else if (score === 2) {
            level = '中级';
            size = '5000-8000';
        } else if (score === 1) {
            level = '初级';
            size = '3000-5000';
        } else {
            level = '入门';
            size = '3000以下';
        }
        
        vocabularyLevel.textContent = level;
        vocabularySize.textContent = size;
        
        testQuestions.classList.add('hidden');
        testResult.classList.remove('hidden');
    });
    
    retakeTestBtn.addEventListener('click', () => {
        // 重置测试
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        testResult.classList.add('hidden');
        startTestBtn.classList.remove('hidden');
    });
}

// 作文修改功能
function setupEssayCorrection() {
    const submitEssayBtn = document.getElementById('submit-essay');
    const essayResult = document.getElementById('essay-result');
    const correctedEssay = document.querySelector('.corrected-essay');
    const feedback = document.querySelector('.feedback');
    
    submitEssayBtn.addEventListener('click', () => {
        const essayText = document.querySelector('textarea[placeholder="请在这里粘贴您的英语作文"]').value;
        
        if (essayText.trim() === '') {
            alert('请输入作文内容');
            return;
        }
        
        // 模拟作文修改
        const corrected = essayText
            .replace(/I is/g, 'I am')
            .replace(/he is/g, 'he is')
            .replace(/she is/g, 'she is')
            .replace(/they is/g, 'they are')
            .replace(/very good/g, 'excellent')
            .replace(/very bad/g, 'terrible');
        
        correctedEssay.textContent = corrected;
        
        // 生成反馈
        let feedbackText = '作文修改建议：\n';
        feedbackText += '1. 注意主谓一致\n';
        feedbackText += '2. 尝试使用更丰富的词汇\n';
        feedbackText += '3. 增加一些连接词使文章更连贯\n';
        feedbackText += '4. 检查标点符号的使用\n';
        
        feedback.textContent = feedbackText;
        
        essayResult.classList.remove('hidden');
    });
}

// 讨论区功能
function setupDiscussion() {
    const threadForm = document.querySelector('.thread-form');
    const threadList = document.querySelector('.thread-list');
    
    threadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = threadForm.querySelector('input[placeholder="标题"]').value;
        const content = threadForm.querySelector('textarea[placeholder="内容"]').value;
        
        if (title.trim() === '' || content.trim() === '') {
            alert('请填写标题和内容');
            return;
        }
        
        // 创建新话题
        const threadItem = document.createElement('div');
        threadItem.className = 'thread-item';
        threadItem.innerHTML = `
            <h3>${title}</h3>
            <p>发布者：访客 | 回复：0 | 浏览：0</p>
        `;
        
        threadList.insertBefore(threadItem, threadList.firstChild);
        
        // 清空表单
        threadForm.querySelector('input[placeholder="标题"]').value = '';
        threadForm.querySelector('textarea[placeholder="内容"]').value = '';
        
        alert('话题发布成功');
    });
}

// 登录和注册功能
function setupAuth() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // 打开登录模态框
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // 打开注册模态框
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'block';
    });
    
    // 关闭模态框
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // 登录表单提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username.trim() === '' || password.trim() === '') {
            alert('请输入用户名和密码');
            return;
        }
        
        // 模拟登录成功
        alert('登录成功！');
        loginModal.style.display = 'none';
        
        // 更新导航栏
        loginLink.textContent = '退出';
        registerLink.style.display = 'none';
    });
    
    // 注册表单提交
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (username.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            alert('请填写所有字段');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        // 模拟注册成功
        alert('注册成功！请登录');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}

// 初始化所有功能
function init() {
    setupNavigation();
    setupVocabularyTest();
    setupEssayCorrection();
    setupDiscussion();
    setupAuth();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);