const axios = require('axios');
const { query } = require('../database/connection');

class AIService {
    constructor() {
        this.deepseekApiKey = process.env.DEEPSEEK_API_KEY;
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.wenxinApiKey = process.env.WENXIN_API_KEY;
        this.wenxinSecretKey = process.env.WENXIN_SECRET_KEY;
        this.hunyuanApiKey = process.env.HUNYUAN_API_KEY;
        this.hunyuanSecretId = process.env.HUNYUAN_SECRET_ID;
        this.hunyuanSecretKey = process.env.HUNYUAN_SECRET_KEY;
    }

    // 技术问答方法
    async answerTechnicalQuestion(question, context = '') {
        try {
            // 首先尝试使用OpenAI API
            if (this.openaiApiKey && this.openaiApiKey !== 'your_openai_api_key_here') {
                const result = await this.callOpenAI(question, context);
                if (result.success) {
                    return result;
                }
            }

            // 如果OpenAI失败，尝试使用DeepSeek API
            if (this.deepseekApiKey && this.deepseekApiKey !== 'your_deepseek_api_key_here') {
                const result = await this.callDeepSeek(question, context);
                if (result.success) {
                    return result;
                }
            }

            // 如果DeepSeek失败，尝试使用文心一言API
            if (this.wenxinApiKey && this.wenxinApiKey !== 'your_wenxin_api_key_here') {
                const result = await this.callWenxin(question, context);
                if (result.success) {
                    return result;
                }
            }

            // 如果文心一言失败，尝试使用腾讯混元API
            if (this.hunyuanApiKey && this.hunyuanApiKey !== 'your_hunyuan_api_key_here') {
                const result = await this.callHunyuan(question, context);
                if (result.success) {
                    return result;
                }
            }

            // 如果所有AI API都失败，使用本地规则引擎
            return this.localRuleEngine(question, context);

        } catch (error) {
            console.error('AI服务调用失败:', error);
            return this.localRuleEngine(question, context);
        }
    }

    // OpenAI API调用
    async callOpenAI(prompt, systemPrompt = null) {
        try {
            if (!this.openaiApiKey || this.openaiApiKey === 'your_openai_api_key_here') {
                throw new Error('OpenAI API密钥未配置');
            }

            const messages = [];
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            
            messages.push({
                role: 'user',
                content: prompt
            });

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                response: response.data.choices[0].message.content,
                model: 'gpt-3.5-turbo',
                usage: response.data.usage
            };

        } catch (error) {
            console.error('OpenAI API调用失败:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // DeepSeek API调用
    async callDeepSeek(prompt, systemPrompt = null) {
        try {
            if (!this.deepseekApiKey || this.deepseekApiKey === 'your_deepseek_api_key_here') {
                throw new Error('DeepSeek API密钥未配置');
            }

            const messages = [];
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            
            messages.push({
                role: 'user',
                content: prompt
            });

            const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${this.deepseekApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                response: response.data.choices[0].message.content,
                model: 'deepseek-chat',
                usage: response.data.usage
            };

        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // 文心一言API调用
    async callWenxin(prompt, systemPrompt = null) {
        try {
            if (!this.wenxinApiKey || !this.wenxinSecretKey || 
                this.wenxinApiKey === 'your_wenxin_api_key_here' || 
                this.wenxinSecretKey === 'your_wenxin_secret_key_here') {
                throw new Error('文心一言API密钥未配置');
            }

            // 这里可以添加文心一言API的具体实现
            // 由于文心一言API需要特殊的认证流程，这里暂时返回本地规则引擎的结果
            console.log('文心一言API暂未实现，使用本地规则引擎');
            return this.localRuleEngine(prompt, systemPrompt);

        } catch (error) {
            console.error('文心一言API调用失败:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // 腾讯混元API调用
    async callHunyuan(prompt, systemPrompt = null) {
        try {
            if (!this.hunyuanApiKey || !this.hunyuanSecretId || !this.hunyuanSecretKey ||
                this.hunyuanApiKey === 'your_hunyuan_api_key_here' ||
                this.hunyuanSecretId === 'your_hunyuan_secret_id_here' ||
                this.hunyuanSecretKey === 'your_hunyuan_secret_key_here') {
                throw new Error('腾讯混元API密钥未配置');
            }

            // 这里可以添加腾讯混元API的具体实现
            // 由于腾讯混元API需要特殊的认证流程，这里暂时返回本地规则引擎的结果
            console.log('腾讯混元API暂未实现，使用本地规则引擎');
            return this.localRuleEngine(prompt, systemPrompt);

        } catch (error) {
            console.error('腾讯混元API调用失败:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // 本地规则引擎（备用方案）
    localRuleEngine(question, context) {
        const lowerQuestion = question.toLowerCase();
        
        // 预定义的问答规则
        const rules = {
            'plc': {
                keywords: ['plc', '可编程控制器', '西门子', '三菱', '欧姆龙'],
                response: 'PLC（可编程逻辑控制器）是工业自动化中的核心设备，用于控制各种工业过程。主要品牌包括西门子、三菱、欧姆龙等。'
            },
            '变频器': {
                keywords: ['变频器', 'inverter', 'vfd', '调速'],
                response: '变频器用于控制交流电机的转速，广泛应用于风机、泵类负载的节能控制。'
            },
            '传感器': {
                keywords: ['传感器', 'sensor', '温度', '压力', '流量'],
                response: '传感器是工业自动化中的感知元件，用于检测温度、压力、流量等物理量。'
            },
            '通信': {
                keywords: ['通信', '通信协议', 'modbus', 'profibus', '以太网'],
                response: '工业通信协议包括Modbus、Profibus、以太网等，用于设备间的数据交换。'
            },
            '故障诊断': {
                keywords: ['故障', '诊断', '维修', '维护'],
                response: '设备故障诊断需要系统性的分析方法，包括症状分析、原因排查、解决方案制定等步骤。'
            }
        };

        // 匹配规则
        for (const [key, rule] of Object.entries(rules)) {
            if (rule.keywords.some(keyword => lowerQuestion.includes(keyword))) {
                return {
                    success: true,
                    response: rule.response,
                    model: 'local-rule-engine',
                    confidence: 0.8
                };
            }
        }

        // 默认回答
        return {
            success: true,
            response: '这是一个关于工业自动化的问题。建议您提供更具体的信息，我可以为您提供更准确的答案。',
            model: 'local-rule-engine',
            confidence: 0.5
        };
    }

    // 设备推荐
    async recommendDevices(requirements, budget, application) {
        try {
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
            
            return {
                success: true,
                data: recommendations
            };
            
        } catch (error) {
            console.error('设备推荐失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 故障诊断
    async diagnoseFault(symptoms) {
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
        
        if (symptoms.includes('振动异常')) {
            diagnosis.possible_causes.push('机械松动', '轴承磨损');
            diagnosis.solutions.push('检查紧固件', '更换轴承');
        }
        
        return {
            success: true,
            data: diagnosis
        };
    }
}

module.exports = new AIService();

