#!/bin/bash

# 创意桥部署脚本

echo "🚀 开始部署创意桥..."

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npx prisma generate

# 3. 执行数据库迁移
echo "🗄️ 执行数据库迁移..."
npx prisma migrate deploy

# 4. 构建项目
echo "🏗️ 构建项目..."
npm run build

# 5. 启动服务
echo "✅ 启动服务..."
npm start

echo "🎉 部署完成！"
