const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

const aiService = require('../services/ai-service');

async function testDeepSeek() {
    console.log('=== DeepSeek API 测试 ===');
    console.log('');
    
    console.log('1. 检查API密钥配置...');
    if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here') {
        console.log('✅ DeepSeek API密钥已配置');
        console.log('密钥前缀:', process.env.DEEPSEEK_API_KEY.substring(0, 10) + '...');
    } else {
        console.log('❌ DeepSeek API密钥未配置');
        return;
    }
    
    console.log('');
    console.log('2. 测试AI服务调用...');
    
    try {
        const testQuestion = '请介绍一下RS-485通信协议的特点和应用场景';
        console.log('测试问题:', testQuestion);
        console.log('');
        
        const result = await aiService.answerTechnicalQuestion(testQuestion, '工业自动化技术问答');
        
        console.log('✅ AI服务调用成功');
        console.log('使用的模型:', result.model);
        console.log('回答内容:');
        console.log(result.response);
        
    } catch (error) {
        console.log('❌ AI服务调用失败:', error.message);
        console.log('详细错误:', error);
    }
    
    console.log('');
    console.log('=== 测试完成 ===');
}

testDeepSeek();



