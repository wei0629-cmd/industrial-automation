# 工业自动化平台

## 项目简介

基于AI的工业自动化设备知识库与智能监控平台，专为自动化工程师和技术人员设计。

## 核心功能

- **设备知识库**: 集成西门子、施耐德、三菱、ABB等主流厂商设备资料
- **智能监控**: 支持多种工业通信协议，实现设备实时监控
- **AI智能助手**: 智能问答、设备推荐、故障诊断
- **智能搜索**: 自然语言搜索，快速定位技术资料

## 技术架构

### 后端
- Node.js + Express.js
- MySQL数据库
- Socket.IO实时通信
- JWT用户认证

### 前端
- HTML5/CSS3/JavaScript
- 响应式设计
- 现代化UI界面

## 快速开始

1. **安装依赖**
```bash
npm install
```

2. **配置数据库**
- 创建数据库：`industrial_automation`
- 修改 `config.env` 配置

3. **初始化数据库**
```bash
npm run init-db
```

4. **启动服务器**
```bash
npm run dev
```

5. **访问应用**
- 主页: http://localhost:3001
- 设备知识库: http://localhost:3001/devices
- 监控系统: http://localhost:3001/monitoring

## 项目结构

```
工业自动化平台/
├── server.js                 # 主服务器
├── package.json              # 项目配置
├── config.env                # 环境配置
├── database/                 # 数据库
├── routes/                   # API路由
├── public/                   # 前端文件
└── README.md                 # 项目说明
```

## API接口

### 设备管理
- `GET /api/devices/categories` - 设备分类
- `GET /api/devices/brands` - 设备品牌
- `GET /api/devices/models` - 设备型号
- `POST /api/devices/search` - 智能搜索

### 监控系统
- `GET /api/monitoring/devices` - 监控设备
- `GET /api/monitoring/data/:id` - 监控数据
- `GET /api/monitoring/dashboard` - 仪表板

### AI功能
- `POST /api/ai/chat` - 智能问答
- `POST /api/ai/recommend` - 设备推荐
- `POST /api/ai/diagnose` - 故障诊断

## 数据库设计

### 核心表结构
- `device_categories` - 设备分类
- `device_brands` - 设备品牌
- `device_models` - 设备型号
- `monitoring_devices` - 监控设备
- `monitoring_data` - 监控数据
- `users` - 用户表

## 功能特色

### 1. 设备知识库
- 主流厂商设备资料
- 技术参数查询
- 应用案例展示
- 设备对比功能

### 2. 实时监控
- 设备状态监控
- 数据实时采集
- 报警管理
- 历史数据查询

### 3. AI智能助手
- 智能问答系统
- 设备推荐算法
- 故障诊断引擎
- 技术文档检索

## 技术亮点

- **模块化架构**: 清晰的项目结构，易于维护
- **实时通信**: WebSocket支持，实时数据推送
- **智能算法**: 基于规则的AI系统
- **安全性**: JWT认证，密码加密

## 开发计划

### 已完成
- ✅ 基础架构搭建
- ✅ 数据库设计
- ✅ API接口开发
- ✅ 前端基础界面

### 待开发
- 🔄 前端页面完善
- 🔄 实时监控界面
- 🔄 用户管理后台
- 🔄 移动端适配

## 部署说明

### 开发环境
1. 启动MySQL服务
2. 配置环境变量
3. 运行数据库初始化
4. 启动开发服务器

### 生产环境
1. 配置生产环境变量
2. 设置反向代理
3. 配置SSL证书
4. 使用进程管理器

## 项目价值

本项目专为自动化专业学生设计，体现了：

1. **技术能力**: 全栈开发、数据库设计、API开发
2. **行业理解**: 工业自动化设备知识
3. **AI应用**: 智能算法和机器学习
4. **工程实践**: 项目架构和部署经验

## 联系方式

- 项目地址: 桌面/自动/工业
- 版本: 1.0.0
- 许可证: MIT

---

**注意**: 这是一个基于AI的工业自动化平台，可作为自动化专业学生的简历项目，展示技术能力和行业理解。
