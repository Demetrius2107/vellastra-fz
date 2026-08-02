import { createAnalyticsApi as createAnalyticsApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const analyticsApi = createAnalyticsApiFactory(request)

/** 总览 */
export function getAnalyticsDashboardApi() {
  return analyticsApi.getDashboard()
}

/** 单指标趋势 */
export function getAnalyticsTrendApi(params: { metric: string; days?: number }) {
  return analyticsApi.getTrend(params)
}

/** 多指标趋势汇总 */
export function getAnalyticsTrendAllApi(days: number = 30) {
  return analyticsApi.getTrendAll(days)
}

/** 热门文章 TOP */
export function getHotArticlesApi(limit: number = 10) {
  return analyticsApi.getHotArticles(limit)
}

/** 分类文章统计 */
export function getCategoryStatsApi() {
  return analyticsApi.getCategoryStats()
}

/** 作者贡献统计 */
export function getAuthorStatsApi() {
  return analyticsApi.getAuthorStats()
}

/** 导出 CSV */
export function exportAnalyticsApi(type: 'articles' | 'users') {
  return analyticsApi.export(type)
}
