const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name, role = 'viewer' } = req.body;

        // 验证输入
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名、邮箱和密码不能为空'
            });
        }

        // 检查用户是否已存在
        const existingUser = await query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: '用户名或邮箱已存在'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        const result = await query(`
            INSERT INTO users (username, email, password_hash, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        `, [username, email, hashedPassword, full_name, role]);

        res.json({
            success: true,
            message: '用户注册成功',
            data: { user_id: result.insertId }
        });

    } catch (error) {
        console.error('用户注册失败:', error);
        res.status(500).json({
            success: false,
            message: '用户注册失败'
        });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 验证输入
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            });
        }

        // 查找用户
        const users = await query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        const user = users[0];

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        // 检查用户状态
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: '账户已被禁用'
            });
        }

        // 生成JWT令牌
        const token = jwt.sign(
            {
                user_id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 更新最后登录时间
        await query(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        res.json({
            success: true,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('用户登录失败:', error);
        res.status(500).json({
            success: false,
            message: '用户登录失败'
        });
    }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌'
            });
        }

        // 验证令牌
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 获取用户信息
        const users = await query(
            'SELECT id, username, email, full_name, role, department, created_at FROM users WHERE id = ?',
            [decoded.user_id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(401).json({
            success: false,
            message: '认证失败'
        });
    }
});

// 用户登出
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: '登出成功'
    });
});

// 修改密码
router.post('/change-password', async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌'
            });
        }

        // 验证令牌
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 获取用户信息
        const users = await query(
            'SELECT password_hash FROM users WHERE id = ?',
            [decoded.user_id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 验证当前密码
        const isValidPassword = await bcrypt.compare(current_password, users[0].password_hash);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: '当前密码错误'
            });
        }

        // 加密新密码
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // 更新密码
        await query(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hashedNewPassword, decoded.user_id]
        );

        res.json({
            success: true,
            message: '密码修改成功'
        });

    } catch (error) {
        console.error('修改密码失败:', error);
        res.status(500).json({
            success: false,
            message: '修改密码失败'
        });
    }
});

module.exports = router;




