const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config({ path: './config.env' });

// 导入路由
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const monitoringRoutes = require('./routes/monitoring');
const aiRoutes = require('./routes/ai');

// 导入数据库连接
const { testConnection } = require('./database/connection');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/ai', aiRoutes);

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 设备知识库页面
app.get('/devices', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'devices.html'));
});

// 监控系统页面
app.get('/monitoring', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'monitoring.html'));
});

// 搜索页面
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// AI助手页面
app.get('/ai-assistant', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-assistant.html'));
});

// 管理后台页面
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// WebSocket连接处理
io.on('connection', (socket) => {
    console.log('用户连接:', socket.id);

    // 加入监控房间
    socket.on('join-monitoring', (deviceId) => {
        socket.join(`device-${deviceId}`);
        console.log(`用户 ${socket.id} 加入设备 ${deviceId} 监控房间`);
    });

    // 离开监控房间
    socket.on('leave-monitoring', (deviceId) => {
        socket.leave(`device-${deviceId}`);
        console.log(`用户 ${socket.id} 离开设备 ${deviceId} 监控房间`);
    });

    // 断开连接
    socket.on('disconnect', () => {
        console.log('用户断开连接:', socket.id);
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : '未知错误'
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在'
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 测试数据库连接
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ 数据库连接失败，请检查配置');
            return;
        }

        server.listen(PORT, () => {
            console.log('🚀 工业自动化平台启动成功！');
            console.log(`📍 服务器地址: http://localhost:${PORT}`);
            console.log(`📊 监控系统: http://localhost:${PORT}/monitoring`);
            console.log(`📚 设备知识库: http://localhost:${PORT}/devices`);
            console.log(`🔍 智能搜索: http://localhost:${PORT}/search`);
            console.log(`⚙️ 管理后台: http://localhost:${PORT}/admin`);
            console.log('✨ 基于AI的工业自动化设备知识库与智能监控平台');
        });

    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
    }
};

// 导出io实例供其他模块使用
app.set('io', io);

// 启动服务器
startServer();

module.exports = { app, server, io };
