const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../config.env' });

// 测试不同的密码组合
const passwords = [
    '',  // 空密码
    'root',
    'password',
    'admin',
    '123456',
    '20040629Whj@',
    'mysql',
    'root123'
];

async function testPasswords() {
    console.log('🔍 测试MySQL密码...');
    console.log('=====================================');
    
    for (const password of passwords) {
        try {
            console.log(`正在测试密码: ${password || '(空密码)'}`);
            
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: password
            });
            
            console.log(`✅ 成功！密码是: ${password || '(空密码)'}`);
            await connection.end();
            return password;
            
        } catch (error) {
            console.log(`❌ 密码错误: ${password || '(空密码)'}`);
        }
    }
    
    console.log('❌ 所有密码都测试失败');
    return null;
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testPasswords();
}

module.exports = { testPasswords };



