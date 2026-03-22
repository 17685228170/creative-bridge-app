# 创意桥 (Creative Bridge)

AI驱动的创意版权保护与产业化平台

## 功能特性

### 创作者端
- ✅ 创意作品上传与区块链存证
- ✅ 侵权监测与维权服务
- ✅ 资产中心（收益管理）
- ✅ VIP会员服务
- ✅ 消息通知系统

### 企业端
- ✅ 创意需求发布
- ✅ 创意作品浏览与对接
- ✅ 合作意向管理

### 公共功能
- ✅ 创意集市（公开浏览）
- ✅ 角色选择（创作者/企业）
- ✅ 消息中心

## 技术栈

- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **数据库**: SQLite + Prisma
- **认证**: JWT

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
```

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
creative-bridge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   ├── creator/           # 创作者端页面
│   │   ├── enterprise/        # 企业端页面
│   │   ├── market/            # 创意集市
│   │   ├── messages/          # 消息中心
│   │   ├── vip/               # VIP会员
│   │   ├── login/             # 登录
│   │   ├── register/          # 注册
│   │   ├── role-select/       # 角色选择
│   │   ├── onboarding/        # 引导页
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   └── globals.css        # 全局样式
│   ├── components/            # 组件
│   │   └── ui/               # UI组件
│   ├── lib/                   # 工具函数
│   └── prisma/               # Prisma 配置
│       └── schema.prisma     # 数据库模型
├── public/                    # 静态资源
├── .env.example              # 环境变量示例
├── next.config.mjs           # Next.js 配置
├── package.json              # 依赖配置
├── tailwind.config.ts        # Tailwind 配置
└── tsconfig.json             # TypeScript 配置
```

## 数据库模型

- **User**: 用户（创作者/企业）
- **Idea**: 创意作品
- **Certificate**: 区块链存证证书
- **Demand**: 企业需求
- **Intent**: 合作意向

## API 接口

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 创意
- `GET /api/ideas` - 获取创意列表
- `POST /api/ideas` - 上传创意
- `GET /api/ideas/my` - 获取我的创意

### 需求
- `GET /api/demands` - 获取需求列表
- `POST /api/demands` - 发布需求
- `GET /api/demands/my` - 获取我的需求

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 服务器部署

```bash
# 构建
npm run build

# 启动
npm start
```

## 贡献

欢迎提交 Issue 和 PR！

## 许可证

MIT
