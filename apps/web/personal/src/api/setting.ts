import { createSettingApi } from '@vellastra/api-core'
import request from '@/utils/request'

const settingApi = createSettingApi(request)

/** 获取全部系统配置 */
export function getSettingListApi() {
  return settingApi.getList()
}

/** 设置配置（按 key） */
export function updateSettingApi(key: string, value: string) {
  return settingApi.update(key, value)
}
