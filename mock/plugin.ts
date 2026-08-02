import type { Plugin } from 'vite'
import { matchMock } from './index'

/**
 * Vellastra Mock 插件（dev-only）
 * 在 dev server 中间件层拦截请求并返回 mock 数据，优先级高于代理。
 * 通过环境变量 VITE_USE_MOCK 控制（默认开启）。
 */
export function mockPlugin(enabled = true): Plugin {
  return {
    name: 'vellastra-mock',
    apply: 'serve',
    configureServer(server) {
      if (!enabled) return

      server.middlewares.use((req: any, res: any, next: any) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const pathname = url.pathname
        const method = (req.method || 'GET').toLowerCase()

        // 只拦截前端业务请求，放行静态资源 / 源码请求
        if (!/^\/(api|auth|article|category|comment|tag|system|role|menu|user|file|publish|recycle|analytics|column|mail|idempotent)(\/|$)/.test(pathname)) {
          return next()
        }

        const query: Record<string, string> = {}
        url.searchParams.forEach((v, k) => { query[k] = v })

        // 收集请求体（POST/PUT/PATCH）
        let rawBody = ''
        req.on('data', (chunk: any) => { rawBody += chunk })
        req.on('end', () => {
          let body: any = null
          if (rawBody) {
            try { body = JSON.parse(rawBody) } catch { body = rawBody }
          }

          const data = matchMock(method, pathname, query, body)
          if (data === null) {
            return next()
          }

          if (data && typeof data === 'object' && '__mockError' in (data as any)) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            return res.end(JSON.stringify({ code: 500, message: 'Mock 处理异常: ' + (data as any).__mockError, data: null }))
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json;charset=utf-8')
          res.end(JSON.stringify({ code: 200, message: 'success', data }))
        })
      })
    }
  }
}
