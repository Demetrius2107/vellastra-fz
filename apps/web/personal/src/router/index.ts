import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user'
import logger from '@/utils/logger'

NProgress.configure({ showSpinner: false })

const routes = [
  // ============ 内容前台 ============
  {
    path: '/',
    component: () => import('@/layouts/BlogLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/blog/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/blog/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登录', hidden: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/blog/Register.vue'),
        meta: { title: '注册', hidden: true }
      },
      // 用户中心（需登录）
      {
        path: 'user/write',
        name: 'WriteArticle',
        component: () => import('@/views/user/WriteArticle.vue'),
        meta: { title: '写文章', requiresAuth: true }
      },
      {
        path: 'user/write/:id',
        name: 'EditArticle',
        component: () => import('@/views/user/WriteArticle.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      },
      {
        path: 'user/articles',
        name: 'MyArticles',
        component: () => import('@/views/user/MyArticles.vue'),
        meta: { title: '我的文章', requiresAuth: true }
      },
      {
        path: 'user/dashboard',
        name: 'PersonalDashboard',
        component: () => import('@/views/user/PersonalDashboard.vue'),
        meta: { title: '个人管理', requiresAuth: true }
      },
      {
        path: 'user/profile',
        name: 'Profile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人中心', requiresAuth: true }
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

const authWhiteList = ['/login', '/register']

router.beforeEach((to, _from, next) => {
  NProgress.start()
  document.title = `${to.meta.title || ''} - Vellastra`

  const userStore = useUserStore()

  // █████████████████████████████████████████████████████████████████
  // 🎯 埋点: 路由导航追踪
  // █████████████████████████████████████████████████████████████████
  logger.route(_from.path || '/', to.path, {
    title: to.meta.title,
    requiresAuth: !!to.meta.requiresAuth,
    hasToken: !!userStore.token,
    role: userStore.userInfo?.role
  })

  // 需要登录但未登录 → 跳转登录
  if (to.meta.requiresAuth && !userStore.token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 已登录访问登录/注册页 → 跳首页
  if (userStore.token && authWhiteList.includes(to.path)) {
    return next({ path: '/' })
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
