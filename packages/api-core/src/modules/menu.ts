import type { AxiosInstance } from 'axios'

/** 菜单管理 API（auth 服务） */
export function createMenuApi(request: AxiosInstance) {
  return {
    /** 菜单树（目录→菜单→按钮） */
    getTree() {
      return request.get('/menu/tree')
    },

    /** 菜单详情 */
    getDetail(id: number) {
      return request.get(`/menu/${id}`)
    },

    /** 创建菜单 */
    create(data: {
      menuName: string
      menuType: number
      parentId?: number
      path?: string
      component?: string
      perms?: string
      icon?: string
      sortOrder?: number
    }) {
      return request.post('/menu', data)
    },

    /** 更新菜单 */
    update(id: number, data: Record<string, unknown>) {
      return request.put(`/menu/${id}`, data)
    },

    /** 删除菜单（有子菜单不可删） */
    delete(id: number) {
      return request.delete(`/menu/${id}`)
    }
  }
}
