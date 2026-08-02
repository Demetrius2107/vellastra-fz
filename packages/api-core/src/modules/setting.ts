import type { AxiosInstance } from 'axios'

export function createSettingApi(request: AxiosInstance) {
  return {
    /** 获取全部系统配置 */
    getList() {
      return request.get('/system/config')
    },

    /** 按 key 获取配置 */
    getByKey(key: string) {
      return request.get(`/system/config/${key}`)
    },

    /** 设置配置（按 key） */
    update(key: string, value: string) {
      return request.put(`/system/config/${key}`, value)
    },

    /** 友情链接列表 */
    getFriendLinks() {
      return request.get('/system/friend-link')
    },

    /** 新增友情链接 */
    createFriendLink(data: { name: string; url: string; description?: string; sortOrder?: number }) {
      return request.post('/system/friend-link', data)
    },

    /** 更新友情链接 */
    updateFriendLink(id: number, data: { name: string; url: string; description?: string; sortOrder?: number }) {
      return request.put(`/system/friend-link/${id}`, data)
    },

    /** 删除友情链接 */
    deleteFriendLink(id: number) {
      return request.delete(`/system/friend-link/${id}`)
    }
  }
}