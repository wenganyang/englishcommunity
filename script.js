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
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const submitTestBtn = document.getElementById('submit-test');
    const retakeTestBtn = document.getElementById('retake-test');
    const difficultySelection = document.getElementById('difficulty-selection');
    const testQuestions = document.getElementById('test-questions');
    const testResult = document.getElementById('test-result');
    const testTitle = document.getElementById('test-title');
    const questionsContainer = document.getElementById('questions-container');
    const vocabularyLevel = document.getElementById('vocabulary-level');
    const vocabularySize = document.getElementById('vocabulary-size');
    const correctRate = document.getElementById('correct-rate');
    
    // 不同难度的词汇测试题
    const vocabularyTests = {
        easy: {
            title: '初级词汇测试',
            questions: [
                {
                    question: '1. What does "happy" mean?',
                    options: [
                        'a. 悲伤的',
                        'b. 快乐的',
                        'c. 愤怒的',
                        'd. 害怕的'
                    ],
                    answer: 'b'
                },
                {
                    question: '2. What does "book" mean?',
                    options: [
                        'a. 铅笔',
                        'b. 书本',
                        'c. 电脑',
                        'd. 手机'
                    ],
                    answer: 'b'
                },
                {
                    question: '3. What does "dog" mean?',
                    options: [
                        'a. 猫',
                        'b. 狗',
                        'c. 鸟',
                        'd. 鱼'
                    ],
                    answer: 'b'
                },
                {
                    question: '4. What does "red" mean?',
                    options: [
                        'a. 红色',
                        'b. 蓝色',
                        'c. 绿色',
                        'd. 黄色'
                    ],
                    answer: 'a'
                },
                {
                    question: '5. What does "eat" mean?',
                    options: [
                        'a. 喝',
                        'b. 吃',
                        'c. 睡',
                        'd. 跑'
                    ],
                    answer: 'b'
                }
            ]
        },
        medium: {
            title: '中级词汇测试',
            questions: [
                {
                    question: '1. What does "ubiquitous" mean?',
                    options: [
                        'a. Rare',
                        'b. Everywhere',
                        'c. Expensive',
                        'd. Dangerous'
                    ],
                    answer: 'b'
                },
                {
                    question: '2. What does "ephemeral" mean?',
                    options: [
                        'a. Lasting a short time',
                        'b. Very old',
                        'c. Easy to understand',
                        'd. Difficult to pronounce'
                    ],
                    answer: 'a'
                },
                {
                    question: '3. What does "perspicacious" mean?',
                    options: [
                        'a. Stubborn',
                        'b. Quick to understand',
                        'c. Lazy',
                        'd. Forgetful'
                    ],
                    answer: 'b'
                },
                {
                    question: '4. What does "ambiguous" mean?',
                    options: [
                        'a. Clear',
                        'b. Unclear',
                        'c. Beautiful',
                        'd. Ugly'
                    ],
                    answer: 'b'
                },
                {
                    question: '5. What does "conspicuous" mean?',
                    options: [
                        'a. Hidden',
                        'b. Noticeable',
                        'c. Quiet',
                        'd. Loud'
                    ],
                    answer: 'b'
                }
            ]
        },
        hard: {
            title: '高级词汇测试',
            questions: [
                {
                    question: '1. What does "epicurean" mean?',
                    options: [
                        'a. Fond of pleasure',
                        'b. Dislike of pleasure',
                        'c. Fear of pleasure',
                        'd. Indifferent to pleasure'
                    ],
                    answer: 'a'
                },
                {
                    question: '2. What does "quixotic" mean?',
                    options: [
                        'a. Practical',
                        'b. Idealistic',
                        'c. Realistic',
                        'd. Cynical'
                    ],
                    answer: 'b'
                },
                {
                    question: '3. What does "sophisticated" mean?',
                    options: [
                        'a. Simple',
                        'b. Naive',
                        'c. Complex',
                        'd. Ignorant'
                    ],
                    answer: 'c'
                },
                {
                    question: '4. What does "perfunctory" mean?',
                    options: [
                        'a. Thorough',
                        'b. Superficial',
                        'c. Careful',
                        'd. Detailed'
                    ],
                    answer: 'b'
                },
                {
                    question: '5. What does "ubiquitous" mean?',
                    options: [
                        'a. Rare',
                        'b. Everywhere',
                        'c. Expensive',
                        'd. Dangerous'
                    ],
                    answer: 'b'
                }
            ]
        }
    };
    
    let currentTest = null;
    
    // 难度选择
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            currentTest = vocabularyTests[level];
            
            // 显示测试题
            difficultySelection.classList.add('hidden');
            testTitle.textContent = currentTest.title;
            
            // 生成测试题
            questionsContainer.innerHTML = '';
            currentTest.questions.forEach((q, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.innerHTML = `
                    <p>${q.question}</p>
                    <div class="options">
                        ${q.options.map((option, i) => `
                            <label>
                                <input type="radio" name="q${index + 1}" value="${String.fromCharCode(97 + i)}">
                                ${option}
                            </label>
                        `).join('')}
                    </div>
                `;
                questionsContainer.appendChild(questionDiv);
            });
            
            testQuestions.classList.remove('hidden');
        });
    });
    
    // 提交测试
    submitTestBtn.addEventListener('click', () => {
        if (!currentTest) return;
        
        let score = 0;
        
        // 检查答案
        currentTest.questions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="q${index + 1}"]:checked`);
            if (selectedOption && selectedOption.value === q.answer) {
                score++;
            }
        });
        
        // 计算词汇量水平
        const totalQuestions = currentTest.questions.length;
        const rate = Math.round((score / totalQuestions) * 100);
        let level, size;
        
        if (currentTest === vocabularyTests.easy) {
            if (rate >= 80) {
                level = '初级';
                size = '3000-5000';
            } else {
                level = '入门';
                size = '3000以下';
            }
        } else if (currentTest === vocabularyTests.medium) {
            if (rate >= 80) {
                level = '中级';
                size = '5000-8000';
            } else {
                level = '初级';
                size = '3000-5000';
            }
        } else if (currentTest === vocabularyTests.hard) {
            if (rate >= 80) {
                level = '高级';
                size = '8000+';
            } else {
                level = '中级';
                size = '5000-8000';
            }
        }
        
        vocabularyLevel.textContent = level;
        vocabularySize.textContent = size;
        correctRate.textContent = `${rate}%`;
        
        testQuestions.classList.add('hidden');
        testResult.classList.remove('hidden');
    });
    
    // 重新测试
    retakeTestBtn.addEventListener('click', () => {
        // 重置测试
        testResult.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
        currentTest = null;
    });
}

// 作文修改功能
function setupEssayCorrection() {
    const submitEssayBtn = document.getElementById('submit-essay');
    const essaySubmitted = document.getElementById('essay-submitted');
    const essayResult = document.getElementById('essay-result');
    const correctedEssay = document.querySelector('.corrected-essay');
    
    submitEssayBtn.addEventListener('click', async () => {
        const essayText = document.querySelector('textarea[placeholder="请在这里粘贴您的英语作文"]').value;
        
        if (essayText.trim() === '') {
            alert('请输入作文内容');
            return;
        }
        
        // 检查登录状态
        if (!window.authModule || !window.authModule.isLoggedIn()) {
            alert('请先登录后再提交作文');
            return;
        }
        
        try {
            const response = await fetch('/api/essays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.authModule.getToken()}`
                },
                body: JSON.stringify({ content: essayText })
            });
            
            const data = await response.json();
            if (response.ok) {
                // 显示提交成功提示
                essaySubmitted.classList.remove('hidden');
                essayResult.classList.add('hidden');
                
                // 清空文本框
                document.querySelector('textarea[placeholder="请在这里粘贴您的英语作文"]').value = '';
            } else {
                alert(data.message || '提交失败');
            }
        } catch (error) {
            console.error('提交作文错误:', error);
            alert('提交失败，请稍后重试');
        }
    });
    
    // 检查是否有已修改的作文
    async function checkCorrectedEssays() {
        // 检查登录状态
        if (!window.authModule || !window.authModule.isLoggedIn()) {
            return;
        }
        
        try {
            const response = await fetch('/api/essays/corrected', {
                headers: {
                    'Authorization': `Bearer ${window.authModule.getToken()}`
                }
            });
            
            const data = await response.json();
            if (response.ok && data.essays && data.essays.length > 0) {
                // 显示所有已修改的作文
                let essaysHTML = '';
                data.essays.forEach((essay, index) => {
                    essaysHTML += `
                        <div class="corrected-essay-item">
                            <h4>作文 ${index + 1} - 提交时间：${new Date(essay.submittedAt).toLocaleString()}</h4>
                            <div class="corrected-content">${essay.correctedContent}</div>
                            <div class="essay-feedback">${essay.feedback}</div>
                        </div>
                    `;
                });
                correctedEssay.innerHTML = essaysHTML;
                essayResult.classList.remove('hidden');
                essaySubmitted.classList.add('hidden');
            }
        } catch (error) {
            console.error('获取已修改作文错误:', error);
        }
    }
    
    // 初始化时检查
    checkCorrectedEssays();
    
    // 暴露函数
    window.essayModule = {
        checkCorrectedEssays
    };
}

// 管理员功能
function setupAdmin() {
    const adminLoginLink = document.getElementById('admin-login-link');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPanel = document.getElementById('admin-panel');
    const pendingEssaysContainer = document.getElementById('pending-essays');
    const closeButtons = document.querySelectorAll('.close');
    
    // 管理员登录
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        adminLoginModal.style.display = 'block';
    });
    
    // 关闭模态框
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
    });
    
    // 管理员登录表单提交
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (response.ok && data.user && data.user.isAdmin) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('管理员登录成功！');
                adminLoginModal.style.display = 'none';
                showAdminPanel();
            } else {
                alert('管理员用户名或密码错误！');
            }
        } catch (error) {
            console.error('管理员登录错误:', error);
            alert('登录失败，请稍后重试');
        }
    });
    
    // 显示管理员面板
    function showAdminPanel() {
        // 移除所有section的active类
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示管理员面板并添加active类
        adminPanel.classList.remove('hidden');
        adminPanel.classList.add('active');
        
        // 加载待修改的作文
        loadPendingEssays();
    }
    
    // 加载待修改的作文
    async function loadPendingEssays() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('没有找到token');
                alert('登录已过期，请重新登录');
                pendingEssaysContainer.innerHTML = '<p>登录已过期，请重新登录</p>';
                return;
            }
            
            console.log('使用token:', token);
            
            const response = await fetch('/api/admin/essays/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('响应状态:', response.status);
            
            const data = await response.json();
            console.log('响应数据:', data);
            
            if (response.ok) {
                const pendingEssays = data.essays || [];
                
                if (pendingEssays.length === 0) {
                    pendingEssaysContainer.innerHTML = '<p>暂无待修改的作文</p>';
                    return;
                }
                
                pendingEssaysContainer.innerHTML = '';
                pendingEssays.forEach(essay => {
                    const essayElement = document.createElement('div');
                    essayElement.className = 'admin-essay-item';
                    essayElement.innerHTML = `
                        <h4>用户：${essay.userName}</h4>
                        <p>提交时间：${new Date(essay.submittedAt).toLocaleString()}</p>
                        <div class="essay-content">${essay.content}</div>
                        <button class="correct-essay-btn" data-id="${essay.id}">修改作文</button>
                    `;
                    pendingEssaysContainer.appendChild(essayElement);
                });
                
                // 添加修改按钮事件
                document.querySelectorAll('.correct-essay-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const essayId = btn.dataset.id;
                        const essay = data.essays.find(e => e.id == essayId);
                        if (essay) {
                            correctEssay(essay);
                        }
                    });
                });
            } else {
                console.error('加载待修改作文错误:', data.message);
                alert(`加载失败: ${data.message || '未知错误'}`);
                pendingEssaysContainer.innerHTML = `<p>加载失败: ${data.message || '未知错误'}</p>`;
            }
        } catch (error) {
            console.error('加载待修改作文错误:', error);
            alert('加载失败，请稍后重试');
            pendingEssaysContainer.innerHTML = '<p>加载失败，请稍后重试</p>';
        }
    }
    
    // 修改作文
    function correctEssay(essay) {
        // 错误检测和修改
        let corrected = essay.content;
        const errors = [];
        
        // 检测主谓一致错误
        if (/I is/g.test(essay.content)) {
            errors.push('主谓一致错误："I is" 应改为 "I am"');
            corrected = corrected.replace(/I is/g, '<span style="color: red; font-weight: bold;">I is → I am</span>');
        }
        
        if (/they is/g.test(essay.content)) {
            errors.push('主谓一致错误："they is" 应改为 "they are"');
            corrected = corrected.replace(/they is/g, '<span style="color: red; font-weight: bold;">they is → they are</span>');
        }
        
        // 检测词汇表达问题
        if (/very good/g.test(essay.content)) {
            errors.push('词汇表达："very good" 可以改为更高级的表达 "excellent"');
            corrected = corrected.replace(/very good/g, '<span style="color: red; font-weight: bold;">very good → excellent</span>');
        }
        
        if (/very bad/g.test(essay.content)) {
            errors.push('词汇表达："very bad" 可以改为更高级的表达 "terrible"');
            corrected = corrected.replace(/very bad/g, '<span style="color: red; font-weight: bold;">very bad → terrible</span>');
        }
        
        if (/because/g.test(essay.content)) {
            errors.push('词汇表达："because" 可以改为更正式的表达 "due to the fact that"');
            corrected = corrected.replace(/because/g, '<span style="color: red; font-weight: bold;">because → due to the fact that</span>');
        }
        
        if (/but/g.test(essay.content)) {
            errors.push('词汇表达："but" 可以改为更正式的表达 "however"');
            corrected = corrected.replace(/but/g, '<span style="color: red; font-weight: bold;">but → however</span>');
        }
        
        if (/so/g.test(essay.content)) {
            errors.push('词汇表达："so" 可以改为更正式的表达 "therefore"');
            corrected = corrected.replace(/so/g, '<span style="color: red; font-weight: bold;">so → therefore</span>');
        }
        
        if (/many/g.test(essay.content)) {
            errors.push('词汇表达："many" 可以改为更具体的表达 "a significant number of"');
            corrected = corrected.replace(/many/g, '<span style="color: red; font-weight: bold;">many → a significant number of</span>');
        }
        
        if (/important/g.test(essay.content)) {
            errors.push('词汇表达："important" 可以改为更高级的表达 "crucial"');
            corrected = corrected.replace(/important/g, '<span style="color: red; font-weight: bold;">important → crucial</span>');
        }
        
        // 检测拼写错误
        if (/recieve/g.test(essay.content)) {
            errors.push('拼写错误："recieve" 应改为 "receive"');
            corrected = corrected.replace(/recieve/g, '<span style="color: red; font-weight: bold;">recieve → receive</span>');
        }
        
        if (/seperate/g.test(essay.content)) {
            errors.push('拼写错误："seperate" 应改为 "separate"');
            corrected = corrected.replace(/seperate/g, '<span style="color: red; font-weight: bold;">seperate → separate</span>');
        }
        
        // 检测语法错误
        if (/between you and I/g.test(essay.content)) {
            errors.push('语法错误："between you and I" 应改为 "between you and me"');
            corrected = corrected.replace(/between you and I/g, '<span style="color: red; font-weight: bold;">between you and I → between you and me</span>');
        }
        
        // 生成详细的反馈
        let feedbackText = '雅思写作修改建议：\n\n';
        
        // 具体错误分析
        if (errors.length > 0) {
            feedbackText += '【具体错误分析】\n';
            errors.forEach((error, index) => {
                feedbackText += `${index + 1}. ${error}\n`;
            });
            feedbackText += '\n';
        } else {
            feedbackText += '【具体错误分析】\n';
            feedbackText += '未检测到明显的词汇、拼写或语法错误，继续保持！\n\n';
        }
        
        // 任务回应 (Task Response)
        feedbackText += '【任务回应】\n';
        feedbackText += '1. 确保全面回应题目要求，涵盖所有任务点\n';
        feedbackText += '2. 提供具体的例子和论据支持你的观点\n';
        feedbackText += '3. 保持论点的一致性和相关性\n\n';
        
        // 连贯与衔接 (Coherence and Cohesion)
        feedbackText += '【连贯与衔接】\n';
        feedbackText += '1. 使用更多的连接词，如：however, therefore, furthermore, in addition\n';
        feedbackText += '2. 合理分段，每个段落聚焦一个主题\n';
        feedbackText += '3. 使用代词和指代词增强段落间的连贯性\n\n';
        
        // 词汇丰富度 (Lexical Resource)
        feedbackText += '【词汇丰富度】\n';
        feedbackText += '1. 尝试使用更高级的词汇，避免重复使用简单词汇\n';
        feedbackText += '2. 注意词汇的准确使用和搭配\n';
        feedbackText += '3. 适当使用学术性词汇提升文章质量\n\n';
        
        // 语法准确性 (Grammatical Range and Accuracy)
        feedbackText += '【语法准确性】\n';
        feedbackText += '1. 注意主谓一致和时态的正确使用\n';
        feedbackText += '2. 尝试使用更复杂的句子结构，如复合句和复杂句\n';
        feedbackText += '3. 检查标点符号和大小写的正确使用\n\n';
        
        // 总体建议
        feedbackText += '【总体建议】\n';
        feedbackText += '1. 控制文章长度，确保在规定时间内完成\n';
        feedbackText += '2. 留出时间检查拼写和语法错误\n';
        feedbackText += '3. 练习不同类型的雅思写作题目，熟悉考试要求\n';
        
        // 创建修改作文的模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="width: 80%; max-width: 800px;">
                <span class="close">&times;</span>
                <h2>修改作文</h2>
                <div class="form-group">
                    <label>原始作文</label>
                    <div class="original-essay" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; background-color: #f9f9f9;">
                        ${essay.content}
                    </div>
                </div>
                <div class="form-group">
                    <label>修改后的作文</label>
                    <textarea id="corrected-content" style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px;">
                        ${corrected}
                    </textarea>
                </div>
                <div class="form-group">
                    <label>评价与建议</label>
                    <textarea id="feedback-content" style="width: 100%; height: 300px; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px;">
                        ${feedbackText}
                    </textarea>
                </div>
                <div style="text-align: right;">
                    <button id="submit-correction" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">提交修改</button>
                    <button id="cancel-correction" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // 关闭模态框
        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 取消按钮
        modal.querySelector('#cancel-correction').addEventListener('click', () => {
            modal.remove();
        });
        
        // 提交修改
        modal.querySelector('#submit-correction').addEventListener('click', () => {
            const correctedContent = modal.querySelector('#corrected-content').value;
            const feedbackContent = modal.querySelector('#feedback-content').value;
            
            // 发送修改结果到后端
            fetch(`/api/admin/essays/${essay.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ correctedContent, feedback: feedbackContent })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Essay corrected successfully') {
                    alert('作文修改完成！');
                    modal.remove();
                    loadPendingEssays();
                } else {
                    alert('修改失败，请稍后重试');
                }
            })
            .catch(error => {
                console.error('修改作文错误:', error);
                alert('修改失败，请稍后重试');
            });
        });
    }
}

// 讨论区功能
function setupDiscussion() {
    const threadForm = document.querySelector('.thread-form');
    const threadList = document.querySelector('.thread-list');
    
    // 加载话题列表
    async function loadThreads() {
        try {
            const response = await fetch('/api/threads');
            const data = await response.json();
            if (response.ok && data.threads) {
                threadList.innerHTML = '';
                data.threads.forEach(thread => {
                    const threadItem = document.createElement('div');
                    threadItem.className = 'thread-item';
                    threadItem.innerHTML = `
                        <h3>${thread.title}</h3>
                        <p>发布者：${thread.userName} | 回复：${thread.repliesCount || 0} | 浏览：0</p>
                    `;
                    threadList.appendChild(threadItem);
                });
            }
        } catch (error) {
            console.error('加载话题列表错误:', error);
        }
    }
    
    // 初始化加载话题列表
    loadThreads();
    
    threadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = threadForm.querySelector('input[placeholder="标题"]').value;
        const content = threadForm.querySelector('textarea[placeholder="内容"]').value;
        
        if (title.trim() === '' || content.trim() === '') {
            alert('请填写标题和内容');
            return;
        }
        
        // 检查登录状态
        if (!window.authModule || !window.authModule.isLoggedIn()) {
            alert('请先登录后再发布话题');
            return;
        }
        
        try {
            const response = await fetch('/api/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.authModule.getToken()}`
                },
                body: JSON.stringify({ title, content })
            });
            
            const data = await response.json();
            if (response.ok) {
                // 清空表单
                threadForm.querySelector('input[placeholder="标题"]').value = '';
                threadForm.querySelector('textarea[placeholder="内容"]').value = '';
                
                alert('话题发布成功');
                loadThreads();
            } else {
                alert(data.message || '发布失败');
            }
        } catch (error) {
            console.error('发布话题错误:', error);
            alert('发布失败，请稍后重试');
        }
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
    
    // 检查登录状态
    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            loginLink.textContent = '退出';
            registerLink.style.display = 'none';
            return true;
        } else {
            loginLink.textContent = '登录';
            registerLink.style.display = 'inline-block';
            return false;
        }
    };
    
    // 初始化登录状态
    checkLoginStatus();
    
    // 打开登录模态框
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginLink.textContent === '退出') {
            // 退出登录
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            checkLoginStatus();
        } else {
            // 打开登录模态框
            loginModal.style.display = 'block';
        }
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
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username.trim() === '' || password.trim() === '') {
            alert('请输入用户名和密码');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('登录成功！');
                loginModal.style.display = 'none';
                checkLoginStatus();
                // 检查是否有已修改的作文
                if (window.essayModule && window.essayModule.checkCorrectedEssays) {
                    window.essayModule.checkCorrectedEssays();
                }
            } else {
                alert(data.message || '登录失败');
            }
        } catch (error) {
            console.error('登录错误:', error);
            alert('登录失败，请稍后重试');
        }
    });
    
    // 注册表单提交
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
            alert('请填写用户名和密码');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('注册成功！请登录');
                registerModal.style.display = 'none';
                loginModal.style.display = 'block';
            } else {
                alert(data.message || '注册失败');
            }
        } catch (error) {
            console.error('注册错误:', error);
            alert('注册失败，请稍后重试');
        }
    });
    
    // 暴露登录状态检查函数
    window.authModule = {
        checkLoginStatus,
        isLoggedIn: () => !!localStorage.getItem('token'),
        getToken: () => localStorage.getItem('token'),
        getUser: () => JSON.parse(localStorage.getItem('user'))
    };
}

// 词汇游戏功能
function setupVocabularyGame() {
    const gameModeBtns = document.querySelectorAll('.game-mode-btn');
    const gameArea = document.getElementById('game-area');
    const gameModes = document.querySelector('.game-modes');
    const matchingGame = document.getElementById('matching-game');
    const quizGame = document.getElementById('quiz-game');
    const memoryGame = document.getElementById('memory-game');
    const gameResult = document.getElementById('game-result');
    const startMatchingBtn = document.getElementById('start-matching');
    const startQuizBtn = document.getElementById('start-quiz');
    const startMemoryBtn = document.getElementById('start-memory');
    const playAgainBtn = document.getElementById('play-again');
    const backToModesBtn = document.getElementById('back-to-modes');
    
    // 游戏词汇数据
    const vocabularyData = [
        { english: 'happy', chinese: '快乐的' },
        { english: 'book', chinese: '书本' },
        { english: 'dog', chinese: '狗' },
        { english: 'red', chinese: '红色' },
        { english: 'eat', chinese: '吃' },
        { english: 'apple', chinese: '苹果' },
        { english: 'computer', chinese: '电脑' },
        { english: 'friend', chinese: '朋友' },
        { english: 'school', chinese: '学校' },
        { english: 'family', chinese: '家庭' }
    ];
    
    let currentGame = null;
    let gameInterval = null;
    let gameData = {
        score: 0,
        time: 0,
        maxTime: 0,
        matchedPairs: 0,
        totalPairs: 0,
        selectedCards: [],
        flippedCards: 0
    };
    
    // 游戏模式选择
    gameModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            currentGame = mode;
            
            gameModes.classList.add('hidden');
            gameArea.classList.remove('hidden');
            
            // 显示对应游戏
            matchingGame.classList.add('hidden');
            quizGame.classList.add('hidden');
            memoryGame.classList.add('hidden');
            gameResult.classList.add('hidden');
            
            if (mode === 'matching') {
                matchingGame.classList.remove('hidden');
            } else if (mode === 'quiz') {
                quizGame.classList.remove('hidden');
            } else if (mode === 'memory') {
                memoryGame.classList.remove('hidden');
            }
        });
    });
    
    // 词汇配对游戏
    startMatchingBtn.addEventListener('click', () => {
        startMatchingGame();
    });
    
    function startMatchingGame() {
        const matchingGrid = document.querySelector('.matching-grid');
        const scoreElement = document.getElementById('matching-score');
        const timeElement = document.getElementById('matching-time');
        
        // 重置游戏数据
        gameData = {
            score: 0,
            time: 60,
            maxTime: 60,
            matchedPairs: 0,
            totalPairs: 6,
            selectedCards: []
        };
        
        scoreElement.textContent = gameData.score;
        timeElement.textContent = gameData.time;
        
        // 生成卡片
        const gameWords = [...vocabularyData].slice(0, 6);
        const cards = [];
        
        // 添加英文卡片
        gameWords.forEach(word => {
            cards.push({ text: word.english, type: 'english', pair: word.chinese });
        });
        
        // 添加中文卡片
        gameWords.forEach(word => {
            cards.push({ text: word.chinese, type: 'chinese', pair: word.english });
        });
        
        // 打乱卡片
        cards.sort(() => Math.random() - 0.5);
        
        // 生成网格
        matchingGrid.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'matching-card';
            cardElement.dataset.pair = card.pair;
            cardElement.dataset.type = card.type;
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.text}</div>
            `;
            cardElement.addEventListener('click', () => handleMatchingCardClick(cardElement));
            matchingGrid.appendChild(cardElement);
        });
        
        // 开始计时
        startMatchingBtn.textContent = '重新开始';
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            gameData.time--;
            timeElement.textContent = gameData.time;
            
            if (gameData.time <= 0) {
                clearInterval(gameInterval);
                showGameResult('matching');
            }
        }, 1000);
    }
    
    function handleMatchingCardClick(card) {
        if (gameData.selectedCards.length >= 2) return;
        if (card.classList.contains('flipped')) return;
        
        card.classList.add('flipped');
        gameData.selectedCards.push(card);
        
        if (gameData.selectedCards.length === 2) {
            const card1 = gameData.selectedCards[0];
            const card2 = gameData.selectedCards[1];
            
            if (card1.dataset.pair === card2.textContent && card1.dataset.type !== card2.dataset.type) {
                // 配对成功
                gameData.score += 10;
                gameData.matchedPairs++;
                document.getElementById('matching-score').textContent = gameData.score;
                
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    gameData.selectedCards = [];
                    
                    if (gameData.matchedPairs === gameData.totalPairs) {
                        clearInterval(gameInterval);
                        showGameResult('matching');
                    }
                }, 500);
            } else {
                // 配对失败
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    gameData.selectedCards = [];
                }, 1000);
            }
        }
    }
    
    // 快速问答游戏
    startQuizBtn.addEventListener('click', () => {
        startQuizGame();
    });
    
    function startQuizGame() {
        const quizQuestion = document.querySelector('.quiz-question');
        const scoreElement = document.getElementById('quiz-score');
        const timeElement = document.getElementById('quiz-time');
        
        // 重置游戏数据
        gameData = {
            score: 0,
            time: 30,
            maxTime: 30
        };
        
        scoreElement.textContent = gameData.score;
        timeElement.textContent = gameData.time;
        
        // 生成问题
        generateQuizQuestion();
        
        // 开始计时
        startQuizBtn.textContent = '重新开始';
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            gameData.time--;
            timeElement.textContent = gameData.time;
            
            if (gameData.time <= 0) {
                clearInterval(gameInterval);
                showGameResult('quiz');
            }
        }, 1000);
    }
    
    function generateQuizQuestion() {
        const quizQuestion = document.querySelector('.quiz-question');
        const randomWord = vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
        
        // 生成选项
        const options = [randomWord.chinese];
        while (options.length < 4) {
            const randomOption = vocabularyData[Math.floor(Math.random() * vocabularyData.length)].chinese;
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }
        
        // 打乱选项
        options.sort(() => Math.random() - 0.5);
        
        // 生成问题
        quizQuestion.innerHTML = `
            <p>What does "${randomWord.english}" mean?</p>
            <div class="quiz-options">
                ${options.map((option, index) => `
                    <button class="quiz-option" data-correct="${option === randomWord.chinese}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `).join('')}
            </div>
        `;
        
        // 添加选项点击事件
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                if (option.dataset.correct === 'true') {
                    gameData.score += 5;
                    document.getElementById('quiz-score').textContent = gameData.score;
                    option.style.backgroundColor = '#4CAF50';
                } else {
                    option.style.backgroundColor = '#f44336';
                    // 显示正确答案
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        if (opt.dataset.correct === 'true') {
                            opt.style.backgroundColor = '#4CAF50';
                        }
                    });
                }
                
                // 延迟后生成新问题
                setTimeout(() => {
                    generateQuizQuestion();
                }, 1000);
            });
        });
    }
    
    // 记忆挑战游戏
    startMemoryBtn.addEventListener('click', () => {
        startMemoryGame();
    });
    
    function startMemoryGame() {
        const memoryGrid = document.querySelector('.memory-grid');
        const scoreElement = document.getElementById('memory-score');
        const timeElement = document.getElementById('memory-time');
        
        // 重置游戏数据
        gameData = {
            score: 0,
            time: 45,
            maxTime: 45,
            matchedPairs: 0,
            totalPairs: 6,
            selectedCards: [],
            flippedCards: 0
        };
        
        scoreElement.textContent = gameData.score;
        timeElement.textContent = gameData.time;
        
        // 生成卡片
        const gameWords = [...vocabularyData].slice(0, 6);
        const cards = [];
        
        // 每个单词添加两张卡片
        gameWords.forEach(word => {
            cards.push({ text: word.english, pair: word.english });
            cards.push({ text: word.english, pair: word.english });
        });
        
        // 打乱卡片
        cards.sort(() => Math.random() - 0.5);
        
        // 生成网格
        memoryGrid.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.pair = card.pair;
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.text}</div>
            `;
            cardElement.addEventListener('click', () => handleMemoryCardClick(cardElement));
            memoryGrid.appendChild(cardElement);
        });
        
        // 开始计时
        startMemoryBtn.textContent = '重新开始';
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            gameData.time--;
            timeElement.textContent = gameData.time;
            
            if (gameData.time <= 0) {
                clearInterval(gameInterval);
                showGameResult('memory');
            }
        }, 1000);
    }
    
    function handleMemoryCardClick(card) {
        if (gameData.selectedCards.length >= 2) return;
        if (card.classList.contains('flipped')) return;
        
        card.classList.add('flipped');
        gameData.selectedCards.push(card);
        
        if (gameData.selectedCards.length === 2) {
            const card1 = gameData.selectedCards[0];
            const card2 = gameData.selectedCards[1];
            
            if (card1.dataset.pair === card2.dataset.pair) {
                // 配对成功
                gameData.score += 8;
                gameData.matchedPairs++;
                document.getElementById('memory-score').textContent = gameData.score;
                
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    gameData.selectedCards = [];
                    
                    if (gameData.matchedPairs === gameData.totalPairs) {
                        clearInterval(gameInterval);
                        showGameResult('memory');
                    }
                }, 500);
            } else {
                // 配对失败
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    gameData.selectedCards = [];
                }, 1000);
            }
        }
    }
    
    // 显示游戏结果
    function showGameResult(gameType) {
        matchingGame.classList.add('hidden');
        quizGame.classList.add('hidden');
        memoryGame.classList.add('hidden');
        gameResult.classList.remove('hidden');
        
        const finalScore = document.getElementById('final-score');
        const finalTime = document.getElementById('final-time');
        const resultMessage = document.getElementById('result-message');
        
        finalScore.textContent = gameData.score;
        finalTime.textContent = gameData.maxTime - gameData.time;
        
        let message = '';
        if (gameData.score >= 50) {
            message = '太棒了！你是词汇大师！';
        } else if (gameData.score >= 30) {
            message = '不错！继续加油！';
        } else {
            message = '继续努力，你可以做得更好！';
        }
        
        resultMessage.textContent = message;
    }
    
    // 再玩一次
    playAgainBtn.addEventListener('click', () => {
        gameResult.classList.add('hidden');
        if (currentGame === 'matching') {
            matchingGame.classList.remove('hidden');
            startMatchingGame();
        } else if (currentGame === 'quiz') {
            quizGame.classList.remove('hidden');
            startQuizGame();
        } else if (currentGame === 'memory') {
            memoryGame.classList.remove('hidden');
            startMemoryGame();
        }
    });
    
    // 返回游戏模式
    backToModesBtn.addEventListener('click', () => {
        gameResult.classList.add('hidden');
        gameArea.classList.add('hidden');
        gameModes.classList.remove('hidden');
        currentGame = null;
        if (gameInterval) clearInterval(gameInterval);
    });
}

// 初始化所有功能
function init() {
    // 退出登录，回到初始状态
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setupNavigation();
    setupVocabularyTest();
    setupVocabularyGame();
    setupEssayCorrection();
    setupDiscussion();
    setupAuth();
    setupAdmin();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);