# Vercel 部署指南

## 🚀 快速部署步骤

### 1. 准备代码

确保所有文件已保存，然后提交到 Git：

```bash
cd C:\Users\nieka\Desktop\creative-bridge
git add .
git commit -m "Prepare for Vercel deployment"
```

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（例如：creative-bridge）
3. 不要初始化 README

### 3. 推送代码到 GitHub

```bash
git remote add origin https://github.com/你的用户名/creative-bridge.git
git push -u origin master
```

### 4. 在 Vercel 部署

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 配置环境变量：
   - `JWT_SECRET` = 随机字符串（至少32位）
   - `DATABASE_URL` = 你的数据库URL（Vercel Postgres 或 SQLite）
4. 点击 Deploy

### 5. 配置数据库（如果使用 Vercel Postgres）

1. 在 Vercel Dashboard 添加 Postgres 集成
2. 复制数据库连接字符串到环境变量
3. 重新部署

### 6. 完成！

Vercel 会自动提供域名：
- `https://creative-bridge-xxx.vercel.app`

---

## ⚙️ 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `JWT_SECRET` | 随机字符串 | JWT 签名密钥 |
| `DATABASE_URL` | 数据库连接 | SQLite 或 PostgreSQL |

---

## 📝 注意事项

1. **文件上传**：Vercel 是无服务器环境，文件上传建议使用：
   - Vercel Blob Storage
   - 阿里云 OSS
   - AWS S3

2. **数据库**：
   - 开发：SQLite（文件存储）
   - 生产：PostgreSQL（推荐 Vercel Postgres）

3. **蚂蚁链**：需要配置真实 API 密钥才能使用

---

## 🔧 本地测试后再部署

确保本地可以构建成功：

```bash
npm run build
```

如果没有错误，就可以部署到 Vercel。

---

## 📞 问题排查

### 构建失败
检查 Vercel 构建日志，通常是：
- 缺少环境变量
- 数据库连接问题

### 运行时错误
- 检查 Functions 日志
- 确认数据库已正确配置

---

**祝你部署顺利！** 🎉
