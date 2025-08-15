// 工业自动化平台前端JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('工业自动化平台已加载');
    
    // 初始化应用
    initIndustrialPlatform();
});

function initIndustrialPlatform() {
    setupNavigation();
    setupDeviceMonitoring();
    setupAIAssistant();
    setupSearchFunction();
    setupAuthSystem();
    updateRealTimeData();
}

// 导航菜单功能
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // 导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // 正常导航
                return;
            }
            
            // 处理特殊导航
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });
}

// 设备监控功能
function setupDeviceMonitoring() {
    // 设备卡片点击事件
    const deviceCards = document.querySelectorAll('.device-card');
    deviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const deviceId = this.dataset.deviceId;
            if (deviceId) {
                window.location.href = `/devices/${deviceId}`;
            }
        });
    });
    
    // 实时数据更新
    setInterval(updateRealTimeData, 5000);
}

// 更新实时数据
function updateRealTimeData() {
    const statusElements = document.querySelectorAll('.status-indicator');
    statusElements.forEach(element => {
        // 模拟实时数据更新
        const random = Math.random();
        if (random > 0.9) {
            element.className = 'status-indicator offline';
            element.textContent = '离线';
        } else {
            element.className = 'status-indicator online';
            element.textContent = '在线';
        }
    });
    
    // 更新设备数据
    updateDeviceData();
}

// 更新设备数据
function updateDeviceData() {
    const deviceDataElements = document.querySelectorAll('.device-data');
    deviceDataElements.forEach(element => {
        const deviceType = element.dataset.deviceType;
        if (deviceType) {
            // 模拟设备数据
            const temperature = (20 + Math.random() * 30).toFixed(1);
            const pressure = (100 + Math.random() * 50).toFixed(1);
            const speed = (800 + Math.random() * 200).toFixed(0);
            
            element.innerHTML = `
                <div class="data-item">
                    <span class="label">温度:</span>
                    <span class="value">${temperature}°C</span>
                </div>
                <div class="data-item">
                    <span class="label">压力:</span>
                    <span class="value">${pressure}kPa</span>
                </div>
                <div class="data-item">
                    <span class="label">转速:</span>
                    <span class="value">${speed}rpm</span>
                </div>
            `;
        }
    });
}

// AI助手功能
function setupAIAssistant() {
    const aiAssistantBtn = document.querySelector('.ai-assistant-btn');
    if (aiAssistantBtn) {
        aiAssistantBtn.addEventListener('click', function() {
            window.location.href = '/ai-assistant';
        });
    }
    
    // AI聊天功能
    const chatForm = document.getElementById('ai-chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', handleAIChat);
    }
}

// 处理AI聊天
async function handleAIChat(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const message = formData.get('message');
    
    if (!message.trim()) return;
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        if (response.ok) {
            const data = await response.json();
            displayAIResponse(data.response);
        } else {
            showMessage('AI助手暂时不可用', 'error');
        }
    } catch (error) {
        showMessage('网络错误，请稍后重试', 'error');
    }
}

// 显示AI回复
function displayAIResponse(response) {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-response';
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>AI助手:</strong> ${response}
            </div>
        `;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// 搜索功能
function setupSearchFunction() {
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 执行搜索
function performSearch() {
    const searchInput = document.querySelector('#search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
}

// 认证系统
function setupAuthSystem() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 检查登录状态
    checkAuthStatus();
}

// 显示登录模态框
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 隐藏模态框
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage('登录成功！');
            hideModal('login-modal');
            updateUIAfterLogin();
        } else {
            const error = await response.json();
            showMessage('登录失败：' + error.message, 'error');
        }
    } catch (error) {
        showMessage('登录失败：' + error.message, 'error');
    }
}

// 检查认证状态
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            updateUIAfterLogin(userData);
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}

// 登录后更新UI
function updateUIAfterLogin(userData) {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn && userData) {
        loginBtn.textContent = `欢迎，${userData.username}`;
        loginBtn.onclick = logout;
    }
}

// 登出
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.textContent = '登录';
        loginBtn.onclick = showLoginModal;
    }
    
    showMessage('已登出');
    location.reload();
}

// 页面导航
function navigateToPage(page) {
    switch(page) {
        case 'devices':
            window.location.href = '/devices';
            break;
        case 'monitoring':
            window.location.href = '/monitoring';
            break;
        case 'search':
            window.location.href = '/search';
            break;
        case 'ai-assistant':
            window.location.href = '/ai-assistant';
            break;
        default:
            window.location.href = '/';
    }
}

// 显示消息
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .status-indicator {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-indicator.online {
        background-color: #27ae60;
        color: white;
    }
    
    .status-indicator.offline {
        background-color: #e74c3c;
        color: white;
    }
    
    .device-data {
        margin: 10px 0;
    }
    
    .data-item {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
    }
    
    .data-item .label {
        font-weight: bold;
        color: #666;
    }
    
    .data-item .value {
        color: #333;
    }
`;
document.head.appendChild(style);