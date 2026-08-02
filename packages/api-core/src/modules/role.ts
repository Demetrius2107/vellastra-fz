import type { AxiosInstance } from 'axios'

/** 角色管理 API（auth 服务） */
export function createRoleApi(request: AxiosInstance) {
  return {
    /** 角色列表 */
    getList() {
      return request.get('/role/list')
    },

    /** 角色详情 */
    getDetail(id: number) {
      return request.get(`/role/${id}`)
    },

    /** 创建角色 */
    create(data: { roleName: string; roleCode: string; description?: string; sortOrder?: number }) {
      return request.post('/role', data)
    },

    /** 更新角色 */
    update(id: number, data: Record<string, unknown>) {
      return request.put(`/role/${id}`, data)
    },

    /** 删除角色 */
    delete(id: number) {
      return request.delete(`/role/${id}`)
    },

    /** 分配菜单权限（全量覆盖） */
    assignMenus(id: number, menuIds: number[]) {
      return request.put(`/role/${id}/menus`, menuIds)
    },

    /** 查询角色已分配菜单 ID */
    getMenuIds(id: number) {
      return request.get(`/role/${id}/menu-ids`)
    },

    /** 查询用户角色 ID 列表 */
    getUserRoleIds(userId: number) {
      return request.get(`/user/${userId}/roles`)
    },

    /** 分配用户角色 */
    assignUserRoles(userId: number, roleIds: number[]) {
      return request.put(`/user/${userId}/roles`, roleIds)
    }
  }
}
