import { createUserApi } from '@vellastra/api-core'
import request from '@/utils/request'

export type { UserInfo } from '@vellastra/shared/types'

const userApi = createUserApi(request)

/** 获取当前登录用户信息 */
export function getUserInfoApi() {
  return userApi.getInfo()
}

/** 根据 ID 获取用户信息 */
export function getUserByIdApi(id: number) {
  return userApi.getById(id)
}

/** 更新用户信息 */
export function updateUserApi(id: number, data: Partial<import('@vellastra/shared/types').UserInfo>) {
  return userApi.update(id, data)
}
