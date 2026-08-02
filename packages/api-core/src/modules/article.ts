import type { AxiosInstance } from 'axios'
import type { Article, ArticleQuery } from '@vellastra/shared/types'

export function createArticleApi(request: AxiosInstance) {
  return {
    /** 分页查询文章列表 */
    getList(params: ArticleQuery) {
      return request.get('/article', { params })
    },

    /** 查看文章详情 */
    getDetail(id: number) {
      return request.get(`/article/${id}`)
    },

    /** 创建文章 */
    create(data: Partial<Article>) {
      return request.post('/article', data)
    },

    /** 更新文章 */
    update(id: number, data: Partial<Article>) {
      return request.put(`/article/${id}`, data)
    },

    /** 删除文章 */
    delete(id: number) {
      return request.delete(`/article/${id}`)
    },

    /** 发布文章（草稿 → 已发布） */
    publish(id: number) {
      return request.patch(`/article/${id}/publish`)
    },

    /** 撤回发布（已发布 → 下架） */
    withdraw(id: number) {
      return request.patch(`/article/${id}/withdraw`)
    },

    /** 设置/取消置顶 */
    setTop(id: number, top: boolean) {
      return request.patch(`/article/${id}/top`, null, { params: { top } })
    },

    /** 浏览计数 */
    view(id: number) {
      return request.post(`/article/${id}/view`)
    },

    /** 点赞/取消点赞 */
    like(id: number) {
      return request.post(`/article/${id}/like`)
    },

    /** 获取最新文章 */
    getLatest(size: number = 5) {
      return request.get('/article/latest', { params: { size } })
    },

    /** 批量操作文章 */
    batch(ids: number[], action: 'delete' | 'publish') {
      return request.post('/article/batch', { ids, action })
    }
  }
}