const { query, testConnection } = require('./connection.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// 创建数据库表的SQL语句
const createTables = async () => {
    try {
        console.log('开始创建数据库表...');

        // 1. 设备分类表
        await query(`
            CREATE TABLE IF NOT EXISTS device_categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL COMMENT '分类名称',
                description TEXT COMMENT '分类描述',
                parent_id INT DEFAULT NULL COMMENT '父分类ID',
                icon VARCHAR(100) DEFAULT NULL COMMENT '分类图标',
                sort_order INT DEFAULT 0 COMMENT '排序',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_parent_id (parent_id),
                INDEX idx_sort_order (sort_order)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备分类表'
        `);

        // 2. 设备品牌表
        await query(`
            CREATE TABLE IF NOT EXISTS device_brands (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL COMMENT '品牌名称',
                logo_url VARCHAR(255) DEFAULT NULL COMMENT '品牌Logo',
                description TEXT COMMENT '品牌描述',
                website VARCHAR(255) DEFAULT NULL COMMENT '官网地址',
                country VARCHAR(50) DEFAULT NULL COMMENT '国家/地区',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备品牌表'
        `);

        // 3. 设备型号表
        await query(`
            CREATE TABLE IF NOT EXISTS device_models (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL COMMENT '设备型号',
                brand_id INT NOT NULL COMMENT '品牌ID',
                category_id INT NOT NULL COMMENT '分类ID',
                specifications JSON COMMENT '技术参数',
                features TEXT COMMENT '产品特点',
                applications TEXT COMMENT '应用场景',
                price_range VARCHAR(100) DEFAULT NULL COMMENT '价格范围',
                status ENUM('active', 'discontinued', 'new') DEFAULT 'active' COMMENT '状态',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (brand_id) REFERENCES device_brands(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES device_categories(id) ON DELETE CASCADE,
                INDEX idx_brand_id (brand_id),
                INDEX idx_category_id (category_id),
                INDEX idx_status (status),
                INDEX idx_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备型号表'
        `);

        // 创建AI调用日志表
        await query(`
            CREATE TABLE IF NOT EXISTS ai_call_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type VARCHAR(50) NOT NULL COMMENT '调用类型',
                prompt TEXT NOT NULL COMMENT '用户输入',
                response TEXT NOT NULL COMMENT 'AI回答',
                model VARCHAR(100) NOT NULL COMMENT '使用的模型',
                tokens_used INT DEFAULT 0 COMMENT '使用的token数量',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI调用日志表'
        `);

        console.log('✅ 核心数据表创建成功！');
        return true;

    } catch (error) {
        console.error('❌ 创建数据表失败:', error);
        throw error;
    }
};

// 插入初始数据
const insertInitialData = async () => {
    try {
        console.log('开始插入初始数据...');

        // 插入设备分类
        await query(`
            INSERT IGNORE INTO device_categories (name, description, sort_order) VALUES
            ('PLC', '可编程逻辑控制器', 1),
            ('变频器', '变频调速器', 2),
            ('人机界面', '人机交互界面', 3),
            ('传感器', '工业传感器', 4),
            ('执行器', '工业执行器', 5),
            ('伺服系统', '伺服驱动系统', 6),
            ('网络设备', '工业网络设备', 7)
        `);

        // 插入设备品牌
        await query(`
            INSERT IGNORE INTO device_brands (name, description, country) VALUES
            ('西门子', '德国西门子自动化设备', '德国'),
            ('施耐德', '法国施耐德电气', '法国'),
            ('三菱', '日本三菱电机', '日本'),
            ('ABB', '瑞士ABB集团', '瑞士'),
            ('欧姆龙', '日本欧姆龙', '日本'),
            ('罗克韦尔', '美国罗克韦尔自动化', '美国')
        `);

        console.log('✅ 初始数据插入成功！');
        return true;

    } catch (error) {
        console.error('❌ 插入初始数据失败:', error);
        throw error;
    }
};

// 主函数
const initDatabase = async () => {
    try {
        // 测试数据库连接
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('无法连接到数据库，请检查配置');
            return;
        }

        // 创建数据表
        await createTables();

        // 插入初始数据
        await insertInitialData();

        console.log('🎉 数据库初始化完成！');

    } catch (error) {
        console.error('数据库初始化失败:', error);
    }
};

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
    initDatabase();
}

module.exports = { initDatabase, createTables, insertInitialData };
