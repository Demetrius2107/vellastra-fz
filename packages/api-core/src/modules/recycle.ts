import type { AxiosInstance } from 'axios'

/** 内容回收站 API（recycle 服务） */
export function createRecycleApi(request: AxiosInstance) {
  return {
    /** 回收站分页 */
    getList(params: { type?: string; keyword?: string; dateFrom?: string; dateTo?: string; current?: number; size?: number }) {
      return request.get('/recycle', { params })
    },

    /** 回收站统计（总数/各类型） */
    getStats() {
      return request.get('/recycle/stats')
    },

    /** 回收项详情 */
    getDetail(id: number) {
      return request.get(`/recycle/${id}`)
    },

    /** 恢复单项 */
    restore(id: number) {
      return request.post(`/recycle/restore/${id}`)
    },

    /** 批量恢复 */
    restoreBatch(ids: number[]) {
      return request.post('/recycle/restore/batch', ids)
    },

    /** 永久删除单项 */
    delete(id: number) {
      return request.delete(`/recycle/${id}`)
    },

    /** 批量永久删除 */
    deleteBatch(ids: number[]) {
      return request.post('/recycle/delete/batch', ids)
    },

    /** 清空回收站 */
    empty() {
      return request.delete('/recycle/empty')
    }
  }
}
