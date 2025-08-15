const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

console.log('=== AI配置测试 ===');
console.log('');

console.log('DeepSeek API Key:');
if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here') {
    console.log('✅ 已配置:', process.env.DEEPSEEK_API_KEY.substring(0, 10) + '...');
} else {
    console.log('❌ 未配置或仍为占位符');
}

console.log('');

console.log('OpenAI API Key:');
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    console.log('✅ 已配置:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');
} else {
    console.log('❌ 未配置或仍为占位符');
}

console.log('');

console.log('=== 配置建议 ===');
if (process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
    console.log('⚠️  请编辑 config.env 文件，将 DEEPSEEK_API_KEY 替换为您的实际密钥');
    console.log('   格式: DEEPSEEK_API_KEY=sk-your-actual-key-here');
}

console.log('');
console.log('=== 测试完成 ===');



