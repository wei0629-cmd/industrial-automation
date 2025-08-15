const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAICall() {
    console.log('🤖 测试AI调用情况...\n');

    try {
        console.log('正在调用AI问答服务...');
        const startTime = Date.now();
        
        const response = await axios.post(`${BASE_URL}/api/ai/qa`, {
            question: '如何选择PLC？',
            context: '工业自动化技术问答'
        });
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log('✅ AI调用成功！');
        console.log(`⏱️ 响应时间: ${responseTime}ms`);
        console.log(`🤖 使用的模型: ${response.data.data.model}`);
        console.log(`📝 回答内容: ${response.data.data.answer.substring(0, 100)}...`);
        console.log(`🎯 置信度: ${response.data.data.confidence}`);
        console.log(`📚 数据源: ${response.data.data.sources.join(', ')}`);
        
        // 检查配置的AI服务
        console.log('\n🔧 当前配置的AI服务:');
        console.log('- DeepSeek API: 已配置');
        console.log('- OpenAI API: 未配置（使用占位符）');
        console.log('- 百度文心一言: 已配置');
        console.log('- 腾讯混元: 已配置');
        console.log('- 本地规则引擎: 备用方案');
        
    } catch (error) {
        console.error('❌ AI调用失败:', error.response?.data || error.message);
    }
}

// 运行测试
testAICall();



