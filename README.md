# Vellastra 星垂野内容系统 — 大前端 Monorepo

> **Vellastra Content System** — 基于 Vue 3 + TypeScript + Element Plus 构建的全平台内容系统前端，采用 pnpm monorepo 架构，一套代码覆盖 Web / Desktop / Mobile 三端。

**Vellastra** = *vellus*（覆盖万物的毯子）+ *astra*（群星），取"星辰如毡毯覆盖原野"之意，对应杜甫《旅夜书怀》"星垂平野阔，月涌大江流"的意境。

---

## 📦 项目架构

```
vellastra-fz/
├── packages/                          # 共享包
│   ├── api-core/                      #   API 请求客户端 + 模块工厂
│   ├── shared/                        #   共享类型 / 常量 / 工具函数
│   └── ui/                            #   共享 UI 组件 + 紫色星辰主题样式
│
├── apps/
│   ├── web/
│   │   ├── personal/                  # 📱 博客前台（用户端）
│   │   ├── admin/                     # 📊 管理后台（管理员端）
│   │   └── server-admin/              # 🖥️ 服务器管理后台（脚手架）
│   ├── desktop/                       # 💻 Electron 桌面应用（脚手架）
│   └── mobile/                        # 📱 跨平台移动端（Capacitor 脚手架）
│
├── pnpm-workspace.yaml                # 工作空间配置
├── tsconfig.base.json                 # 共享 TypeScript 配置
└── package.json                       # 根脚本
```

---

## 🏗 技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3** | 渐进式 JavaScript 框架（Composition API） |
| **TypeScript** | 类型安全的 JavaScript 超集 |
| **Vite** | 前端构建工具 |
| **Element Plus** | 基于 Vue 3 的 UI 组件库 |
| **Pinia** | Vue 3 状态管理（带持久化插件） |
| **Vue Router** | 路由管理 |
| **Axios** | HTTP 请求库 |
| **Sass** | CSS 预处理器 |
| **ECharts** | 数据可视化图表（仪表盘） |
| **Tiptap** | Markdown/富文本编辑器 |
| **pnpm** | 包管理器（workspace） |

---

## 🚀 快速开始

### 前置依赖

- **Node.js** >= 18
- **pnpm** >= 8（安装：`npm install -g pnpm`）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 博客前台（默认 http://localhost:5173）
pnpm dev

# 管理后台（默认 http://localhost:5174）
pnpm dev:admin

# 服务器管理（默认 http://localhost:5175）
pnpm dev:server-admin

# 桌面应用（Electron）
pnpm dev:desktop

# 移动端
pnpm dev:mobile
```

### 构建生产版本

```bash
# 构建博客前台
pnpm build

# 构建管理后台
pnpm build:admin

# 构建服务器管理
pnpm build:server-admin

# 构建所有 Web 应用
pnpm build:all
```

---

## 📁 各应用详情

### 🏠 博客前台 (`apps/web/personal`)

面向普通用户的博客前端，支持文章浏览、分类筛选、评论互动、点赞、用户注册登录和个人内容管理（写文章 / 我的文章 / 个人中心）。

**端口**: `5173`

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 文章列表，支持分类筛选和分页 |
| `/article/:id` | 文章详情 | 查看文章内容、评论互动、点赞 |
| `/login` | 登录 | 用户登录 |
| `/register` | 注册 | 新用户注册 |
| `/user/write` | 写文章 | 创建新文章（Tiptap 编辑器） |
| `/user/write/:id` | 编辑文章 | 编辑已有文章 |
| `/user/articles` | 我的文章 | 管理自己的文章 |
| `/user/dashboard` | 个人管理 | 个人数据概览 |
| `/user/profile` | 个人中心 | 修改个人信息 |

### 📊 管理后台 (`apps/web/admin`)

面向管理员的综合管理后台，覆盖内容管理、用户与权限、发布与运维等后端全部模块。

**端口**: `5174`

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | 管理员登录 | 管理员身份认证 |
| `/admin/dashboard` | 仪表盘 | 统计概览 + 趋势图表 + 热门文章 |
| `/admin/article/list` | 文章管理 | 分页/搜索/置顶/发布/删除 |
| `/admin/article/edit/:id` | 编辑文章 | 后台编辑文章 |
| `/admin/category` | 分类管理 | 分类树管理 |
| `/admin/tag` | 标签管理 | 标签增删改 |
| `/admin/comment` | 评论管理 | 审核/删除评论 |
| `/admin/user` | 用户管理 | 增删/启禁/重置密码/分配角色 |
| `/admin/role` | 角色管理 | 角色 CRUD + 菜单权限分配 |
| `/admin/menu` | 菜单管理 | 菜单树管理 |
| `/admin/setting` | 系统设置 | 系统配置 + 友情链接 |
| `/admin/publish` | 发布管理 | 发布站点 + 构建记录 |
| `/admin/column` | 专栏管理 | 专栏 CRUD + 专栏文章管理 |
| `/admin/recycle` | 回收站 | 恢复/永久删除/清空 |
| `/admin/mail` | 邮件系统 | 订阅者 / 模板 / 发送记录 |

### 🖥️ 服务器管理 (`apps/web/server-admin`)

**脚手架就绪，待开发。**

### 💻 桌面应用 (`apps/desktop`)

Electron 脚手架（含 electron-builder 打包脚本），应用代码待开发。

```bash
# 开发模式
pnpm dev:desktop

# 构建安装包
cd apps/desktop
pnpm build:win    # Windows (.exe)
pnpm build:mac    # macOS (.dmg)
pnpm build:linux  # Linux (.AppImage)
```

### 📱 移动端 (`apps/mobile`)

Capacitor 脚手架（Android/iOS 壳已生成），应用代码待开发。

```bash
pnpm --filter @vellastra/mobile android:sync   # 同步 Android 项目
pnpm --filter @vellastra/mobile android:open   # 在 Android Studio 中打开
pnpm --filter @vellastra/mobile android:build  # 构建 Android 应用
```

---

## 📦 共享包说明

| 包名 | 路径 | 说明 |
|------|------|------|
| `@vellastra/shared` | `packages/shared/` | 共享类型定义、常量、日志工具 |
| `@vellastra/api-core` | `packages/api-core/` | Axios 请求客户端、API 模块工厂（auth/user/article/category/comment/tag/setting/role/menu/file/publish/recycle/analytics/column/mail/idempotent） |
| `@vellastra/ui` | `packages/ui/` | 通用 Vue 组件（StarField/TiptapEditor）、紫色星辰主题 SCSS 变量 |

---

## 🔧 代理配置

各 Web 应用的 Vite 开发服务器已将后端网关（`http://localhost:8080`）的请求路径全部代理转发，涵盖：

| 前缀 | 说明 |
|------|------|
| `/api/**` | 用户 / 文件接口 |
| `/auth/**` | 鉴权接口 |
| `/article` `/category` `/comment` `/tag` | 内容模块（无 `/api` 前缀） |
| `/system` `/role` `/menu` `/user` | auth 服务管理接口 |
| `/file` `/publish` `/recycle` `/analytics` `/column` `/mail` `/idempotent` | 二阶段模块 |

### 后端依赖

本项目需要配合 **Vellastra 内容系统后端** 使用，启动前端前请确保后端网关及各微服务正常运行（端口 8080 起）：

| 服务 | 端口 |
|------|------|
| Gateway 网关 | 8080 |
| vellastra-auth（鉴权/RBAC/系统配置） | 8081 |
| vellastra-user | 8082 |
| vellastra-article | 8083 |
| vellastra-category | 8084 |
| vellastra-comment | 8085 |
| vellastra-file | 8086 |
| vellastra-tag | 8087 |
| vellastra-publish | 8088 |
| vellastra-recycle | 8089 |
| vellastra-analytics | 8090 |
| vellastra-column | 8091 |
| vellastra-mail | 8092 |

另需 MySQL / Redis / MinIO（文件存储）。

---

## 🔐 鉴权说明

- **登录后**：服务端返回 JWT Token → 存储在 `localStorage` → 通过 `Authorization: Bearer <token>` 请求头发送
- **用户识别**：网关解析 JWT 后自动注入 `X-User-Id` / `X-Username` / `X-Roles` 请求头，前端无需手动传递
- **鉴权接口**：使用 `authRequest` 实例（`/auth` 前缀）
- **业务接口**：使用 `request` 实例（各模块路径与后端 Controller 对齐，部分无 `/api` 前缀）

---

## 💡 开发规范

- 组件命名：`PascalCase.vue`
- 变量命名：`camelCase`
- 路由命名：`kebab-case`
- API 方法命名：`getXxxApi` / `createXxxApi` / `updateXxxApi` / `deleteXxxApi`
- 样式：使用 Scoped SCSS，变量统一引用 `@vellastra/ui` 中的 `variables.scss`
- 包引用：使用 `workspace:*` 协议引用本地包

---

## 📄 许可证

[MIT](LICENSE)
