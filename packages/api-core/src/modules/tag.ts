import type { AxiosInstance } from 'axios'

export function createTagApi(request: AxiosInstance) {
  return {
    /** 获取标签列表 */
    getList() {
      return request.get('/tag')
    },

    /** 热门标签 */
    getHot(limit: number = 10) {
      return request.get('/tag/hot', { params: { limit } })
    },

    /** 标签详情 */
    getDetail(id: number) {
      return request.get(`/tag/${id}`)
    },

    /** 创建标签 */
    create(data: { name: string }) {
      return request.post('/tag', data)
    },

    /** 更新标签 */
    update(id: number, data: { name: string }) {
      return request.put(`/tag/${id}`, data)
    },

    /** 删除标签 */
    delete(id: number) {
      return request.delete(`/tag/${id}`)
    }
  }
}