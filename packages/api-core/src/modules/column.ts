import type { AxiosInstance } from 'axios'

/** 专栏专题 API（column 服务） */
export function createColumnApi(request: AxiosInstance) {
  return {
    /** 专栏分页 */
    getList(params: { status?: number; featured?: boolean; current?: number; size?: number }) {
      return request.get('/column', { params })
    },

    /** 全部专栏 */
    getAll() {
      return request.get('/column/all')
    },

    /** 专栏详情 */
    getDetail(id: number) {
      return request.get(`/column/${id}`)
    },

    /** 创建专栏 */
    create(data: { name: string; slug: string; description?: string; coverImage?: string; authorId?: number; authorName?: string }) {
      return request.post('/column', data)
    },

    /** 更新专栏 */
    update(id: number, data: Record<string, unknown>) {
      return request.put(`/column/${id}`, data)
    },

    /** 删除专栏 */
    delete(id: number) {
      return request.delete(`/column/${id}`)
    },

    /** 专栏文章列表 */
    getArticles(columnId: number) {
      return request.get(`/column/${columnId}/articles`)
    },

    /** 收录文章 */
    addArticle(columnId: number, data: { articleId: number; articleTitle?: string; note?: string }) {
      return request.post(`/column/${columnId}/articles`, data)
    },

    /** 批量收录 */
    batchAddArticles(columnId: number, data: Array<{ articleId: number; articleTitle?: string; note?: string }>) {
      return request.post(`/column/${columnId}/articles/batch`, data)
    },

    /** 移出专栏 */
    removeArticle(id: number) {
      return request.delete(`/column/articles/${id}`)
    },

    /** 调整文章排序 */
    sortArticle(id: number, sortOrder: number) {
      return request.put(`/column/articles/${id}/sort`, null, { params: { sortOrder } })
    }
  }
}
