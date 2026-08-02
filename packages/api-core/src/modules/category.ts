import type { AxiosInstance } from 'axios'

export function createCategoryApi(request: AxiosInstance) {
  return {
    /** 获取分类树 */
    getTree() {
      return request.get('/category/tree')
    },

    /** 查看分类详情 */
    getDetail(id: number) {
      return request.get(`/category/${id}`)
    },

    /** 新增分类 */
    create(data: { name: string; description?: string; parentId?: number }) {
      return request.post('/category', data)
    },

    /** 更新分类 */
    update(id: number, data: { name: string; description?: string }) {
      return request.put(`/category/${id}`, data)
    },

    /** 删除分类 */
    delete(id: number) {
      return request.delete(`/category/${id}`)
    }
  }
}