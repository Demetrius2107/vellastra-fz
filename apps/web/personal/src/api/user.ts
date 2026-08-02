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

// ===== V3 社区：用户主页（他人视角） =====
/** 用户主页（文章/回答/收藏） */
export function getUserProfileApi(userId: number) {
  return userApi.getUserProfile(userId)
}

/** 粉丝列表 */
export function getUserFollowersApi(userId: number, params: { current?: number; size?: number } = {}) {
  return userApi.getFollowers(userId, params)
}

/** 关注列表 */
export function getUserFollowingApi(userId: number, params: { current?: number; size?: number } = {}) {
  return userApi.getFollowing(userId, params)
}

/** 用户统计（获赞/阅读量/等级） */
export function getUserStatsApi(userId: number) {
  return userApi.getUserStats(userId)
}
