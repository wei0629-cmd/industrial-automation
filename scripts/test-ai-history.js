const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAIHistory() {
    console.log('🧪 测试AI历史记录功能...\n');

    try {
        // 1. 测试保存历史记录
        console.log('1. 测试保存历史记录...');
        const saveResponse = await axios.post(`${BASE_URL}/api/ai/history`, {
            question: '如何选择PLC？',
            answer: 'PLC选型需要考虑I/O点数、通信需求、编程环境等因素。推荐品牌：西门子、施耐德、三菱等。',
            timestamp: new Date().toISOString(),
            sessionId: 'test_session_001'
        });
        console.log('✅ 保存历史记录成功:', saveResponse.data.message);

        // 2. 测试获取历史记录
        console.log('\n2. 测试获取历史记录...');
        const getResponse = await axios.get(`${BASE_URL}/api/ai/history`);
        console.log('✅ 获取历史记录成功，记录数量:', getResponse.data.data.length);

        // 3. 测试AI问答功能
        console.log('\n3. 测试AI问答功能...');
        const qaResponse = await axios.post(`${BASE_URL}/api/ai/qa`, {
            question: '变频器故障诊断',
            context: '工业自动化技术问答'
        });
        console.log('✅ AI问答成功:', qaResponse.data.data.answer.substring(0, 50) + '...');

        // 4. 显示历史记录详情
        console.log('\n4. 历史记录详情:');
        getResponse.data.data.forEach((record, index) => {
            console.log(`   ${index + 1}. 问题: ${record.question}`);
            console.log(`      答案: ${record.answer.substring(0, 50)}...`);
            console.log(`      时间: ${record.created_at}`);
            console.log('');
        });

        console.log('🎉 所有测试通过！AI历史记录功能正常工作。');

    } catch (error) {
        console.error('❌ 测试失败:', error.response?.data || error.message);
    }
}

// 运行测试
testAIHistory();



