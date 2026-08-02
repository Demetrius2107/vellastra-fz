import { createRoleApi as createRoleApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const roleApi = createRoleApiFactory(request)

/** 角色列表 */
export function getRoleListApi() {
  return roleApi.getList()
}

/** 角色详情 */
export function getRoleDetailApi(id: number) {
  return roleApi.getDetail(id)
}

/** 创建角色 */
export function createRoleApi(data: { roleName: string; roleCode: string; description?: string; sortOrder?: number }) {
  return roleApi.create(data)
}

/** 更新角色 */
export function updateRoleApi(id: number, data: Record<string, unknown>) {
  return roleApi.update(id, data)
}

/** 删除角色 */
export function deleteRoleApi(id: number) {
  return roleApi.delete(id)
}

/** 分配菜单权限（全量覆盖） */
export function assignRoleMenusApi(id: number, menuIds: number[]) {
  return roleApi.assignMenus(id, menuIds)
}

/** 查询角色已分配菜单 ID */
export function getRoleMenuIdsApi(id: number) {
  return roleApi.getMenuIds(id)
}

/** 查询用户角色 ID 列表 */
export function getUserRoleIdsApi(userId: number) {
  return roleApi.getUserRoleIds(userId)
}

/** 分配用户角色 */
export function assignUserRolesApi(userId: number, roleIds: number[]) {
  return roleApi.assignUserRoles(userId, roleIds)
}
