// 全局变量
let currentUser = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 检查用户登录状态
    checkAuthStatus();
    
    // 绑定事件监听器
    bindEventListeners();
}

// 检查认证状态
function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.data;
                updateUIForLoggedInUser();
            } else {
                localStorage.removeItem('auth_token');
            }
        })
        .catch(error => {
            console.error('认证检查失败:', error);
            localStorage.removeItem('auth_token');
        });
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 登录按钮
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
}

// 显示登录模态框
function showLoginModal() {
    alert('登录功能开发中...');
}

// 更新已登录用户的UI
function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn && currentUser) {
        loginBtn.textContent = currentUser.username;
    }
}

// 通用API请求函数
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '请求失败');
        }
        
        return data;
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}
