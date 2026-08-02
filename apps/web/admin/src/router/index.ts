import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user'
import logger from '@/utils/logger'

NProgress.configure({ showSpinner: false })

const routes = [
  // 根路径 → 管理后台仪表盘（未登录由守卫跳登录页）
  {
    path: '/',
    redirect: '/admin/dashboard'
  },

  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },

  // ============ 后台管理 ============
  {
    path: '/admin',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'article',
        name: 'AdminArticle',
        component: () => import('@/views/article/index.vue'),
        meta: { title: '文章管理', icon: 'Document' },
        redirect: '/admin/article/list',
        children: [
          {
            path: 'list',
            name: 'AdminArticleList',
            component: () => import('@/views/article/list.vue'),
            meta: { title: '文章列表', icon: 'Tickets' }
          },
          {
            path: 'edit/:id?',
            name: 'AdminArticleEdit',
            component: () => import('@/views/article/edit.vue'),
            meta: { title: '编辑文章', icon: 'EditPen', hidden: true }
          }
        ]
      },
      {
        path: 'category',
        name: 'AdminCategory',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类管理', icon: 'Menu' }
      },
      {
        path: 'tag',
        name: 'AdminTag',
        component: () => import('@/views/tag/index.vue'),
        meta: { title: '标签管理', icon: 'PriceTag' }
      },
      {
        path: 'comment',
        name: 'AdminComment',
        component: () => import('@/views/comment/index.vue'),
        meta: { title: '评论管理', icon: 'ChatDotRound' }
      },
      {
        path: 'user',
        name: 'AdminUser',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'setting',
        name: 'AdminSetting',
        component: () => import('@/views/setting/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      },
      {
        path: 'role',
        name: 'AdminRole',
        component: () => import('@/views/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' }
      },
      {
        path: 'menu',
        name: 'AdminMenu',
        component: () => import('@/views/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu' }
      },
      {
        path: 'publish',
        name: 'AdminPublish',
        component: () => import('@/views/publish/index.vue'),
        meta: { title: '发布管理', icon: 'Promotion' }
      },
      {
        path: 'column',
        name: 'AdminColumn',
        component: () => import('@/views/column/index.vue'),
        meta: { title: '专栏管理', icon: 'Notebook' }
      },
      {
        path: 'column/:id',
        name: 'AdminColumnArticles',
        component: () => import('@/views/column/articles.vue'),
        meta: { title: '专栏文章', icon: 'Notebook', hidden: true }
      },
      {
        path: 'recycle',
        name: 'AdminRecycle',
        component: () => import('@/views/recycle/index.vue'),
        meta: { title: '回收站', icon: 'Delete' }
      },
      {
        path: 'mail',
        name: 'AdminMail',
        component: () => import('@/views/mail/index.vue'),
        meta: { title: '邮件系统', icon: 'Message' }
      }
    ]
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const authWhiteList = ['/login']

router.beforeEach((to, _from, next) => {
  NProgress.start()
  document.title = `${to.meta.title || ''} - Vellastra`

  const userStore = useUserStore()

  logger.route(_from.path || '/', to.path, {
    title: to.meta.title,
    requiresAuth: !!to.meta.requiresAuth,
    requiresAdmin: !!to.meta.requiresAdmin,
    hasToken: !!userStore.token,
    role: userStore.userInfo?.role
  })

  // 需要登录但未登录 → 跳转登录
  if (to.meta.requiresAuth && !userStore.token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 需要管理员权限但角色不是 admin → 跳登录页
  if (to.meta.requiresAdmin && userStore.userInfo?.role !== 'admin') {
    return next({ path: '/login' })
  }

  // 已登录访问登录页 → 跳仪表盘
  if (userStore.token && authWhiteList.includes(to.path)) {
    return next({ path: '/admin/dashboard' })
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
