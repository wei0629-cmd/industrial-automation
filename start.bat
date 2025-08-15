@echo off
echo ========================================
echo    工业自动化平台启动脚本
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 正在检查npm环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo 正在安装依赖包...
npm install
if errorlevel 1 (
    echo 错误: 依赖包安装失败
    pause
    exit /b 1
)

echo.
echo 正在创建数据库...
npm run create-db
if errorlevel 1 (
    echo 错误: 数据库创建失败，请检查MySQL配置
    echo 请确保MySQL服务已启动，并检查config.env文件中的数据库配置
    pause
    exit /b 1
)

echo.
echo 正在初始化数据库...
npm run init-db
if errorlevel 1 (
    echo 警告: 数据库初始化失败，请检查数据库配置
    echo 请确保MySQL服务已启动，并检查config.env文件中的数据库配置
    pause
)

echo.
echo 正在导入设备数据...
npm run import-devices
if errorlevel 1 (
    echo 警告: 设备数据导入失败
    pause
)

echo.
echo 正在启动服务器...
echo 服务器启动后，请访问: http://localhost:3001
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm run dev

pause
