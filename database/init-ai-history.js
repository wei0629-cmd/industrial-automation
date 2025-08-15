const { query } = require('./connection');

async function initAIHistoryTable() {
    try {
        console.log('正在创建AI聊天历史表...');
        
        // 创建AI聊天历史表
        await query(`
            CREATE TABLE IF NOT EXISTS ai_chat_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                timestamp VARCHAR(50),
                session_id VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_session_id (session_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ AI聊天历史表创建成功！');
        
        // 检查表是否存在数据
        const count = await query('SELECT COUNT(*) as count FROM ai_chat_history');
        console.log(`📊 当前历史记录数量: ${count[0].count}`);
        
    } catch (error) {
        console.error('❌ 创建AI聊天历史表失败:', error);
        throw error;
    }
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
    initAIHistoryTable()
        .then(() => {
            console.log('🎉 AI聊天历史表初始化完成！');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 初始化失败:', error);
            process.exit(1);
        });
}

module.exports = { initAIHistoryTable };


