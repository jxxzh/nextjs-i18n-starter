# Next.js i18n Starter

一个基于 Next.js 15 的国际化启动模板，集成了现代前端开发最佳实践和工具链。

## ✨ 特性

- 🌐 基于 `next-intl` 的完整国际化解决方案
- ⚡️ Next.js 15 App Router 架构
- 🎨 集成 Tailwind CSS 和 Shadcn UI 组件
- 🔍 TypeScript 类型安全
- 📱 响应式设计，移动优先
- 🔥 React Query 数据获取
- 🛠 ESLint 代码规范
- 🚀 性能优化和最佳实践

## 🛠 技术栈

- **框架：** Next.js 15, React 19
- **类型系统：** TypeScript
- **样式解决方案：** Tailwind CSS, Shadcn UI
- **状态管理：** React Query
- **国际化：** next-intl
- **工具链：** ESLint, PostCSS
- **包管理器：** pnpm

## 🚀 快速开始

### 前置要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本

### 安装

1. 克隆项目

```bash
git clone https://github.com/yourusername/nextjs-i18n-starter.git
cd nextjs-i18n-starter
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

复制环境变量示例文件并根据需要修改：

```bash
cp .env.example .env.local
```

4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 项目结构

```
├── app/               # Next.js 应用目录
├── components/        # React 组件
├── hooks/             # 自定义 React Hooks
├── lib/               # 工具库和配置
├── messages/          # 国际化消息
├── public/            # 静态资源
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

## 🌐 国际化

项目使用 `next-intl` 进行国际化。翻译文件位于 `messages` 目录下。

## 📝 开发指南

### 代码规范

项目使用 ESLint 进行代码规范。运行以下命令进行代码检查：

```bash
pnpm lint
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 🙏 鸣谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
