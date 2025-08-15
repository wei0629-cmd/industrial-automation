const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// 检查数据库配置
async function checkDatabaseConfig() {
    console.log('🔍 检查数据库配置...');
    console.log('=====================================');
    
    // 显示配置信息
    console.log(`主机: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`用户: ${process.env.DB_USER || 'root'}`);
    console.log(`数据库: ${process.env.DB_NAME || 'industrial_automation'}`);
    console.log(`密码: ${process.env.DB_PASSWORD ? '已设置' : '未设置'}`);
    
    try {
        // 尝试连接MySQL服务器
        console.log('\n正在测试MySQL连接...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        console.log('✅ MySQL服务器连接成功！');
        
        // 检查数据库是否存在
        const [rows] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'industrial_automation']);
        
        if (rows.length > 0) {
            console.log(`✅ 数据库 '${process.env.DB_NAME || 'industrial_automation'}' 已存在`);
        } else {
            console.log(`❌ 数据库 '${process.env.DB_NAME || 'industrial_automation'}' 不存在`);
            console.log('请运行: npm run create-db');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔧 解决方案:');
            console.log('1. 检查MySQL服务是否启动');
            console.log('2. 检查用户名和密码是否正确');
            console.log('3. 可以尝试手动登录MySQL:');
            console.log('   mysql -u root -p');
            console.log('4. 如果密码为空，请确保MySQL允许空密码登录');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('\n🔧 解决方案:');
            console.log('1. 确保MySQL服务已启动');
            console.log('2. 检查MySQL是否在默认端口3306运行');
            console.log('3. 检查防火墙设置');
        }
    }
}

// 如果直接运行此文件，则执行检查
if (require.main === module) {
    checkDatabaseConfig();
}

module.exports = { checkDatabaseConfig };
