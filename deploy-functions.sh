#!/bin/bash

# ITLab 天气服务 Cloud Functions 部署脚本

echo "🚀 开始部署 ITLab 天气服务 Cloud Functions..."

# 检查是否安装了 Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ 未安装 Firebase CLI，正在安装..."
    npm install -g firebase-tools
fi

# 检查是否登录
echo "📋 检查 Firebase 登录状态..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔐 请先登录 Firebase..."
    firebase login
fi

# 进入项目目录
cd "$(dirname "$0")"

# 初始化 Firebase（如果还没有）
if [ ! -f "firebase.json" ]; then
    echo "⚙️ 初始化 Firebase 项目..."
    firebase init functions --project github-cmiteamtop
fi

# 安装依赖
echo "📦 安装 Cloud Functions 依赖..."
cd functions
npm install
cd ..

# 部署 Cloud Functions
echo "🚀 部署 Cloud Functions..."
firebase deploy --only functions

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 请执行以下步骤："
echo "1. 复制上面显示的 getWeather 函数 URL"
echo "2. 打开 itlab-board.html"
echo "3. 找到 WEATHER_FUNCTION_URL 变量"
echo "4. 替换为你的 Cloud Function URL"
echo ""
echo "示例："
echo "const WEATHER_FUNCTION_URL = 'https://getWeather-xxxxxxxxxx-uc.a.run.app';"
echo ""
