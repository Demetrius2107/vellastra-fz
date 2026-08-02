import type { AxiosInstance } from 'axios'
import type { UserInfo } from '@vellastra/shared/types'

export function createUserApi(request: AxiosInstance) {
  return {
    /** 获取当前登录用户信息 */
    getInfo() {
      return request.get('/api/user/info')
    },

    /** 更新当前用户信息 */
    updateInfo(data: { nickname?: string; avatar?: string; bio?: string }) {
      return request.put('/api/user/info', data)
    },

    /** 分页用户列表 */
    getList(params: { current?: number; size?: number; keyword?: string; status?: number }) {
      return request.get('/api/user/list', { params })
    },

    /** 新增用户 */
    create(data: { username: string; password: string; email: string; nickname?: string }) {
      return request.post('/api/user', data)
    },

    /** 删除用户（逻辑删除） */
    delete(id: number) {
      return request.delete(`/api/user/${id}`)
    },

    /** 启用/禁用用户 */
    changeStatus(id: number, status: number) {
      return request.patch(`/api/user/${id}/status`, null, { params: { status } })
    },

    /** 管理员重置密码为 123456 */
    resetPassword(id: number) {
      return request.put(`/api/user/${id}/reset-password`)
    },

    /** 自助修改密码 */
    changePassword(data: { oldPassword: string; newPassword: string }) {
      return request.put('/api/user/password', data)
    },

    /** 根据 ID 获取用户信息 */
    getById(id: number) {
      return request.get(`/api/user/${id}`)
    },

    /** 更新用户信息 */
    update(id: number, data: Partial<UserInfo>) {
      return request.put(`/api/user/${id}`, data)
    },

    // ===== V3 社区：用户主页（auth 服务 /user 前缀） =====
    /** 用户主页（文章/回答/收藏） */
    getUserProfile(userId: number) {
      return request.get(`/user/${userId}/profile`)
    },

    /** 粉丝列表 */
    getFollowers(userId: number, params: { current?: number; size?: number } = {}) {
      return request.get(`/user/${userId}/followers`, { params })
    },

    /** 关注列表 */
    getFollowing(userId: number, params: { current?: number; size?: number } = {}) {
      return request.get(`/user/${userId}/following`, { params })
    },

    /** 用户统计（获赞/阅读量/等级） */
    getUserStats(userId: number) {
      return request.get(`/user/${userId}/stats`)
    }
  }
}