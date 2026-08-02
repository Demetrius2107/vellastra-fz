import { createUserApi as createUserApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

export type { UserInfo } from '@vellastra/shared/types'

const userApi = createUserApiFactory(request)

/** 获取当前登录用户信息 */
export function getUserInfoApi() {
  return userApi.getInfo()
}

/** 更新当前用户信息 */
export function updateUserInfoApi(data: { nickname?: string; avatar?: string; bio?: string }) {
  return userApi.updateInfo(data)
}

/** 分页用户列表 */
export function getUserListApi(params: { current?: number; size?: number; keyword?: string; status?: number }) {
  return userApi.getList(params)
}

/** 新增用户 */
export function createUserApi(data: { username: string; password: string; email: string; nickname?: string }) {
  return userApi.create(data)
}

/** 删除用户（逻辑删除） */
export function deleteUserApi(id: number) {
  return userApi.delete(id)
}

/** 启用/禁用用户 */
export function changeStatusApi(id: number, status: number) {
  return userApi.changeStatus(id, status)
}

/** 管理员重置密码 */
export function resetPasswordApi(id: number) {
  return userApi.resetPassword(id)
}

/** 自助修改密码 */
export function changePasswordApi(data: { oldPassword: string; newPassword: string }) {
  return userApi.changePassword(data)
}

/** 根据 ID 获取用户信息 */
export function getUserByIdApi(id: number) {
  return userApi.getById(id)
}

/** 更新用户信息 */
export function updateUserApi(id: number, data: Partial<import('@vellastra/shared/types').UserInfo>) {
  return userApi.update(id, data)
}
