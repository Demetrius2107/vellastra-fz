/**
 * Vellastra 前端 Mock 路由处理器
 * 按 method + url 匹配返回 data（响应包装 {code,message,data} 由插件完成）
 */
import {
  paged, nextId, currentUser, users, categories, tags, articles, comments,
  roles, menus, roleMenuMap, userRoleMap, settings, friendLinks,
  publishSites, builds, recycles, columns, columnArticles,
  subscribers, mailTemplates, sendLogs, trendData,
  questions, answers, notifications, pendingItems, reports,
  followingUsers, bookmarkedArticles, likedSet
} from './data'

type MockHandler = (params: any, query: any, body: any) => unknown

interface MockRoute {
  method: string
  pattern: RegExp
  handler: MockHandler
}

export const routes: MockRoute[] = [
  // ================= 鉴权 =================
  { method: 'post', pattern: /^\/auth\/login$/, handler: () => ({ token: 'mock-jwt-token-admin', expireIn: 7200 }) },
  { method: 'post', pattern: /^\/auth\/register$/, handler: () => ({}) },
  { method: 'post', pattern: /^\/auth\/logout$/, handler: () => ({}) },
  { method: 'post', pattern: /^\/auth\/refresh$/, handler: () => ({ token: 'mock-jwt-token-admin', expireIn: 7200 }) },

  // ================= 用户 =================
  { method: 'get', pattern: /^\/api\/user\/info$/, handler: () => currentUser },
  { method: 'put', pattern: /^\/api\/user\/info$/, handler: (_p, _q, body) => { Object.assign(currentUser, body); return currentUser } },
  { method: 'get', pattern: /^\/api\/user\/list$/, handler: (_p, q) => { let list = users; if (q.keyword) list = users.filter((u) => u.username.includes(q.keyword) || u.nickname.includes(q.keyword)); if (q.status !== undefined && q.status !== '') list = list.filter((u) => u.status === Number(q.status)); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'post', pattern: /^\/api\/user$/, handler: (_p, _q, body) => { const u = { id: nextId(), ...body, role: 'user', status: 1, createdAt: '2026-08-03 00:00:00' }; users.push(u); return u.id } },
  { method: 'get', pattern: /^\/api\/user\/(\d+)$/, handler: (p) => users.find((u) => u.id === Number(p[0])) },
  { method: 'put', pattern: /^\/api\/user\/(\d+)$/, handler: (p, _q, body) => { const u = users.find((x) => x.id === Number(p[0])); if (u) Object.assign(u, body); return u } },
  { method: 'delete', pattern: /^\/api\/user\/(\d+)$/, handler: (p) => { const i = users.findIndex((u) => u.id === Number(p[0])); if (i > -1) users.splice(i, 1); return {} } },
  { method: 'patch', pattern: /^\/api\/user\/(\d+)\/status$/, handler: (p, q) => { const u = users.find((x) => x.id === Number(p[0])); if (u) u.status = Number(q.status); return u } },
  { method: 'put', pattern: /^\/api\/user\/(\d+)\/reset-password$/, handler: () => ({}) },
  { method: 'put', pattern: /^\/api\/user\/password$/, handler: () => ({}) },

  // ================= 文章 =================
  { method: 'get', pattern: /^\/article\/dashboard$/, handler: () => ({ totalArticles: articles.length, hotArticles: [...articles].sort((a, b) => b.views - a.views).slice(0, 5) }) },
  { method: 'get', pattern: /^\/article\/latest$/, handler: (_p, q) => [...articles].slice(0, Number(q.size) || 5) },
  { method: 'get', pattern: /^\/article$/, handler: (_p, q) => { let list = articles; if (q.categoryId) list = list.filter((a) => a.categoryId === Number(q.categoryId) || a.categoryId === Number(q.categoryId) % 100); if (q.keyword) list = list.filter((a) => a.title.includes(q.keyword)); if (q.status) list = list.filter((a) => a.status === q.status); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'get', pattern: /^\/article\/(\d+)$/, handler: (p) => articles.find((a) => a.id === Number(p[0])) },
  { method: 'post', pattern: /^\/article$/, handler: (_p, _q, body) => { const a = { id: nextId(), ...body, authorId: currentUser.id, authorName: currentUser.nickname, views: 0, likeCount: 0, commentCount: 0, createdAt: '2026-08-03 00:00:00', updatedAt: '2026-08-03 00:00:00' }; articles.unshift(a); return a.id } },
  { method: 'put', pattern: /^\/article\/(\d+)$/, handler: (p, _q, body) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) Object.assign(a, body, { updatedAt: '2026-08-03 00:00:00' }); return a } },
  { method: 'delete', pattern: /^\/article\/(\d+)$/, handler: (p) => { const i = articles.findIndex((a) => a.id === Number(p[0])); if (i > -1) { const [removed] = articles.splice(i, 1); recycles.unshift({ id: nextId(), type: 'article', title: removed.title, deletedBy: currentUser.username, deletedAt: '2026-08-03 00:00:00' }) } return {} } },
  { method: 'patch', pattern: /^\/article\/(\d+)\/publish$/, handler: (p) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) a.status = 'published'; return a } },
  { method: 'patch', pattern: /^\/article\/(\d+)\/withdraw$/, handler: (p) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) a.status = 'draft'; return a } },
  { method: 'patch', pattern: /^\/article\/(\d+)\/top$/, handler: (p, q) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) a.isTop = q.top === '1' || q.top === true; return a } },
  { method: 'post', pattern: /^\/article\/(\d+)\/view$/, handler: (p) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) a.views += 1; return a } },
  { method: 'post', pattern: /^\/article\/(\d+)\/like$/, handler: (p) => { const a = articles.find((x) => x.id === Number(p[0])); if (a) a.likeCount += 1; return a } },
  { method: 'post', pattern: /^\/article\/batch$/, handler: (_p, _q, body) => { (body?.ids || []).forEach((id: number) => { const a = articles.find((x) => x.id === Number(id)); if (a && body?.action === 'publish') a.status = 'published'; }); return {} } },

  // ================= 分类 =================
  { method: 'get', pattern: /^\/category\/tree$/, handler: () => categories },
  { method: 'get', pattern: /^\/category\/(\d+)$/, handler: (p) => { const flat = categories.flatMap((c: any) => [c, ...(c.children || [])]); return flat.find((c) => c.id === Number(p[0])) } },
  { method: 'post', pattern: /^\/category$/, handler: (_p, _q, body) => { const c = { id: nextId(), ...body, parentId: body.parentId || 0, articleCount: 0, children: [] }; if (body.parentId) { const parent = categories.find((x) => x.id === Number(body.parentId)); parent?.children?.push(c) } else categories.push(c); return c.id } },
  { method: 'put', pattern: /^\/category\/(\d+)$/, handler: (p, _q, body) => { const flat = categories.flatMap((c: any) => [c, ...(c.children || [])]); const c = flat.find((x) => x.id === Number(p[0])); if (c) Object.assign(c, body); return c } },
  { method: 'delete', pattern: /^\/category\/(\d+)$/, handler: (p) => { const i = categories.findIndex((c) => c.id === Number(p[0])); if (i > -1) categories.splice(i, 1); return {} } },

  // ================= 评论 =================
  { method: 'get', pattern: /^\/comment$/, handler: (_p, q) => { let list = comments; if (q.articleId) list = list.filter((c) => c.articleId === Number(q.articleId)); if (q.status !== undefined && q.status !== '') list = list.filter((c) => c.status === Number(q.status)); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'post', pattern: /^\/comment\/reply$/, handler: (_p, _q, body) => { const c = { id: nextId(), ...body, authorId: currentUser.id, authorName: currentUser.nickname, authorAvatar: '', status: 1, createdAt: '2026-08-03 00:00:00' }; comments.unshift(c); return c.id } },
  { method: 'post', pattern: /^\/comment$/, handler: (_p, _q, body) => { const c = { id: nextId(), ...body, authorId: currentUser.id, authorName: currentUser.nickname, authorAvatar: '', parentId: body.parentId || 0, replyToId: body.replyToId || 0, status: 1, createdAt: '2026-08-03 00:00:00' }; comments.unshift(c); return c.id } },
  { method: 'delete', pattern: /^\/comment\/(\d+)$/, handler: (p) => { const i = comments.findIndex((c) => c.id === Number(p[0])); if (i > -1) comments.splice(i, 1); return {} } },
  { method: 'patch', pattern: /^\/comment\/(\d+)\/audit$/, handler: (p, q) => { const c = comments.find((x) => x.id === Number(p[0])); if (c) c.status = Number(q.status); return c } },

  // ================= 标签 =================
  { method: 'get', pattern: /^\/tag\/hot$/, handler: (_p, q) => [...tags].sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0)).slice(0, Number(q.limit) || 10) },
  { method: 'get', pattern: /^\/tag$/, handler: () => tags },
  { method: 'get', pattern: /^\/tag\/(\d+)$/, handler: (p) => tags.find((t) => t.id === Number(p[0])) },
  { method: 'post', pattern: /^\/tag$/, handler: (_p, _q, body) => { const t = { id: nextId(), ...body, articleCount: 0 }; tags.push(t); return t.id } },
  { method: 'put', pattern: /^\/tag\/(\d+)$/, handler: (p, _q, body) => { const t = tags.find((x) => x.id === Number(p[0])); if (t) Object.assign(t, body); return t } },
  { method: 'delete', pattern: /^\/tag\/(\d+)$/, handler: (p) => { const i = tags.findIndex((t) => t.id === Number(p[0])); if (i > -1) tags.splice(i, 1); return {} } },

  // ================= 系统配置 / 友链 =================
  { method: 'get', pattern: /^\/system\/config\/([^/]+)$/, handler: (p) => settings[p[0]] ?? null },
  { method: 'put', pattern: /^\/system\/config\/([^/]+)$/, handler: (p, _q, body) => { settings[p[0]] = String(body ?? ''); return {} } },
  { method: 'get', pattern: /^\/system\/config$/, handler: () => ({ ...settings }) },
  { method: 'get', pattern: /^\/system\/friend-link$/, handler: () => friendLinks },
  { method: 'post', pattern: /^\/system\/friend-link$/, handler: (_p, _q, body) => { const f = { id: nextId(), ...body }; friendLinks.push(f); return f.id } },
  { method: 'put', pattern: /^\/system\/friend-link\/(\d+)$/, handler: (p, _q, body) => { const f = friendLinks.find((x) => x.id === Number(p[0])); if (f) Object.assign(f, body); return f } },
  { method: 'delete', pattern: /^\/system\/friend-link\/(\d+)$/, handler: (p) => { const i = friendLinks.findIndex((f) => f.id === Number(p[0])); if (i > -1) friendLinks.splice(i, 1); return {} } },

  // ================= 角色 =================
  { method: 'get', pattern: /^\/role\/list$/, handler: () => roles },
  { method: 'get', pattern: /^\/role\/(\d+)\/menu-ids$/, handler: (p) => roleMenuMap[Number(p[0])] || [] },
  { method: 'put', pattern: /^\/role\/(\d+)\/menus$/, handler: (p, _q, body) => { roleMenuMap[Number(p[0])] = Array.isArray(body) ? body : []; return {} } },
  { method: 'get', pattern: /^\/role\/(\d+)$/, handler: (p) => roles.find((r) => r.id === Number(p[0])) },
  { method: 'post', pattern: /^\/role$/, handler: (_p, _q, body) => { const r = { id: nextId(), ...body, status: 1 }; roles.push(r); return r.id } },
  { method: 'put', pattern: /^\/role\/(\d+)$/, handler: (p, _q, body) => { const r = roles.find((x) => x.id === Number(p[0])); if (r) Object.assign(r, body); return r } },
  { method: 'delete', pattern: /^\/role\/(\d+)$/, handler: (p) => { const i = roles.findIndex((r) => r.id === Number(p[0])); if (i > -1) roles.splice(i, 1); return {} } },

  // ================= 用户-角色（auth 服务） =================
  { method: 'get', pattern: /^\/user\/(\d+)\/roles$/, handler: (p) => userRoleMap[Number(p[0])] || [] },
  { method: 'put', pattern: /^\/user\/(\d+)\/roles$/, handler: (p, _q, body) => { userRoleMap[Number(p[0])] = Array.isArray(body) ? body : []; return {} } },

  // ================= 菜单 =================
  { method: 'get', pattern: /^\/menu\/tree$/, handler: () => menus },
  { method: 'get', pattern: /^\/menu\/(\d+)$/, handler: (p) => { const flat = menus.flatMap((m: any) => [m, ...(m.children || [])]); return flat.find((m) => m.id === Number(p[0])) } },
  { method: 'post', pattern: /^\/menu$/, handler: (_p, _q, body) => { const m = { id: nextId(), ...body, children: [] }; if (body.parentId) { const parent = menus.find((x) => x.id === Number(body.parentId)); parent?.children?.push(m) } else menus.push(m); return m.id } },
  { method: 'put', pattern: /^\/menu\/(\d+)$/, handler: (p, _q, body) => { const flat = menus.flatMap((m: any) => [m, ...(m.children || [])]); const m = flat.find((x) => x.id === Number(p[0])); if (m) Object.assign(m, body); return m } },
  { method: 'delete', pattern: /^\/menu\/(\d+)$/, handler: (p) => { const i = menus.findIndex((m) => m.id === Number(p[0])); if (i > -1) menus.splice(i, 1); return {} } },

  // ================= 文件 =================
  { method: 'post', pattern: /^\/api\/file\/upload$/, handler: () => ({ url: '/mock-upload/cover.png' }) },
  { method: 'post', pattern: /^\/api\/file\/upload\/init$/, handler: (_p, q) => ({ uploadId: `mock-${Date.now()}`, chunkSize: 1024 * 1024, fileName: q.fileName || '' }) },
  { method: 'post', pattern: /^\/api\/file\/upload\/chunk$/, handler: () => ({}) },
  { method: 'post', pattern: /^\/api\/file\/upload\/complete$/, handler: (_p, q) => ({ url: `/mock-upload/${q.fileName || 'file'}` }) },
  { method: 'post', pattern: /^\/api\/file\/upload\/cancel$/, handler: () => ({}) },

  // ================= 发布引擎 =================
  { method: 'get', pattern: /^\/publish\/sites$/, handler: () => publishSites },
  { method: 'get', pattern: /^\/publish\/sites\/(\d+)$/, handler: (p) => publishSites.find((s) => s.id === Number(p[0])) },
  { method: 'post', pattern: /^\/publish\/sites$/, handler: (_p, _q, body) => { const s = { id: nextId(), ...body }; publishSites.push(s); return s.id } },
  { method: 'put', pattern: /^\/publish\/sites\/(\d+)$/, handler: (p, _q, body) => { const s = publishSites.find((x) => x.id === Number(p[0])); if (s) Object.assign(s, body); return s } },
  { method: 'delete', pattern: /^\/publish\/sites\/(\d+)$/, handler: (p) => { const i = publishSites.findIndex((s) => s.id === Number(p[0])); if (i > -1) publishSites.splice(i, 1); return {} } },
  { method: 'get', pattern: /^\/publish\/builds\/history\/(\d+)$/, handler: (p) => builds.filter((b) => b.siteId === Number(p[0])) },
  { method: 'post', pattern: /^\/publish\/builds\/(\d+)\/retry$/, handler: (p) => { const b = builds.find((x) => x.id === Number(p[0])); if (b) b.status = 'running'; return b } },
  { method: 'post', pattern: /^\/publish\/builds\/(\d+)\/rollback$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/publish\/builds\/(\d+)$/, handler: (p) => builds.find((b) => b.id === Number(p[0])) },
  { method: 'post', pattern: /^\/publish\/builds$/, handler: (_p, q) => { const site = publishSites.find((s) => s.id === Number(q.siteId)); const b = { id: nextId(), siteId: Number(q.siteId), siteName: site?.name || '未知站点', environment: q.environment || 'production', status: 'running', createdAt: '2026-08-03 00:00:00' }; builds.unshift(b); return b.id } },
  { method: 'get', pattern: /^\/publish\/builds$/, handler: (_p, q) => { let list = builds; if (q.siteId) list = list.filter((b) => b.siteId === Number(q.siteId)); if (q.status) list = list.filter((b) => b.status === q.status); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },

  // ================= 回收站 =================
  { method: 'get', pattern: /^\/recycle\/stats$/, handler: () => ({ total: recycles.length, article: recycles.filter((r) => r.type === 'article').length, comment: recycles.filter((r) => r.type === 'comment').length, category: recycles.filter((r) => r.type === 'category').length, tag: recycles.filter((r) => r.type === 'tag').length }) },
  { method: 'get', pattern: /^\/recycle$/, handler: (_p, q) => { let list = recycles; if (q.type) list = list.filter((r) => r.type === q.type); if (q.keyword) list = list.filter((r) => r.title.includes(q.keyword)); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'get', pattern: /^\/recycle\/(\d+)$/, handler: (p) => recycles.find((r) => r.id === Number(p[0])) },
  { method: 'post', pattern: /^\/recycle\/restore\/batch$/, handler: (_p, _q, body) => { (body || []).forEach((id: number) => { const i = recycles.findIndex((r) => r.id === Number(id)); if (i > -1) recycles.splice(i, 1) }); return {} } },
  { method: 'post', pattern: /^\/recycle\/restore\/(\d+)$/, handler: (p) => { const i = recycles.findIndex((r) => r.id === Number(p[0])); if (i > -1) recycles.splice(i, 1); return {} } },
  { method: 'post', pattern: /^\/recycle\/delete\/batch$/, handler: (_p, _q, body) => { (body || []).forEach((id: number) => { const i = recycles.findIndex((r) => r.id === Number(id)); if (i > -1) recycles.splice(i, 1) }); return {} } },
  { method: 'delete', pattern: /^\/recycle\/empty$/, handler: () => { recycles.length = 0; return {} } },
  { method: 'delete', pattern: /^\/recycle\/(\d+)$/, handler: (p) => { const i = recycles.findIndex((r) => r.id === Number(p[0])); if (i > -1) recycles.splice(i, 1); return {} } },

  // ================= 统计 =================
  { method: 'get', pattern: /^\/analytics\/dashboard$/, handler: () => ({
    totalArticles: articles.length, totalUsers: users.length, totalComments: comments.length,
    totalViews: articles.reduce((s, a) => s + a.views, 0), totalLikes: articles.reduce((s, a) => s + (a.likeCount || 0), 0),
    totalCategories: categories.length, totalTags: tags.length, todayArticles: 2, todayViews: 156
  }) },
  { method: 'get', pattern: /^\/analytics\/trend\/all$/, handler: (_p, q) => { const days = Number(q.days) || 30; return { articles: trendData(days, 3), views: trendData(days, 80), users: trendData(days, 2), comments: trendData(days, 5) } } },
  { method: 'get', pattern: /^\/analytics\/trend$/, handler: (_p, q) => ({ metric: q.metric || 'article_publish', start: '2026-07-04', end: '2026-08-03', data: trendData(Number(q.days) || 30, 3) }) },
  { method: 'get', pattern: /^\/analytics\/hot-articles$/, handler: (_p, q) => [...articles].sort((a, b) => b.views - a.views).slice(0, Number(q.limit) || 10).map((a) => ({ id: a.id, title: a.title, views: a.views, likeCount: a.likeCount || 0 })) },
  { method: 'get', pattern: /^\/analytics\/category-stats$/, handler: () => categories.map((c) => ({ id: c.id, name: c.name, article_count: c.articleCount || 0, total_views: (c.articleCount || 0) * 100 })) },
  { method: 'get', pattern: /^\/analytics\/author-stats$/, handler: () => [{ id: 1, name: '星垂野管理员', article_count: 4, total_views: 1990 }, { id: 2, name: '夜航星', article_count: 3, total_views: 4079 }] },
  { method: 'get', pattern: /^\/analytics\/export\/(\w+)$/, handler: () => 'id,title,views\n1,Vue3 Composition API,1234' },

  // ================= 专栏 =================
  { method: 'get', pattern: /^\/column\/all$/, handler: () => columns },
  { method: 'get', pattern: /^\/column$/, handler: (_p, q) => paged(columns, Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/column\/(\d+)\/articles$/, handler: (p) => columnArticles.filter((c) => c.columnId === Number(p[0])) },
  { method: 'post', pattern: /^\/column\/(\d+)\/articles\/batch$/, handler: () => ({}) },
  { method: 'post', pattern: /^\/column\/(\d+)\/articles$/, handler: (p, _q, body) => { const c = { id: nextId(), columnId: Number(p[0]), ...body, sortOrder: 1 }; columnArticles.push(c); return c.id } },
  { method: 'get', pattern: /^\/column\/(\d+)$/, handler: (p) => columns.find((c) => c.id === Number(p[0])) },
  { method: 'post', pattern: /^\/column$/, handler: (_p, _q, body) => { const c = { id: nextId(), ...body, featured: false, articleCount: 0 }; columns.push(c); return c.id } },
  { method: 'put', pattern: /^\/column\/(\d+)$/, handler: (p, _q, body) => { const c = columns.find((x) => x.id === Number(p[0])); if (c) Object.assign(c, body); return c } },
  { method: 'delete', pattern: /^\/column\/(\d+)$/, handler: (p) => { const i = columns.findIndex((c) => c.id === Number(p[0])); if (i > -1) columns.splice(i, 1); return {} } },
  { method: 'put', pattern: /^\/column\/articles\/(\d+)\/sort$/, handler: (p, q) => { const c = columnArticles.find((x) => x.id === Number(p[0])); if (c) c.sortOrder = Number(q.sortOrder); return c } },
  { method: 'delete', pattern: /^\/column\/articles\/(\d+)$/, handler: (p) => { const i = columnArticles.findIndex((c) => c.id === Number(p[0])); if (i > -1) columnArticles.splice(i, 1); return {} } },

  // ================= 邮件 =================
  { method: 'post', pattern: /^\/mail\/subscribers$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/mail\/subscribers\/confirm$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/mail\/subscribers\/unsubscribe$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/mail\/subscribers\/count$/, handler: () => subscribers.filter((s) => s.status === 1).length },
  { method: 'get', pattern: /^\/mail\/subscribers$/, handler: (_p, q) => paged(subscribers, Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/mail\/templates$/, handler: (_p, q) => paged(mailTemplates, Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/mail\/templates\/(\d+)\/preview$/, handler: (p) => { const t = mailTemplates.find((x) => x.id === Number(p[0])); return t ? t.content.replace(/\{\{\w+\}\}/g, '示例值') : '' } },
  { method: 'get', pattern: /^\/mail\/templates\/(\d+)$/, handler: (p) => mailTemplates.find((t) => t.id === Number(p[0])) },
  { method: 'post', pattern: /^\/mail\/templates$/, handler: (_p, _q, body) => { const t = { id: nextId(), ...body, createdBy: 'admin' }; mailTemplates.push(t); return t.id } },
  { method: 'put', pattern: /^\/mail\/templates\/(\d+)$/, handler: (p, _q, body) => { const t = mailTemplates.find((x) => x.id === Number(p[0])); if (t) Object.assign(t, body); return t } },
  { method: 'delete', pattern: /^\/mail\/templates\/(\d+)$/, handler: (p) => { const i = mailTemplates.findIndex((t) => t.id === Number(p[0])); if (i > -1) mailTemplates.splice(i, 1); return {} } },
  { method: 'post', pattern: /^\/mail\/send\/single$/, handler: () => ({}) },
  { method: 'post', pattern: /^\/mail\/send\/batch$/, handler: (_p, _q, body) => { (body || []).forEach((email: string) => sendLogs.unshift({ id: nextId(), to: email, templateCode: _q.templateCode || '', status: 'success', batchNo: `B${Date.now()}`, createdAt: '2026-08-03 00:00:00' })); return {} } },
  { method: 'post', pattern: /^\/mail\/send\/(\d+)\/retry$/, handler: (p) => { const l = sendLogs.find((x) => x.id === Number(p[0])); if (l) l.status = 'success'; return l } },
  { method: 'post', pattern: /^\/mail\/send\/(\d+)\/bounce$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/mail\/send\/logs$/, handler: (_p, q) => paged(sendLogs, Number(q.current) || 1, Number(q.size) || 10) },

  // ================= 幂等 Token =================
  { method: 'get', pattern: /^\/idempotent\/token$/, handler: () => ({ token: `mock-idem-${Date.now()}` }) },

  // ================= V3 社区：内容流与排行 =================
  { method: 'get', pattern: /^\/feed\/latest$/, handler: (_p, q) => paged([...articles].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/feed\/hot$/, handler: (_p, q) => paged([...articles].sort((a, b) => b.views - a.views), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/feed\/recommend$/, handler: (_p, q) => paged([...articles].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/feed\/following$/, handler: (_p, q) => paged(articles.filter((a) => followingUsers.has(a.authorId)), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/rank\/(\w+)$/, handler: (p) => [...articles].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 10).map((a, i) => ({ rank: i + 1, id: a.id, title: a.title, authorName: a.authorName, views: a.views, likeCount: a.likeCount || 0, score: ((a.likeCount || 0) * 10) + a.views, period: p[0] })) },

  // ================= V3 社区：问答 =================
  { method: 'get', pattern: /^\/question$/, handler: (_p, q) => { let list = questions; if (q.keyword) list = list.filter((x) => x.title.includes(q.keyword)); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'get', pattern: /^\/question\/(\d+)$/, handler: (p) => { const q = questions.find((x) => x.id === Number(p[0])); return q ? { ...q, answers: answers.filter((a) => a.questionId === q.id) } : null } },
  { method: 'post', pattern: /^\/question$/, handler: (_p, _q, body) => { const q = { id: nextId(), ...body, authorId: currentUser.id, authorName: currentUser.nickname, views: 0, likes: 0, answersCount: 0, solved: false, createdAt: '2026-08-03 00:00:00' }; questions.unshift(q); return q.id } },
  { method: 'put', pattern: /^\/question\/(\d+)$/, handler: (p, _q, body) => { const q = questions.find((x) => x.id === Number(p[0])); if (q) Object.assign(q, body); return q } },
  { method: 'delete', pattern: /^\/question\/(\d+)$/, handler: (p) => { const i = questions.findIndex((x) => x.id === Number(p[0])); if (i > -1) questions.splice(i, 1); return {} } },
  { method: 'post', pattern: /^\/answer\/(\d+)\/accept$/, handler: (p) => { const a = answers.find((x) => x.id === Number(p[0])); if (a) { a.accepted = true; const q = questions.find((x) => x.id === a.questionId); if (q) q.solved = true } return a } },
  { method: 'post', pattern: /^\/answer\/(\d+)\/vote$/, handler: (p, q) => { const a = answers.find((x) => x.id === Number(p[0])); if (a) a.votes += q.up === 'false' ? -1 : 1; return a } },
  { method: 'put', pattern: /^\/answer\/(\d+)$/, handler: (p, _q, body) => { const a = answers.find((x) => x.id === Number(p[0])); if (a) Object.assign(a, body); return a } },
  { method: 'post', pattern: /^\/answer$/, handler: (_p, _q, body) => { const a = { id: nextId(), ...body, authorId: currentUser.id, authorName: currentUser.nickname, accepted: false, votes: 0, createdAt: '2026-08-03 00:00:00' }; answers.unshift(a); const q = questions.find((x) => x.id === Number(body.questionId)); if (q) q.answersCount = (q.answersCount || 0) + 1; return a.id } },

  // ================= V3 社区：互动与通知 =================
  { method: 'post', pattern: /^\/interaction\/like$/, handler: (_p, q) => { const key = `${q.targetType}:${q.targetId}`; likedSet.has(key) ? likedSet.delete(key) : likedSet.add(key); return { liked: likedSet.has(key) } } },
  { method: 'post', pattern: /^\/interaction\/follow$/, handler: (_p, q) => { followingUsers.add(Number(q.targetId)); return { following: true } } },
  { method: 'delete', pattern: /^\/interaction\/follow$/, handler: (_p, q) => { followingUsers.delete(Number(q.targetId)); return { following: false } } },
  { method: 'post', pattern: /^\/interaction\/bookmark$/, handler: (_p, q) => { const id = Number(q.articleId); bookmarkedArticles.has(id) ? bookmarkedArticles.delete(id) : bookmarkedArticles.add(id); return { bookmarked: bookmarkedArticles.has(id) } } },
  { method: 'get', pattern: /^\/notification$/, handler: (_p, q) => { let list = notifications; if (q.unreadOnly === 'true') list = list.filter((n) => !n.read); return paged(list, Number(q.current) || 1, Number(q.size) || 10) } },
  { method: 'patch', pattern: /^\/notification\/read-all$/, handler: () => { notifications.forEach((n) => { n.read = true }); return {} } },
  { method: 'patch', pattern: /^\/notification\/(\d+)\/read$/, handler: (p) => { const n = notifications.find((x) => x.id === Number(p[0])); if (n) n.read = true; return n } },

  // ================= V3 社区：审核与举报 =================
  { method: 'get', pattern: /^\/audit\/pending$/, handler: (_p, q) => paged(pendingItems, Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'post', pattern: /^\/audit\/approve$/, handler: (_p, q) => { const i = pendingItems.findIndex((x) => x.id === Number(q.id)); if (i > -1) pendingItems.splice(i, 1); return {} } },
  { method: 'post', pattern: /^\/audit\/reject$/, handler: (_p, q) => { const i = pendingItems.findIndex((x) => x.id === Number(q.id)); if (i > -1) pendingItems.splice(i, 1); return {} } },
  { method: 'post', pattern: /^\/audit\/report$/, handler: () => ({}) },
  { method: 'get', pattern: /^\/audit\/reports$/, handler: (_p, q) => paged(reports, Number(q.current) || 1, Number(q.size) || 10) },

  // ================= V3 社区：搜索 =================
  { method: 'get', pattern: /^\/search\/suggestion$/, handler: (_p, q) => ['Vue3', 'TypeScript', 'Vite', '架构'].filter((s) => s.toLowerCase().includes((q.keyword || '').toLowerCase())) },
  { method: 'get', pattern: /^\/search$/, handler: (_p, q) => {
    const kw = (q.keyword || '').toLowerCase()
    const articleHits = articles.filter((a) => a.title.toLowerCase().includes(kw)).map((a) => ({ type: 'article', id: a.id, title: a.title, summary: a.summary, authorName: a.authorName }))
    const questionHits = questions.filter((x) => x.title.toLowerCase().includes(kw)).map((x) => ({ type: 'question', id: x.id, title: x.title, summary: x.content, authorName: x.authorName }))
    const userHits = users.filter((u) => u.username.toLowerCase().includes(kw) || u.nickname.toLowerCase().includes(kw)).map((u) => ({ type: 'user', id: u.id, title: u.nickname, summary: '@' + u.username, authorName: u.nickname }))
    return { records: [...articleHits, ...questionHits, ...userHits], total: articleHits.length + questionHits.length + userHits.length }
  } },

  // ================= V3 社区：用户主页 =================
  { method: 'get', pattern: /^\/user\/(\d+)\/stats$/, handler: (p) => { const uid = Number(p[0]); return { userId: uid, level: 3, exp: 1280, likesReceived: 240, totalViews: 5800, articlesCount: articles.filter((a) => a.authorId === uid).length, answersCount: answers.filter((a) => a.authorId === uid).length, followersCount: 36, followingCount: 12 } } },
  { method: 'get', pattern: /^\/user\/(\d+)\/followers$/, handler: (_p, q) => paged(users.slice(1, 4), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/user\/(\d+)\/following$/, handler: (_p, q) => paged(users.slice(2, 4), Number(q.current) || 1, Number(q.size) || 10) },
  { method: 'get', pattern: /^\/user\/(\d+)\/profile$/, handler: (p) => { const uid = Number(p[0]); const u = users.find((x) => x.id === uid); return { ...u, articleCount: articles.filter((a) => a.authorId === uid).length, followersCount: 36, followingCount: 12, isFollowing: followingUsers.has(uid) } } }
]

/** 匹配 mock 路由，返回 data；未匹配返回 null */
export function matchMock(method: string, url: string, query: any, body: any): unknown | null {
  const m = method.toLowerCase()
  for (const route of routes) {
    if (route.method !== m) continue
    const matched = url.match(route.pattern)
    if (!matched) continue
    const params = matched.slice(1)
    try {
      return route.handler(params, query || {}, body)
    } catch (e) {
      return { __mockError: String(e) }
    }
  }
  return null
}
