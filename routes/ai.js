const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const aiService = require('../services/ai-service');

// AI智能推荐系统
router.post('/recommend', async (req, res) => {
    try {
        const { requirements, budget, application } = req.body;
        
        let whereClause = 'WHERE 1=1';
        const params = [];
        
        if (application) {
            switch (application.toLowerCase()) {
                case '小型自动化':
                    whereClause += ' AND (dc.name = "PLC" OR dc.name = "变频器")';
                    break;
                case '大型工业':
                    whereClause += ' AND (dc.name = "PLC" OR dc.name = "伺服系统")';
                    break;
                case '过程控制':
                    whereClause += ' AND (dc.name = "传感器" OR dc.name = "执行器")';
                    break;
                default:
                    break;
            }
        }
        
        const recommendations = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                dc.name as category_name
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            ${whereClause}
            ORDER BY dm.created_at DESC
            LIMIT 10
        `, params);
        
        res.json({
            success: true,
            data: recommendations
        });
        
    } catch (error) {
        console.error('AI推荐失败:', error);
        res.status(500).json({
            success: false,
            message: 'AI推荐失败'
        });
    }
});

// 故障诊断系统
router.post('/diagnose', async (req, res) => {
    try {
        const { symptoms } = req.body;
        
        const diagnosis = {
            possible_causes: [],
            solutions: [],
            severity: 'medium',
            estimated_repair_time: '2-4小时'
        };
        
        if (symptoms.includes('通信中断')) {
            diagnosis.possible_causes.push('网络连接问题', '设备配置错误');
            diagnosis.solutions.push('检查网络连接', '重新配置设备参数');
        }
        
        if (symptoms.includes('温度过高')) {
            diagnosis.possible_causes.push('散热系统故障', '环境温度过高');
            diagnosis.solutions.push('检查散热风扇', '改善通风条件');
        }
        
        res.json({
            success: true,
            data: diagnosis
        });
        
    } catch (error) {
        console.error('故障诊断失败:', error);
        res.status(500).json({
            success: false,
            message: '故障诊断失败'
        });
    }
});

// 智能问答系统
router.post('/qa', async (req, res) => {
    try {
        const { question, context } = req.body;
        
        // 使用AI服务进行智能问答
        const result = await aiService.answerTechnicalQuestion(question, context);
        
        res.json({
            success: true,
            data: {
                answer: result.response,
                model: result.model,
                confidence: 0.9,
                sources: ['AI模型', '技术手册', '专家经验']
            }
        });
        
    } catch (error) {
        console.error('智能问答失败:', error);
        res.status(500).json({
            success: false,
            message: '智能问答失败'
        });
    }
});

// 保存历史记录
router.post('/history', async (req, res) => {
    try {
        const { question, answer, timestamp, sessionId } = req.body;
        
        // 保存到数据库
        await query(`
            INSERT INTO ai_chat_history (question, answer, timestamp, session_id, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `, [question, answer, timestamp, sessionId]);
        
        res.json({
            success: true,
            message: '历史记录保存成功'
        });
        
    } catch (error) {
        console.error('保存历史记录失败:', error);
        res.status(500).json({
            success: false,
            message: '保存历史记录失败'
        });
    }
});

// 获取历史记录
router.get('/history', async (req, res) => {
    try {
        const history = await query(`
            SELECT id, question, answer, timestamp, session_id, created_at
            FROM ai_chat_history
            ORDER BY created_at DESC
            LIMIT 50
        `);
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('获取历史记录失败:', error);
        res.status(500).json({
            success: false,
            message: '获取历史记录失败'
        });
    }
});

// 删除单个历史记录
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await query(`
            DELETE FROM ai_chat_history
            WHERE id = ?
        `, [id]);
        
        res.json({
            success: true,
            message: '历史记录删除成功'
        });
        
    } catch (error) {
        console.error('删除历史记录失败:', error);
        res.status(500).json({
            success: false,
            message: '删除历史记录失败'
        });
    }
});

// 清空所有历史记录
router.delete('/history', async (req, res) => {
    try {
        await query(`
            DELETE FROM ai_chat_history
        `);
        
        res.json({
            success: true,
            message: '历史记录清空成功'
        });
        
    } catch (error) {
        console.error('清空历史记录失败:', error);
        res.status(500).json({
            success: false,
            message: '清空历史记录失败'
        });
    }
});

module.exports = router;
