const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

// 获取监控状态
router.get('/status', async (req, res) => {
    try {
        const status = {
            online_devices: 12,
            warning_devices: 3,
            offline_devices: 1,
            system_efficiency: 95.2,
            alerts: [
                { time: "14:32:15", type: "warning", message: "PLC-001 温度过高" },
                { time: "14:30:22", type: "info", message: "变频器-002 启动完成" },
                { time: "14:28:45", type: "critical", message: "传感器-003 通信中断" }
            ]
        };
        
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "获取监控状态失败"
        });
    }
});

// 获取设备状态
router.get('/devices', async (req, res) => {
    try {
        const devices = [
            {
                id: 1,
                name: "S7-1200 CPU 1214C",
                status: "online",
                temperature: 45,
                uptime: 72
            },
            {
                id: 2,
                name: "ACS510-01-075A-4",
                status: "online",
                frequency: 50,
                current: 15
            },
            {
                id: 3,
                name: "Modicon M221",
                status: "offline",
                last_communication: "5分钟前"
            }
        ];
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "获取设备状态失败"
        });
    }
});

// 获取监控设备列表
router.get('/device-list', async (req, res) => {
    try {
        const devices = await query(`
            SELECT 
                md.*,
                dm.name as model_name,
                dm.specifications,
                db.name as brand_name
            FROM monitoring_devices md
            LEFT JOIN device_models dm ON md.device_model_id = dm.id
            LEFT JOIN device_brands db ON dm.brand_id = db.id
            ORDER BY md.created_at DESC
        `);
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error('获取监控设备失败:', error);
        res.status(500).json({
            success: false,
            message: '获取监控设备失败'
        });
    }
});

// 获取设备监控数据
router.get('/data/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { parameter, limit = 100 } = req.query;
        
        let whereClause = 'WHERE device_id = ?';
        const params = [deviceId];
        
        if (parameter) {
            whereClause += ' AND parameter_name = ?';
            params.push(parameter);
        }
        
        const data = await query(`
            SELECT * FROM monitoring_data
            ${whereClause}
            ORDER BY timestamp DESC
            LIMIT ?
        `, [...params, parseInt(limit)]);
        
        res.json({
            success: true,
            data: data.reverse()
        });
    } catch (error) {
        console.error('获取监控数据失败:', error);
        res.status(500).json({
            success: false,
            message: '获取监控数据失败'
        });
    }
});

// 获取监控仪表板数据
router.get('/dashboard', async (req, res) => {
    try {
        const statusStats = await query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM monitoring_devices
            GROUP BY status
        `);
        
        const systemOverview = {
            total_devices: 0,
            online_devices: 0,
            offline_devices: 0,
            error_devices: 0
        };
        
        statusStats.forEach(stat => {
            systemOverview.total_devices += stat.count;
            if (stat.status === 'online') {
                systemOverview.online_devices = stat.count;
            } else if (stat.status === 'offline') {
                systemOverview.offline_devices = stat.count;
            } else if (stat.status === 'error') {
                systemOverview.error_devices = stat.count;
            }
        });
        
        res.json({
            success: true,
            data: {
                systemOverview,
                statusStats
            }
        });
    } catch (error) {
        console.error('获取仪表板数据失败:', error);
        res.status(500).json({
            success: false,
            message: '获取仪表板数据失败'
        });
    }
});

module.exports = router;
