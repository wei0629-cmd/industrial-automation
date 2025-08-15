# 多AI模型集成说明

## 🎯 概述

本项目已成功集成4个主流AI模型，提供强大的智能问答能力：

1. **DeepSeek** - 优先使用，响应快速
2. **百度文心一言** - 中文理解能力强
3. **腾讯混元** - 技术问答专业
4. **OpenAI GPT** - 通用能力强
5. **本地规则引擎** - 备用方案，确保系统稳定

## 🔧 配置步骤

### 1. 百度文心一言配置

#### 获取API密钥
1. 访问：https://console.bce.baidu.com/ai/#/ai/wenxinworkshop/overview/index
2. 注册/登录百度智能云账号
3. 开通文心一言服务
4. 创建应用，获取API Key和Secret Key

#### 配置到项目
编辑 `config.env` 文件：
```env
WENXIN_API_KEY=your_actual_api_key_here
WENXIN_SECRET_KEY=your_actual_secret_key_here
```

### 2. 腾讯混元配置

#### 获取API密钥
1. 访问：https://console.cloud.tencent.com/hunyuan
2. 注册/登录腾讯云账号
3. 开通混元大模型服务
4. 创建API密钥，获取SecretId和SecretKey

#### 配置到项目
编辑 `config.env` 文件：
```env
HUNYUAN_API_KEY=your_actual_api_key_here
HUNYUAN_SECRET_ID=your_actual_secret_id_here
HUNYUAN_SECRET_KEY=your_actual_secret_key_here
```

## 💰 费用对比

### 文心一言
- **输入费用**：0.012元/1K tokens
- **输出费用**：0.012元/1K tokens
- **特点**：中文理解能力强，价格适中

### 腾讯混元
- **输入费用**：0.01元/1K tokens
- **输出费用**：0.01元/1K tokens
- **特点**：技术问答专业，价格较低

### 对比总结
| 模型 | 单次费用 | 特点 | 推荐场景 |
|------|----------|------|----------|
| DeepSeek | ~0.003元 | 响应快，质量高 | 日常问答 |
| 文心一言 | ~0.005元 | 中文理解强 | 复杂技术问题 |
| 腾讯混元 | ~0.004元 | 技术专业 | 专业咨询 |
| OpenAI | ~0.008元 | 通用性强 | 创意问题 |

## 🚀 使用方法

### 1. 测试配置
```bash
node scripts/test-all-ai.js
```

### 2. 重启服务器
```bash
npm run dev
```

### 3. 访问AI助手
http://localhost:3001/ai-assistant

## 🔄 调用优先级

系统会按以下顺序尝试AI模型：

1. **DeepSeek** - 优先使用（已配置）
2. **文心一言** - 中文理解强
3. **腾讯混元** - 技术专业
4. **OpenAI** - 通用能力强
5. **本地规则引擎** - 备用方案

如果某个模型失败，会自动尝试下一个模型。

## 📊 监控和日志

### 查看AI调用日志
```sql
SELECT 
    model,
    COUNT(*) as call_count,
    SUM(tokens_used) as total_tokens,
    AVG(LENGTH(response)) as avg_response_length
FROM ai_call_logs 
GROUP BY model
ORDER BY call_count DESC;
```

### 查看费用统计
```sql
SELECT 
    model,
    COUNT(*) as calls,
    SUM(tokens_used) as total_tokens,
    CASE 
        WHEN model = 'deepseek-chat' THEN SUM(tokens_used) * 0.00000028
        WHEN model = 'wenxin-ernie-bot' THEN SUM(tokens_used) * 0.000012
        WHEN model = 'hunyuan-pro' THEN SUM(tokens_used) * 0.00001
        WHEN model = 'gpt-3.5-turbo' THEN SUM(tokens_used) * 0.000002
        ELSE 0
    END as estimated_cost
FROM ai_call_logs 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY model;
```

## 🎯 最佳实践

### 1. 成本控制
- 重要问题使用AI模型
- 简单问题使用本地规则引擎
- 定期监控使用量和费用

### 2. 性能优化
- 使用简洁的问题描述
- 避免重复信息
- 明确具体需求

### 3. 故障处理
- 系统自动降级，无需手动干预
- 所有模型都失败时使用本地规则引擎
- 日志记录帮助排查问题

## 🔧 故障排除

### 常见问题

#### 1. API密钥错误
- 检查密钥格式是否正确
- 确认密钥是否有效
- 查看控制台错误日志

#### 2. 网络连接问题
- 检查网络连接
- 确认API服务可用性
- 尝试其他AI模型

#### 3. 费用超限
- 检查账户余额
- 调整使用策略
- 使用本地规则引擎

## 📈 项目价值

### 技术亮点
- **多模型架构**：4个AI模型 + 本地规则引擎
- **智能降级**：确保系统高可用性
- **成本控制**：多种选择，灵活配置
- **专业领域**：工业自动化专业知识

### 简历价值
- 展示AI集成能力
- 体现系统架构设计
- 证明问题解决能力
- 突出专业领域知识

## 🎉 总结

现在您的项目已经集成了4个主流AI模型，具备了：
- ✅ 强大的智能问答能力
- ✅ 高可用性和稳定性
- ✅ 灵活的成本控制
- ✅ 专业的工业自动化知识

这个项目绝对是一个**简历级别的工业自动化AI知识库系统**！




