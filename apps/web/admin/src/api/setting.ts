import { createSettingApi as createSettingApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const settingApi = createSettingApiFactory(request)

/** 获取全部系统配置 */
export function getSettingListApi() {
  return settingApi.getList()
}

/** 按 key 获取配置 */
export function getSettingByKeyApi(key: string) {
  return settingApi.getByKey(key)
}

/** 设置配置（按 key） */
export function updateSettingApi(key: string, value: string) {
  return settingApi.update(key, value)
}

/** 友情链接列表 */
export function getFriendLinksApi() {
  return settingApi.getFriendLinks()
}

/** 新增友情链接 */
export function createFriendLinkApi(data: { name: string; url: string; description?: string; sortOrder?: number }) {
  return settingApi.createFriendLink(data)
}

/** 更新友情链接 */
export function updateFriendLinkApi(id: number, data: { name: string; url: string; description?: string; sortOrder?: number }) {
  return settingApi.updateFriendLink(id, data)
}

/** 删除友情链接 */
export function deleteFriendLinkApi(id: number) {
  return settingApi.deleteFriendLink(id)
}
