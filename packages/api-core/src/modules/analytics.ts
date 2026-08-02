import type { AxiosInstance } from 'axios'

/** 数据统计 API（analytics 服务） */
export function createAnalyticsApi(request: AxiosInstance) {
  return {
    /** 总览（文章/用户/评论/浏览量/分类/标签数） */
    getDashboard() {
      return request.get('/analytics/dashboard')
    },

    /** 单指标趋势 */
    getTrend(params: { metric: string; days?: number }) {
      return request.get('/analytics/trend', { params })
    },

    /** 多指标趋势汇总 */
    getTrendAll(days: number = 30) {
      return request.get('/analytics/trend/all', { params: { days } })
    },

    /** 热门文章 TOP */
    getHotArticles(limit: number = 10) {
      return request.get('/analytics/hot-articles', { params: { limit } })
    },

    /** 分类文章统计 */
    getCategoryStats() {
      return request.get('/analytics/category-stats')
    },

    /** 作者贡献统计 */
    getAuthorStats() {
      return request.get('/analytics/author-stats')
    },

    /** 导出 CSV（type=articles/users） */
    export(type: 'articles' | 'users') {
      return request.get(`/analytics/export/${type}`, { responseType: 'blob' })
    }
  }
}
