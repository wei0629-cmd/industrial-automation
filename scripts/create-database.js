const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// 创建数据库
async function createDatabase() {
    try {
        console.log('正在创建数据库...');
        
        // 连接MySQL服务器（不指定数据库）
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        // 创建数据库
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'industrial_automation'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        
        console.log(`✅ 数据库 '${process.env.DB_NAME || 'industrial_automation'}' 创建成功！`);
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ 创建数据库失败:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔧 解决方案:');
            console.log('1. 检查MySQL服务是否启动');
            console.log('2. 检查用户名和密码是否正确');
            console.log('3. 确保用户有创建数据库的权限');
            console.log('4. 可以尝试使用以下命令登录MySQL:');
            console.log('   mysql -u root -p');
        }
        
        throw error;
    }
}

// 如果直接运行此文件，则执行创建
if (require.main === module) {
    createDatabase();
}

module.exports = { createDatabase };
