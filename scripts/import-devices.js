const { query } = require('../database/connection');

// 预设的设备数据
const deviceDatabase = [
    {
        model: 'S7-1200 CPU 1214C',
        brand: '西门子',
        category: 'PLC',
        specifications: {
            'I/O点数': '14DI/10DO/2AI',
            '通信接口': 'PROFINET',
            '程序内存': '100KB'
        },
        features: '紧凑型PLC，适合小型自动化应用',
        applications: '小型机械设备控制、简单自动化生产线',
        price_range: '2000-5000元'
    },
    {
        model: 'Modicon M221',
        brand: '施耐德',
        category: 'PLC',
        specifications: {
            'I/O点数': '16DI/10DO',
            '通信接口': '以太网',
            '程序内存': '64KB'
        },
        features: '经济型PLC，易于编程',
        applications: '小型设备控制、简单自动化',
        price_range: '1500-3000元'
    },
    {
        model: 'ACS510-01-075A-4',
        brand: 'ABB',
        category: '变频器',
        specifications: {
            '功率': '75kW',
            '电压': '380-480V',
            '频率范围': '0-500Hz'
        },
        features: '通用型变频器，适用于各种工业应用',
        applications: '风机、泵类负载、传送带',
        price_range: '8000-15000元'
    }
];

// 导入设备数据
async function importDevices() {
    try {
        console.log('开始导入设备数据...');
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const device of deviceDatabase) {
            try {
                // 检查品牌是否存在
                let brandId = null;
                const brandResult = await query(
                    'SELECT id FROM device_brands WHERE name = ?',
                    [device.brand]
                );
                
                if (brandResult.length > 0) {
                    brandId = brandResult[0].id;
                } else {
                    const newBrand = await query(
                        'INSERT INTO device_brands (name, description) VALUES (?, ?)',
                        [device.brand, `${device.brand}自动化设备`]
                    );
                    brandId = newBrand.insertId;
                }
                
                // 检查分类是否存在
                let categoryId = null;
                const categoryResult = await query(
                    'SELECT id FROM device_categories WHERE name = ?',
                    [device.category]
                );
                
                if (categoryResult.length > 0) {
                    categoryId = categoryResult[0].id;
                } else {
                    const newCategory = await query(
                        'INSERT INTO device_categories (name, description) VALUES (?, ?)',
                        [device.category, `${device.category}设备`]
                    );
                    categoryId = newCategory.insertId;
                }
                
                // 插入设备型号
                await query(`
                    INSERT INTO device_models (name, brand_id, category_id, specifications, features, applications, price_range)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    device.model,
                    brandId,
                    categoryId,
                    JSON.stringify(device.specifications),
                    device.features,
                    device.applications,
                    device.price_range
                ]);
                
                console.log(`✅ 成功导入设备: ${device.model}`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ 导入设备 ${device.model} 失败:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`\n🎉 设备导入完成！`);
        console.log(`✅ 成功导入: ${successCount} 个设备`);
        console.log(`❌ 导入失败: ${errorCount} 个设备`);
        
    } catch (error) {
        console.error('设备导入过程中发生错误:', error);
    }
}

// 如果直接运行此文件，则执行导入
if (require.main === module) {
    importDevices();
}

module.exports = { importDevices, deviceDatabase };
