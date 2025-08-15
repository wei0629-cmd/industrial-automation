const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

const aiService = require('../services/ai-service');

async function testAllAI() {
    console.log('=== 多AI模型配置测试 ===');
    console.log('');
    
    // 检查各AI模型的配置状态
    const models = [
        {
            name: 'DeepSeek',
            key: process.env.DEEPSEEK_API_KEY,
            placeholder: 'your_deepseek_api_key_here',
            status: '❌ 未配置'
        },
        {
            name: '文心一言',
            key: process.env.WENXIN_API_KEY,
            placeholder: 'your_wenxin_api_key_here',
            status: '❌ 未配置'
        },
        {
            name: '腾讯混元',
            key: process.env.HUNYUAN_API_KEY,
            placeholder: 'your_hunyuan_api_key_here',
            status: '❌ 未配置'
        },
        {
            name: 'OpenAI',
            key: process.env.OPENAI_API_KEY,
            placeholder: 'your_openai_api_key_here',
            status: '❌ 未配置'
        }
    ];

    console.log('1. AI模型配置状态:');
    models.forEach(model => {
        if (model.key && model.key !== model.placeholder) {
            model.status = '✅ 已配置';
            console.log(`   ${model.name}: ${model.status} (${model.key.substring(0, 10)}...)`);
        } else {
            console.log(`   ${model.name}: ${model.status}`);
        }
    });
    
    console.log('');
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
    console.log('=== 配置说明 ===');
    console.log('• 系统会按优先级依次尝试: DeepSeek → 文心一言 → 腾讯混元 → OpenAI → 本地规则引擎');
    console.log('• 如果某个模型失败，会自动尝试下一个模型');
    console.log('• 所有模型都失败时，会使用本地规则引擎');
    console.log('');
    console.log('=== 获取API密钥 ===');
    console.log('• 文心一言: https://console.bce.baidu.com/ai/#/ai/wenxinworkshop/overview/index');
    console.log('• 腾讯混元: https://console.cloud.tencent.com/hunyuan');
    console.log('• OpenAI: https://platform.openai.com/api-keys');
    console.log('• DeepSeek: https://platform.deepseek.com/');
    console.log('');
    console.log('=== 测试完成 ===');
}

testAllAI();



