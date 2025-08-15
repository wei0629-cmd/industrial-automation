const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

console.log('🔍 测试环境变量...');
console.log('=====================================');
console.log(`配置文件路径: ${path.join(__dirname, '../config.env')}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`PORT: ${process.env.PORT}`);
