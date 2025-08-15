const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

// 获取所有设备列表
router.get('/', async (req, res) => {
    try {
        const devices = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                db.logo_url as brand_logo,
                dc.name as category_name
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            ORDER BY dm.created_at DESC
        `);
        
        res.json({
            success: true,
            devices: devices
        });
    } catch (error) {
        console.error('获取设备列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备列表失败'
        });
    }
});

// 获取设备分类列表
router.get('/categories', async (req, res) => {
    try {
        const categories = await query(`
            SELECT * FROM device_categories 
            ORDER BY sort_order ASC, name ASC
        `);
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('获取设备分类失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备分类失败'
        });
    }
});

// 获取设备品牌列表
router.get('/brands', async (req, res) => {
    try {
        const brands = await query(`
            SELECT * FROM device_brands 
            ORDER BY name ASC
        `);
        
        res.json({
            success: true,
            data: brands
        });
    } catch (error) {
        console.error('获取设备品牌失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备品牌失败'
        });
    }
});

// 获取设备型号列表
router.get('/models', async (req, res) => {
    try {
        const { category_id, brand_id, search, page = 1, limit = 20 } = req.query;
        
        let whereClause = 'WHERE 1=1';
        const params = [];
        
        if (category_id) {
            whereClause += ' AND dm.category_id = ?';
            params.push(category_id);
        }
        
        if (brand_id) {
            whereClause += ' AND dm.brand_id = ?';
            params.push(brand_id);
        }
        
        if (search) {
            whereClause += ' AND (dm.name LIKE ? OR dm.features LIKE ? OR dm.applications LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        const offset = (page - 1) * limit;
        
        const devices = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                db.logo_url as brand_logo,
                dc.name as category_name
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            ${whereClause}
            ORDER BY dm.created_at DESC
            LIMIT ? OFFSET ?
        `, [...params, parseInt(limit), offset]);
        
        // 获取总数
        const totalResult = await query(`
            SELECT COUNT(*) as total
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            ${whereClause}
        `, params);
        
        const total = totalResult[0].total;
        
        res.json({
            success: true,
            data: devices,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('获取设备型号失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备型号失败'
        });
    }
});

// 获取设备详情
router.get('/models/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const device = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                db.logo_url as brand_logo,
                db.description as brand_description,
                dc.name as category_name,
                dc.description as category_description
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            WHERE dm.id = ?
        `, [id]);
        
        if (device.length === 0) {
            return res.status(404).json({
                success: false,
                message: '设备不存在'
            });
        }
        
        res.json({
            success: true,
            data: device[0]
        });
    } catch (error) {
        console.error('获取设备详情失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设备详情失败'
        });
    }
});

// 智能搜索设备
router.post('/search', async (req, res) => {
    try {
        const { query, filters = {} } = req.body;
        
        let whereClause = 'WHERE 1=1';
        const params = [];
        
        if (query) {
            whereClause += ` AND (
                dm.name LIKE ? OR 
                dm.features LIKE ? OR 
                dm.applications LIKE ? OR
                db.name LIKE ? OR
                dc.name LIKE ?
            )`;
            const searchTerm = `%${query}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        if (filters.category_id) {
            whereClause += ' AND dm.category_id = ?';
            params.push(filters.category_id);
        }
        
        if (filters.brand_id) {
            whereClause += ' AND dm.brand_id = ?';
            params.push(filters.brand_id);
        }
        
        const devices = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                db.logo_url as brand_logo,
                dc.name as category_name
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            ${whereClause}
            ORDER BY dm.created_at DESC
            LIMIT 50
        `, params);
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error('智能搜索失败:', error);
        res.status(500).json({
            success: false,
            message: '智能搜索失败'
        });
    }
});

// 设备对比
router.post('/compare', async (req, res) => {
    try {
        const { device_ids } = req.body;
        
        if (!device_ids || device_ids.length < 2 || device_ids.length > 5) {
            return res.status(400).json({
                success: false,
                message: '请选择2-5个设备进行对比'
            });
        }
        
        const placeholders = device_ids.map(() => '?').join(',');
        
        const devices = await query(`
            SELECT 
                dm.*,
                db.name as brand_name,
                db.logo_url as brand_logo,
                dc.name as category_name
            FROM device_models dm
            JOIN device_brands db ON dm.brand_id = db.id
            JOIN device_categories dc ON dm.category_id = dc.id
            WHERE dm.id IN (${placeholders})
            ORDER BY dm.id
        `, device_ids);
        
        res.json({
            success: true,
            data: devices
        });
    } catch (error) {
        console.error('设备对比失败:', error);
        res.status(500).json({
            success: false,
            message: '设备对比失败'
        });
    }
});

// 批量导入设备
router.post('/batch-import', async (req, res) => {
    try {
        const { devices } = req.body;
        
        if (!devices || !Array.isArray(devices)) {
            return res.status(400).json({
                success: false,
                message: '设备数据格式错误'
            });
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const device of devices) {
            try {
                // 检查品牌是否存在
                let brandId = device.brand_id;
                if (!brandId && device.brand) {
                    const brandResult = await query(
                        'SELECT id FROM device_brands WHERE name = ?',
                        [device.brand]
                    );
                    if (brandResult.length > 0) {
                        brandId = brandResult[0].id;
                    } else {
                        const newBrand = await query(
                            'INSERT INTO device_brands (name, description) VALUES (?, ?)',
                            [device.brand, device.brand_description || '']
                        );
                        brandId = newBrand.insertId;
                    }
                }
                
                // 检查分类是否存在
                let categoryId = device.category_id;
                if (!categoryId && device.category) {
                    const categoryResult = await query(
                        'SELECT id FROM device_categories WHERE name = ?',
                        [device.category]
                    );
                    if (categoryResult.length > 0) {
                        categoryId = categoryResult[0].id;
                    } else {
                        const newCategory = await query(
                            'INSERT INTO device_categories (name, description) VALUES (?, ?)',
                            [device.category, device.category_description || '']
                        );
                        categoryId = newCategory.insertId;
                    }
                }
                
                // 插入设备型号
                await query(`
                    INSERT INTO device_models (name, brand_id, category_id, specifications, features, applications, price_range)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    device.model,
                    brandId,
                    categoryId,
                    JSON.stringify(device.specifications || {}),
                    device.features || '',
                    device.applications || '',
                    device.price_range || null
                ]);
                
                successCount++;
            } catch (error) {
                console.error(`设备 ${device.model} 导入失败:`, error);
                errorCount++;
            }
        }
        
        res.json({
            success: true,
            message: `导入完成：成功 ${successCount} 个，失败 ${errorCount} 个`,
            data: { successCount, errorCount }
        });
    } catch (error) {
        console.error('批量导入失败:', error);
        res.status(500).json({
            success: false,
            message: '批量导入失败'
        });
    }
});

module.exports = router;
