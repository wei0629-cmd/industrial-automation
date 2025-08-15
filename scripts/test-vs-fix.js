const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

const aiService = require('../services/ai-service');

async function testVSFix() {
    console.log('=== VS编程错误修复测试 ===');
    console.log('');
    
    // 检查环境变量配置
    console.log('1. 检查API密钥配置:');
    console.log(`   DeepSeek API Key: ${process.env.DEEPSEEK_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`   OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`   文心一言 API Key: ${process.env.WENXIN_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`   腾讯混元 API Key: ${process.env.HUNYUAN_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
    console.log('');
    
    // 测试AI服务调用
    console.log('2. 测试AI服务调用...');
    
    try {
        const testQuestion = '请介绍一下PLC的工作原理';
        console.log('测试问题:', testQuestion);
        console.log('');
        
        const result = await aiService.answerTechnicalQuestion(testQuestion, '工业自动化技术问答');
        
        console.log('✅ AI服务调用成功');
        console.log('使用的模型:', result.model);
        console.log('回答内容:');
        console.log(result.response);
        
    } catch (error) {
        console.log('❌ AI服务调用失败:', error.message);
    }
    
    console.log('');
    console.log('=== 修复说明 ===');
    console.log('• 已注释掉未配置的OpenAI API密钥');
    console.log('• 添加了文心一言和腾讯混元API的配置检查');
    console.log('• 系统会按优先级依次尝试: DeepSeek → 文心一言 → 腾讯混元 → 本地规则引擎');
    console.log('• 所有API都失败时，会使用本地规则引擎作为备用方案');
    console.log('');
    console.log('=== 测试完成 ===');
}

testVSFix();

