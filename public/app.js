// 工业自动化系统前端JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('工业自动化系统已加载');
    
    // 导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
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
    
    // 搜索功能
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
    
    // 实时数据更新（模拟）
    function updateRealTimeData() {
        const statusElements = document.querySelectorAll('.status-indicator');
        statusElements.forEach(element => {
            const random = Math.random();
            if (random > 0.8) {
                element.className = 'status-indicator offline';
                element.textContent = '离线';
            } else {
                element.className = 'status-indicator online';
                element.textContent = '在线';
            }
        });
    }
    
    // 每5秒更新一次状态
    setInterval(updateRealTimeData, 5000);
    
    // 初始化
    updateRealTimeData();
});