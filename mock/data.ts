/**
 * Vellastra 前端 Mock 数据（内存态）
 * 无后端时可让前端页面一路点通测试效果。
 * 注意：数据字段严格对齐后端实际返回结构。
 */

// ============ 工具 ============
export function paged<T>(list: T[], current = 1, size = 10): { records: T[]; total: number; current: number; size: number } {
  const start = (current - 1) * size
  return { records: list.slice(start, start + size), total: list.length, current, size }
}

let seq = 1000
export function nextId(): number {
  return ++seq
}

// ============ 用户 ============
export const currentUser = {
  id: 1,
  username: 'admin',
  nickname: '星垂野管理员',
  email: 'admin@vellastra.com',
  avatar: '',
  role: 'admin',
  status: 1,
  createdAt: '2026-01-01 10:00:00'
}

export const users: any[] = [
  currentUser,
  { id: 2, username: 'author01', nickname: '夜航星', email: 'author@vellastra.com', avatar: '', role: 'author', status: 1, createdAt: '2026-02-14 09:30:00' },
  { id: 3, username: 'reader01', nickname: '拾光者', email: 'reader1@vellastra.com', avatar: '', role: 'user', status: 1, createdAt: '2026-03-02 15:20:00' },
  { id: 4, username: 'reader02', nickname: '半盏清茶', email: 'reader2@vellastra.com', avatar: '', role: 'user', status: 0, createdAt: '2026-03-18 21:45:00' },
  { id: 5, username: 'editor01', nickname: '云舒', email: 'editor@vellastra.com', avatar: '', role: 'author', status: 1, createdAt: '2026-04-01 08:10:00' }
]

// ============ 分类（树） ============
export const categories: any[] = [
  {
    id: 1, name: '技术笔记', description: '编程与技术实践', parentId: 0, articleCount: 4,
    children: [
      { id: 11, name: '前端', description: 'Vue/React/工程化', parentId: 1, articleCount: 2, children: [] },
      { id: 12, name: '后端', description: 'Java/Go/中间件', parentId: 1, articleCount: 1, children: [] }
    ]
  },
  { id: 2, name: '生活随笔', description: '日常与思考', parentId: 0, articleCount: 2, children: [] },
  { id: 3, name: '读书笔记', description: '阅读记录', parentId: 0, articleCount: 1, children: [] }
]

// ============ 标签 ============
export const tags: any[] = [
  { id: 1, name: 'Vue3', slug: 'vue3', articleCount: 3 },
  { id: 2, name: 'TypeScript', slug: 'typescript', articleCount: 4 },
  { id: 3, name: '架构', slug: 'architecture', articleCount: 2 },
  { id: 4, name: '读书', slug: 'reading', articleCount: 1 },
  { id: 5, name: '生活', slug: 'life', articleCount: 2 }
]

// ============ 文章 ============
export const articles: any[] = [
  {
    id: 1, title: 'Vue3 Composition API 深入理解', summary: '从响应式原理到组合式实践',
    content: '# Vue3 Composition API\n\n深入理解 ref、reactive、computed 与生命周期。',
    coverImage: '', categoryId: 11, categoryName: '前端', tags: [1, 2], status: 'published', isTop: true,
    views: 1234, likeCount: 86, commentCount: 12, authorId: 1, authorName: '星垂野管理员', createdAt: '2026-05-10 10:00:00', updatedAt: '2026-05-12 10:00:00'
  },
  {
    id: 2, title: 'TypeScript 最佳实践指南', summary: '类型体操之外的工程实践',
    content: '# TypeScript 最佳实践\n\n严格模式、类型收窄与项目组织。',
    coverImage: '', categoryId: 11, categoryName: '前端', tags: [2], status: 'published', isTop: false,
    views: 986, likeCount: 54, commentCount: 8, authorId: 2, authorName: '夜航星', createdAt: '2026-05-18 14:30:00', updatedAt: '2026-05-18 14:30:00'
  },
  {
    id: 3, title: 'Vite 构建工具详解', summary: '从 dev server 到生产构建',
    content: '# Vite 构建工具\n\nESM 原生、依赖预构建与 Rollup 打包。',
    coverImage: '', categoryId: 11, categoryName: '前端', tags: [2], status: 'draft', isTop: false,
    views: 756, likeCount: 31, commentCount: 0, authorId: 1, authorName: '星垂野管理员', createdAt: '2026-06-01 09:15:00', updatedAt: '2026-06-01 09:15:00'
  },
  {
    id: 4, title: 'Spring Cloud Gateway 路由实践', summary: '微服务网关的路由与限流',
    content: '# Spring Cloud Gateway\n\n谓词、过滤器与 StripPrefix。',
    coverImage: '', categoryId: 12, categoryName: '后端', tags: [3], status: 'published', isTop: false,
    views: 1203, likeCount: 67, commentCount: 9, authorId: 2, authorName: '夜航星', createdAt: '2026-06-08 11:00:00', updatedAt: '2026-06-09 11:00:00'
  },
  {
    id: 5, title: '夏夜漫谈：关于星空的随笔', summary: '星垂平野阔，月涌大江流',
    content: '# 夏夜漫谈\n\n一些关于星星与夜晚的碎碎念。',
    coverImage: '', categoryId: 2, categoryName: '生活随笔', tags: [5], status: 'published', isTop: false,
    views: 432, likeCount: 20, commentCount: 4, authorId: 5, authorName: '云舒', createdAt: '2026-06-15 20:00:00', updatedAt: '2026-06-15 20:00:00'
  },
  {
    id: 6, title: '《三体》读后感：黑暗森林法则的启示', summary: '科幻之外的人性寓言',
    content: '# 三体读后感\n\n关于宇宙社会学与生存法则。',
    coverImage: '', categoryId: 3, categoryName: '读书笔记', tags: [4], status: 'published', isTop: false,
    views: 1890, likeCount: 142, commentCount: 23, authorId: 2, authorName: '夜航星', createdAt: '2026-06-22 19:30:00', updatedAt: '2026-06-22 19:30:00'
  },
  {
    id: 7, title: '微前端架构演进思考', summary: '从 iframe 到 module federation',
    content: '# 微前端架构\n\n多种方案对比与演进路径。',
    coverImage: '', categoryId: 12, categoryName: '后端', tags: [3, 2], status: 'draft', isTop: false,
    views: 0, likeCount: 0, commentCount: 0, authorId: 1, authorName: '星垂野管理员', createdAt: '2026-07-01 10:00:00', updatedAt: '2026-07-01 10:00:00'
  },
  {
    id: 8, title: '一周复盘：效率工具推荐', summary: '让工作流更顺畅的工具清单',
    content: '# 效率工具\n\n本周使用的高效工具推荐。',
    coverImage: '', categoryId: 2, categoryName: '生活随笔', tags: [5], status: 'published', isTop: false,
    views: 321, likeCount: 18, commentCount: 2, authorId: 5, authorName: '云舒', createdAt: '2026-07-10 08:00:00', updatedAt: '2026-07-10 08:00:00'
  }
]

// ============ 评论 ============
export const comments: any[] = [
  { id: 1, articleId: 1, authorId: 2, authorName: '夜航星', authorAvatar: '', content: '写得很深入，收藏了！', parentId: 0, replyToId: 0, status: 1, createdAt: '2026-05-11 09:00:00' },
  { id: 2, articleId: 1, authorId: 3, authorName: '拾光者', authorAvatar: '', content: 'ref 和 reactive 的取舍讲得很清楚', parentId: 0, replyToId: 0, status: 1, createdAt: '2026-05-11 10:30:00' },
  { id: 3, articleId: 1, authorId: 1, authorName: '星垂野管理员', authorAvatar: '', content: '感谢支持！后续会补充 watch 的源码分析', parentId: 2, replyToId: 2, status: 1, createdAt: '2026-05-11 11:00:00' },
  { id: 4, articleId: 6, authorId: 4, authorName: '半盏清茶', authorAvatar: '', content: '黑暗森林的解读很棒', parentId: 0, replyToId: 0, status: 0, createdAt: '2026-06-23 12:00:00' },
  { id: 5, articleId: 6, authorId: 3, authorName: '拾光者', authorAvatar: '', content: '建议读读《球状闪电》', parentId: 0, replyToId: 0, status: 0, createdAt: '2026-06-24 08:30:00' },
  { id: 6, articleId: 4, authorId: 4, authorName: '半盏清茶', authorAvatar: '', content: '垃圾广告信息，请删除', parentId: 0, replyToId: 0, status: 2, createdAt: '2026-06-10 22:00:00' }
]

// ============ 角色 / 菜单 ============
export const roles: any[] = [
  { id: 1, roleName: '超级管理员', roleCode: 'ADMIN', description: '全部权限', sortOrder: 1, status: 1 },
  { id: 2, roleName: '内容编辑', roleCode: 'EDITOR', description: '文章/评论管理', sortOrder: 2, status: 1 },
  { id: 3, roleName: '普通用户', roleCode: 'USER', description: '基础用户权限', sortOrder: 3, status: 1 }
]

export const menus: any[] = [
  {
    id: 1, menuName: '系统管理', menuType: 1, parentId: 0, path: '/admin', component: '', perms: '', icon: 'Setting', sortOrder: 1,
    children: [
      { id: 2, menuName: '用户管理', menuType: 2, parentId: 1, path: '/admin/user', component: 'user/index', perms: 'user:list', icon: 'User', sortOrder: 1, children: [] },
      { id: 3, menuName: '角色管理', menuType: 2, parentId: 1, path: '/admin/role', component: 'role/index', perms: 'role:list', icon: 'UserFilled', sortOrder: 2, children: [] },
      { id: 4, menuName: '菜单管理', menuType: 2, parentId: 1, path: '/admin/menu', component: 'menu/index', perms: 'menu:list', icon: 'Menu', sortOrder: 3, children: [] }
    ]
  },
  {
    id: 5, menuName: '内容管理', menuType: 1, parentId: 0, path: '/admin', component: '', perms: '', icon: 'Document', sortOrder: 2,
    children: [
      { id: 6, menuName: '文章管理', menuType: 2, parentId: 5, path: '/admin/article', component: 'article/list', perms: 'article:list', icon: 'Tickets', sortOrder: 1, children: [] },
      { id: 7, menuName: '分类管理', menuType: 2, parentId: 5, path: '/admin/category', component: 'category/index', perms: 'category:list', icon: 'FolderOpened', sortOrder: 2, children: [] },
      { id: 8, menuName: '标签管理', menuType: 2, parentId: 5, path: '/admin/tag', component: 'tag/index', perms: 'tag:list', icon: 'PriceTag', sortOrder: 3, children: [] },
      { id: 9, menuName: '评论管理', menuType: 2, parentId: 5, path: '/admin/comment', component: 'comment/index', perms: 'comment:list', icon: 'ChatDotRound', sortOrder: 4, children: [] }
    ]
  }
]

// 角色-菜单关联（roleId -> menuIds）
export const roleMenuMap: Record<number, number[]> = { 1: [1, 2, 3, 4, 5, 6, 7, 8, 9], 2: [5, 6, 7, 9], 3: [] }
// 用户-角色关联（userId -> roleIds）
export const userRoleMap: Record<number, number[]> = { 1: [1], 2: [2], 3: [3], 4: [3], 5: [2] }

// ============ 系统配置 / 友链 ============
export const settings: Record<string, string> = {
  site_name: '星垂野',
  site_description: '星辰如毡毯覆盖原野',
  site_keywords: 'Vellastra,博客,技术'
}

export const friendLinks: any[] = [
  { id: 1, name: '示例友链', url: 'https://example.com', description: '示例网站', sortOrder: 1 },
  { id: 2, name: 'Vue 官方', url: 'https://vuejs.org', description: '渐进式框架', sortOrder: 2 }
]

// ============ 发布引擎 ============
export const publishSites: any[] = [
  { id: 1, name: '博客主站', slug: 'blog', repoUrl: 'https://github.com/demetrius2107/blog-site.git', buildCommand: 'npm run build', outputDir: 'dist', domain: 'blog.example.com' },
  { id: 2, name: '文档站', slug: 'docs', repoUrl: 'https://github.com/demetrius2107/docs-site.git', buildCommand: 'npm run docs:build', outputDir: '.vitepress/dist', domain: 'docs.example.com' }
]

export const builds: any[] = [
  { id: 1, siteId: 1, siteName: '博客主站', environment: 'production', status: 'success', createdAt: '2026-07-20 10:00:00' },
  { id: 2, siteId: 1, siteName: '博客主站', environment: 'production', status: 'failed', createdAt: '2026-07-25 14:00:00' },
  { id: 3, siteId: 2, siteName: '文档站', environment: 'production', status: 'success', createdAt: '2026-07-28 09:00:00' },
  { id: 4, siteId: 2, siteName: '文档站', environment: 'production', status: 'running', createdAt: '2026-08-01 16:00:00' }
]

// ============ 回收站 ============
export const recycles: any[] = [
  { id: 1, type: 'article', title: '被删除的文章：旧版前端方案', deletedBy: 'admin', deletedAt: '2026-07-15 10:00:00' },
  { id: 2, type: 'comment', title: '垃圾评论内容示例', deletedBy: 'admin', deletedAt: '2026-07-16 11:00:00' },
  { id: 3, type: 'category', title: '废弃分类：测试分类', deletedBy: 'admin', deletedAt: '2026-07-18 09:30:00' },
  { id: 4, type: 'tag', title: '废弃标签：旧标签', deletedBy: 'admin', deletedAt: '2026-07-20 15:00:00' }
]

// ============ 专栏 ============
export const columns: any[] = [
  { id: 1, name: '前端工程化', slug: 'frontend-eng', description: '前端工程化实践系列', coverImage: '', authorId: 1, authorName: '星垂野管理员', featured: true, articleCount: 2 },
  { id: 2, name: '夜航星的技术周报', slug: 'weekly', description: '每周技术资讯精选', coverImage: '', authorId: 2, authorName: '夜航星', featured: false, articleCount: 1 }
]

export const columnArticles: any[] = [
  { id: 1, columnId: 1, articleId: 1, articleTitle: 'Vue3 Composition API 深入理解', note: '核心文章', sortOrder: 1 },
  { id: 2, columnId: 1, articleId: 3, articleTitle: 'Vite 构建工具详解', note: '', sortOrder: 2 },
  { id: 3, columnId: 2, articleId: 6, articleTitle: '《三体》读后感', note: '', sortOrder: 1 }
]

// ============ 邮件 ============
export const subscribers: any[] = [
  { id: 1, email: 'reader1@vellastra.com', name: '拾光者', status: 1, createdAt: '2026-06-01 10:00:00' },
  { id: 2, email: 'reader2@vellastra.com', name: '半盏清茶', status: 1, createdAt: '2026-06-05 11:00:00' },
  { id: 3, email: 'reader3@vellastra.com', name: '未确认用户', status: 0, createdAt: '2026-07-01 09:00:00' }
]

export const mailTemplates: any[] = [
  { id: 1, name: '新文章通知', code: 'NEW_ARTICLE', subject: '【星垂野】新文章发布：{{title}}', content: 'Hi {{name}}，新文章《{{title}}》发布了，快来围观吧！', createdBy: 'admin' },
  { id: 2, name: '欢迎邮件', code: 'WELCOME', subject: '欢迎加入星垂野', content: 'Hi {{name}}，欢迎订阅！', createdBy: 'admin' }
]

export const sendLogs: any[] = [
  { id: 1, to: 'reader1@vellastra.com', templateCode: 'NEW_ARTICLE', status: 'success', batchNo: 'B20260720001', createdAt: '2026-07-20 10:05:00' },
  { id: 2, to: 'reader2@vellastra.com', templateCode: 'NEW_ARTICLE', status: 'success', batchNo: 'B20260720001', createdAt: '2026-07-20 10:05:00' },
  { id: 3, to: 'reader3@vellastra.com', templateCode: 'WELCOME', status: 'failed', batchNo: 'B20260721002', createdAt: '2026-07-21 09:00:00' }
]

// ============ 统计（analytics） ============
export function trendData(days: number, base: number): { stat_date: string; value: number }[] {
  const result: { stat_date: string; value: number }[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const statDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({ stat_date: statDate, value: base + Math.floor(Math.abs(Math.sin(i * 1.7)) * base * 2) + (i % 5) })
  }
  return result
}

// ============ V3 社区：问答 ============
export const questions: any[] = [
  { id: 1, title: 'Vue3 中 ref 和 reactive 应该怎么选？', content: '最近在写项目，ref 和 reactive 都能做响应式，实际场景中如何取舍？', authorId: 3, authorName: '拾光者', tags: ['Vue3'], views: 128, likes: 12, answersCount: 2, solved: true, createdAt: '2026-07-20 10:00:00' },
  { id: 2, title: 'pnpm workspace 如何优雅管理共享代码？', content: 'monorepo 下共享包怎么拆、怎么引用最合理？', authorId: 2, authorName: '夜航星', tags: ['工程化'], views: 96, likes: 8, answersCount: 1, solved: false, createdAt: '2026-07-25 14:00:00' },
  { id: 3, title: 'Element Plus 主题定制踩坑记录', content: '想改主题色，有哪些坑需要注意？', authorId: 5, authorName: '云舒', tags: ['ElementPlus'], views: 75, likes: 5, answersCount: 0, solved: false, createdAt: '2026-07-30 09:30:00' }
]

export const answers: any[] = [
  { id: 1, questionId: 1, authorId: 1, authorName: '星垂野管理员', content: '推荐优先用 ref：模板自动解包、类型推断更直观；reactive 适合嵌套对象，但要小心解构丢失响应式。', accepted: true, votes: 15, createdAt: '2026-07-20 11:00:00' },
  { id: 2, questionId: 1, authorId: 2, authorName: '夜航星', content: '补充一点：reactive 对数组和 Map 支持更好，但全团队统一 ref 风格更容易维护。', accepted: false, votes: 6, createdAt: '2026-07-21 09:00:00' },
  { id: 3, questionId: 2, authorId: 1, authorName: '星垂野管理员', content: '用 pnpm workspace + packages/ 共享库，应用通过 workspace:* 引用，像本项目的 api-core/shared/ui 就是范例。', accepted: false, votes: 9, createdAt: '2026-07-26 10:00:00' }
]

// ============ V3 社区：通知 ============
export const notifications: any[] = [
  { id: 1, type: 'like', content: '夜航星 赞了你的文章《Vue3 Composition API 深入理解》', fromUser: '夜航星', read: false, createdAt: '2026-08-02 20:00:00' },
  { id: 2, type: 'comment', content: '拾光者 回复了你的评论', fromUser: '拾光者', read: false, createdAt: '2026-08-02 15:30:00' },
  { id: 3, type: 'follow', content: '云舒 关注了你', fromUser: '云舒', read: false, createdAt: '2026-08-01 10:00:00' },
  { id: 4, type: 'answer', content: '夜航星 回答了你的提问《pnpm workspace 如何优雅管理共享代码？》', fromUser: '夜航星', read: true, createdAt: '2026-07-26 10:05:00' },
  { id: 5, type: 'like', content: '半盏清茶 赞了你的文章《微前端架构演进思考》', fromUser: '半盏清茶', read: true, createdAt: '2026-07-22 09:00:00' }
]

// ============ V3 社区：待审核 / 举报 ============
export const pendingItems: any[] = [
  { id: 101, type: 'article', title: '新文章：浅谈响应式设计的未来', authorName: '新用户A', createdAt: '2026-08-03 08:00:00' },
  { id: 102, type: 'article', title: '推广内容测试', authorName: '新用户B', createdAt: '2026-08-03 09:00:00' }
]

export const reports: any[] = [
  { id: 1, targetType: 'comment', targetId: 6, content: '垃圾广告信息', reporter: '拾光者', status: 0, createdAt: '2026-08-01 18:00:00' }
]

// ============ V3 社区：关注 / 收藏 / 点赞状态 ============
export const followingUsers = new Set<number>([2, 5])
export const bookmarkedArticles = new Set<number>([1, 6])
export const likedSet = new Set<string>(['article:1', 'article:6'])
