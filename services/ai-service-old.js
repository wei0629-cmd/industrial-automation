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
        this.baseUrl = 'https://api.deepseek.com/v1';
    }

    // DeepSeek API调用
    async callDeepSeek(prompt, systemPrompt = null) {
        try {
            if (!this.deepseekApiKey) {
                throw new Error('DeepSeek API密钥未配�?);
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

            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
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

    // OpenAI API调用（备用）
    async callOpenAI(prompt, systemPrompt = null) {
        try {
            if (!this.openaiApiKey) {
                throw new Error('OpenAI API密钥未配�?);
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
                max_tokens: 1000
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

    // 百度文心一言API调用
    async callWenxin(prompt, systemPrompt = null) {
        try {
            if (!this.wenxinApiKey || !this.wenxinSecretKey) {
                throw new Error('文心一言API密钥未配�?);
            }

            // 获取访问令牌
            const tokenResponse = await axios.post('https://aip.baidubce.com/oauth/2.0/token', null, {
                params: {
                    grant_type: 'client_credentials',
                    client_id: this.wenxinApiKey,
                    client_secret: this.wenxinSecretKey
                }
            });

            const accessToken = tokenResponse.data.access_token;

            // 调用文心一言API
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

            const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${accessToken}`, {
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                response: response.data.result,
                model: 'wenxin-ernie-bot',
                usage: {
                    total_tokens: response.data.usage?.total_tokens || 0
                }
            };

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
            if (!this.hunyuanApiKey || !this.hunyuanSecretId || !this.hunyuanSecretKey) {
                throw new Error('腾讯混元API密钥未配�?);
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

            // 腾讯混元API调用（需要签名认证）
            const timestamp = Math.floor(Date.now() / 1000);
            const nonce = Math.random().toString(36).substring(2, 15);
            
            const response = await axios.post('https://hunyuan.tencentcloudapi.com/', {
                Action: 'ChatCompletion',
                Version: '2023-09-01',
                Region: 'ap-guangzhou',
                Messages: messages,
                Model: 'hunyuan-pro',
                MaxTokens: 1000,
                Temperature: 0.7,
                TopP: 0.8
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `TC3-HMAC-SHA256 Credential=${this.hunyuanSecretId}/${timestamp}/hunyuan/tc3_request`,
                    'X-TC-Action': 'ChatCompletion',
                    'X-TC-Version': '2023-09-01',
                    'X-TC-Timestamp': timestamp,
                    'X-TC-Region': 'ap-guangzhou'
                }
            });

            return {
                success: true,
                response: response.data.Response.Choices[0].Messages.Content,
                model: 'hunyuan-pro',
                usage: {
                    total_tokens: response.data.Response.Usage.TotalTokens || 0
                }
            };

        } catch (error) {
            console.error('腾讯混元API调用失败:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // 智能设备推荐
    async getDeviceRecommendation(requirements) {
        const systemPrompt = `你是一个专业的工业自动化设备选型专家。请根据用户需求推荐最适合的设备，并提供详细的选型理由�?

请按以下格式回答�?
1. 推荐设备：具体型号和品牌
2. 选型理由：为什么选择这个设备
3. 技术参数：关键参数说明
4. 应用建议：使用注意事�?
5. 替代方案：其他可选设�?

请确保回答专业、准确、实用。`;

        const prompt = `用户需求：${JSON.stringify(requirements)}

请为以上需求推荐最适合的工业自动化设备。`;

        // 优先使用DeepSeek
        let result = await this.callDeepSeek(prompt, systemPrompt);
        
        // 如果DeepSeek失败，使用OpenAI
        if (!result.success && result.fallback) {
            result = await this.callOpenAI(prompt, systemPrompt);
        }

        // 如果都失败，使用本地规则
        if (!result.success) {
            return this.getLocalRecommendation(requirements);
        }

        return result;
    }

    // 故障诊断
    async diagnoseFault(symptoms, deviceType) {
        const systemPrompt = `你是一个专业的工业自动化设备故障诊断专家。请根据用户描述的症状进行专业的故障分析�?

请按以下格式回答�?
1. 可能原因：列�?-5个最可能的原�?
2. 诊断步骤：具体的检查步�?
3. 解决方案：针对每个原因的解决方案
4. 预防措施：如何避免类似故�?
5. 紧急程度：故障的紧急程度评�?

请确保回答专业、准确、实用。`;

        const prompt = `设备类型�?{deviceType}
故障症状�?{symptoms}

请进行专业的故障诊断分析。`;

        let result = await this.callDeepSeek(prompt, systemPrompt);
        
        if (!result.success && result.fallback) {
            result = await this.callOpenAI(prompt, systemPrompt);
        }

        if (!result.success) {
            return this.getLocalDiagnosis(symptoms, deviceType);
        }

        return result;
    }

    // 技术问�?
    async answerTechnicalQuestion(question, context = '') {
        const systemPrompt = `你是一个专业的工业自动化技术专家，拥有丰富的实践经验�?

请按以下格式回答�?
1. 直接回答：简洁明了的答案
2. 详细解释：技术原理和背景
3. 实际应用：实际应用案�?
4. 注意事项：使用时的注意事�?
5. 相关资源：推荐的学习资源

请确保回答专业、准确、实用，适合工程技术人员理解。`;

        const prompt = `问题�?{question}
${context ? `上下文：${context}` : ''}

请提供专业的技术解答。`;

        let result = await this.callDeepSeek(prompt, systemPrompt);
        
        if (!result.success && result.fallback) {
            result = await this.callOpenAI(prompt, systemPrompt);
        }

        if (!result.success) {
            return this.getLocalAnswer(question);
        }

        return result;
    }

    // 性能分析
    async analyzePerformance(deviceData) {
        const systemPrompt = `你是一个专业的工业自动化设备性能分析专家。请根据设备运行数据进行专业的性能分析�?

请按以下格式回答�?
1. 性能评估：当前性能水平
2. 问题识别：发现的问题和异�?
3. 优化建议：具体的优化方案
4. 维护建议：维护保养建�?
5. 预测分析：未来性能趋势

请确保分析专业、准确、实用。`;

        const prompt = `设备运行数据�?{JSON.stringify(deviceData)}

请进行专业的性能分析。`;

        let result = await this.callDeepSeek(prompt, systemPrompt);
        
        if (!result.success && result.fallback) {
            result = await this.callOpenAI(prompt, systemPrompt);
        }

        if (!result.success) {
            return this.getLocalAnalysis(deviceData);
        }

        return result;
    }

    // 本地规则引擎（备用方案）
    getLocalRecommendation(requirements) {
        const { application, budget, experience } = requirements;
        
        let recommendations = [];
        
        if (application === '小型自动�?) {
            recommendations.push({
                device: '西门�?S7-1200 CPU 1214C',
                reason: '适合小型自动化项目，性价比高，编程简�?,
                parameters: '14DI/10DO, 2AI, 以太网通信',
                price: '经济�?
            });
        }
        
        if (application === '大型工业') {
            recommendations.push({
                device: '西门�?S7-1500 CPU 1515-2 PN',
                reason: '高性能PLC，适合大型工业应用',
                parameters: '32DI/32DO, 8AI/8AO, PROFINET通信',
                price: '高端�?
            });
        }

        return {
            success: true,
            response: `基于您的需求，推荐以下设备：\n\n${recommendations.map(r => 
                `�?${r.device}\n  理由�?{r.reason}\n  参数�?{r.parameters}\n  价格�?{r.price}`
            ).join('\n\n')}`,
            model: 'local-rules',
            usage: { total_tokens: 0 }
        };
    }

    getLocalDiagnosis(symptoms, deviceType) {
        let diagnosis = {
            possible_causes: [],
            solutions: [],
            severity: 'medium'
        };

        if (symptoms.includes('通信中断')) {
            diagnosis.possible_causes.push('网络连接问题', '设备配置错误', '通信协议不匹�?);
            diagnosis.solutions.push('检查网络连�?, '重新配置设备参数', '确认通信协议设置');
        }

        if (symptoms.includes('温度过高')) {
            diagnosis.possible_causes.push('散热系统故障', '环境温度过高', '负载过重');
            diagnosis.solutions.push('检查散热风�?, '改善通风条件', '检查负载情�?);
        }

        return {
            success: true,
            response: `故障诊断结果：\n\n可能原因：\n${diagnosis.possible_causes.map(c => `�?${c}`).join('\n')}\n\n解决方案：\n${diagnosis.solutions.map(s => `�?${s}`).join('\n')}\n\n紧急程度：${diagnosis.severity}`,
            model: 'local-rules',
            usage: { total_tokens: 0 }
        };
    }

    getLocalAnswer(question) {
        const answers = {
            'PLC': 'PLC（可编程逻辑控制器）是工业自动化的核心设备，用于控制生产流程。选型时需考虑I/O点数、通信需求、编程环境等因素�?,
            '变频�?: '变频器用于电机速度控制，通过改变电源频率实现调速。选型要点包括功率匹配、控制精度、应用环境等�?,
            '传感�?: '传感器是自动化系统的感知器官，用于检测各种物理量。常见类型包括温度、压力、流量、位置传感器等�?,
            '485': 'RS-485是一种常用的工业通信协议，支持多点通信，传输距离远，抗干扰能力强。常用于PLC、变频器、传感器等设备间的通信�?,
            '通信': '工业通信协议包括Modbus RTU/TCP、PROFINET、Ethernet/IP、CANopen等。选择时需考虑传输距离、速度、抗干扰能力等因素�?
        };

        for (const [key, answer] of Object.entries(answers)) {
            if (question.toLowerCase().includes(key.toLowerCase())) {
                return {
                    success: true,
                    response: answer,
                    model: 'local-rules',
                    usage: { total_tokens: 0 }
                };
            }
        }

        return {
            success: true,
            response: '这是一个很好的问题。作为工业自动化专家，我建议您提供更多具体信息，我可以为您提供更专业的解答�?,
            model: 'local-rules',
            usage: { total_tokens: 0 }
        };
    }

    // 智能问答主函数，支持多模型降�?
    async answerTechnicalQuestion(question, context) {
        console.log('开始处理AI问答请求:', question);
        
        const systemPrompt = '你是一个专业的工业自动化AI助手，专注于提供设备选型、故障诊断、技术问答、性能优化和维护保养指导。请用中文回答，回答要准确、专业、简洁�?;
        
        // 尝试DeepSeek
        if (this.deepseekApiKey && this.deepseekApiKey !== 'your_deepseek_api_key_here') {
            try {
                console.log('尝试使用DeepSeek API...');
                const result = await this.callDeepSeek(question, systemPrompt);
                
                if (result.success) {
                    console.log('DeepSeek API调用成功');
                    await this.logAICall('qa', question, result.response, result.model, result.usage);
                    return result;
                }
            } catch (error) {
                console.error('DeepSeek API调用失败，尝试备用方�?', error.message);
            }
        }

        // 尝试文心一言
        if (this.wenxinApiKey && this.wenxinApiKey !== 'your_wenxin_api_key_here') {
            try {
                console.log('尝试使用文心一言API...');
                const result = await this.callWenxin(question, systemPrompt);
                
                if (result.success) {
                    console.log('文心一言API调用成功');
                    await this.logAICall('qa', question, result.response, result.model, result.usage);
                    return result;
                }
            } catch (error) {
                console.error('文心一言API调用失败，尝试备用方�?', error.message);
            }
        }

        // 尝试腾讯混元
        if (this.hunyuanApiKey && this.hunyuanApiKey !== 'your_hunyuan_api_key_here') {
            try {
                console.log('尝试使用腾讯混元API...');
                const result = await this.callHunyuan(question, systemPrompt);
                
                if (result.success) {
                    console.log('腾讯混元API调用成功');
                    await this.logAICall('qa', question, result.response, result.model, result.usage);
                    return result;
                }
            } catch (error) {
                console.error('腾讯混元API调用失败，尝试备用方�?', error.message);
            }
        }

        // 尝试OpenAI
        if (this.openaiApiKey && this.openaiApiKey !== 'your_openai_api_key_here') {
            try {
                console.log('尝试使用OpenAI API...');
                const result = await this.callOpenAI(question, systemPrompt);
                
                if (result.success) {
                    console.log('OpenAI API调用成功');
                    await this.logAICall('qa', question, result.response, result.model, result.usage);
                    return result;
                }
            } catch (error) {
                console.error('OpenAI API调用失败，使用本地规则引�?', error.message);
            }
        }

        // 使用本地规则引擎
        console.log('使用本地规则引擎回答');
        const result = this.getLocalAnswer(question);
        await this.logAICall('qa', question, result.response, result.model, result.usage);
        return result;
    }

    getLocalAnalysis(deviceData) {
        return {
            success: true,
            response: `性能分析结果：\n\n�?当前状态：设备运行正常\n�?效率�?{deviceData.efficiency || 95}%\n�?建议：定期维护，监控关键参数\n�?预测：性能稳定，建议继续监控`,
            model: 'local-rules',
            usage: { total_tokens: 0 }
        };
    }

    // 记录AI调用日志
    async logAICall(type, prompt, response, model, usage) {
        try {
            await query(`
                INSERT INTO ai_call_logs (type, prompt, response, model, tokens_used, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [type, prompt, response, model, usage?.total_tokens || 0]);
        } catch (error) {

    // Save chat history to database
    async saveChatHistory(sessionId, userMessage, aiResponse, modelUsed) {
        try {
            await query(INSERT INTO chat_history (session_id, user_message, ai_response, model_used, created_at) VALUES (?, ?, ?, ?, NOW()), [sessionId, userMessage, aiResponse, modelUsed]);
        } catch (error) {
            console.error('Failed to save chat history:', error.message);
        }
    }

    // Get chat history for a session
    async getChatHistory(sessionId, limit = 50) {
        try {
            const [rows] = await query(SELECT * FROM chat_history WHERE session_id = ? ORDER BY created_at DESC LIMIT ?, [sessionId, limit]);
            return rows.reverse();
        } catch (error) {
            console.error('Failed to get chat history:', error.message);
            return [];
        }
    }

    // Get all chat sessions
    async getAllChatSessions() {
        try {
            const [rows] = await query(SELECT session_id, MAX(created_at) as last_message_time, COUNT(*) as message_count, MIN(created_at) as first_message_time FROM chat_history GROUP BY session_id ORDER BY last_message_time DESC);
            return rows;
        } catch (error) {
            console.error('Failed to get chat sessions:', error.message);
            return [];
        }
    }
}
            console.error('记录AI调用日志失败:', error);
        }
