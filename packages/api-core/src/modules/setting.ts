import type { AxiosInstance } from 'axios'

export function createSettingApi(request: AxiosInstance) {
  return {
    /** 获取全部系统配置 */
    getList() {
      return request.get('/system/config')
    },

    /** 设置配置（按 key） */
    update(key: string, value: string) {
      return request.put(`/system/config/${key}`, value)
    }
  }
}