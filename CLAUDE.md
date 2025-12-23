# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CanvasAI Studio - 前后端分离的 AI 图像生成和编辑画布应用。支持自定义 AI 模型提供商。

## 项目结构 (Monorepo)

```
├── packages/
│   ├── client/          # 前端 (React + Vite)
│   └── server/          # 后端 (Express + TypeScript)
└── package.json         # workspace 配置
```

## Commands

```bash
# 安装依赖
npm install

# 同时启动前后端
npm run dev

# 仅启动前端 (端口 3000)
npm run dev:client

# 仅启动后端 (端口 3001)
npm run dev:server

# 构建
npm run build
```

## 后端配置

编辑 `packages/server/.env` 配置 AI 提供商:

```env
AI_PROVIDER=custom
AI_API_KEY=你的API密钥
AI_API_BASE_URL=https://你的API地址
AI_DEFAULT_MODEL=模型名称
```

### 添加新的 AI 提供商

1. 在 `packages/server/src/providers/` 创建新文件
2. 实现 `AIProvider` 接口 (定义在 `base.ts`)
3. 在 `providers/index.ts` 注册提供商

## Architecture

### Tech Stack
- **前端**: React 19 + TypeScript + Vite + Tailwind CSS (CDN)
- **后端**: Node.js + Express + TypeScript

### 前端结构 (packages/client)
- `src/App.tsx` - 主路由组件
- `src/components/HomePage.tsx` - 项目列表页
- `src/components/CanvasEditor.tsx` - 画布编辑器（核心组件，1700+ 行）
- `src/components/Storyboard.tsx` - 剧本分镜系统（时间轴、场景管理）
- `src/components/chatbot/` - Chatbot 对话面板
- `src/services/api.ts` - 后端 API 调用
- `src/services/projectService.ts` - localStorage 项目管理
- `src/types.ts` - 类型定义（CanvasItem, ToolMode, Scene, Storyboard 等）

### 后端结构 (packages/server)
- `src/index.ts` - Express 入口
- `src/routes/ai.ts` - AI API 路由
- `src/providers/base.ts` - AI 提供商接口定义
- `src/providers/custom.ts` - 自定义提供商示例

### API 端点

- `POST /api/ai/generate` - 生成图片
- `POST /api/ai/edit` - 编辑图片
- `POST /api/ai/upscale` - 放大图片
- `GET /api/config` - 获取配置
- `GET /api/health` - 健康检查

### Key Patterns

**Canvas Rendering**: CSS transforms 实现 pan/zoom，viewport 以屏幕中心为原点

**前后端通信**: 前端通过 Vite 代理 `/api` 请求到后端 3001 端口

**数据持久化**: 项目数据保存在 localStorage (`canvasai_projects`)，自动保存（500ms debounce）

**路径别名**: 前端使用 `@/` 映射到 `packages/client/src/`

## 核心功能模块

### 画布工具 (ToolMode)
- SELECT - 选择/移动元素
- PAN - 平移画布
- BRUSH - 自由绘制
- TEXT / RECTANGLE / CIRCLE / LINE / ARROW - 形状工具

### 画布元素 (CanvasItem.type)
- `image` - 图片（支持 AI 生成、上传、摄像头拍照）
- `text` - 文字（可双击编辑）
- `rectangle` / `circle` - 基础形状
- `brush` - 画笔路径（SVG path）
- `line` / `arrow` - 直线和箭头（SVG）

### 剧本分镜系统 (Storyboard)
- `Scene` - 场景/镜头，包含标题、描述、对白、视觉提示词
- `CanvasTimeline` - 画布内时间轴组件
- 场景图片可关联画布中的图片或 AI 生成
