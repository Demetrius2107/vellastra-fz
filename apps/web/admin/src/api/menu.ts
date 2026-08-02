import { createMenuApi as createMenuApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const menuApi = createMenuApiFactory(request)

/** 菜单树 */
export function getMenuTreeApi() {
  return menuApi.getTree()
}

/** 菜单详情 */
export function getMenuDetailApi(id: number) {
  return menuApi.getDetail(id)
}

/** 创建菜单 */
export function createMenuApi(data: {
  menuName: string
  menuType: number
  parentId?: number
  path?: string
  component?: string
  perms?: string
  icon?: string
  sortOrder?: number
}) {
  return menuApi.create(data)
}

/** 更新菜单 */
export function updateMenuApi(id: number, data: Record<string, unknown>) {
  return menuApi.update(id, data)
}

/** 删除菜单 */
export function deleteMenuApi(id: number) {
  return menuApi.delete(id)
}
