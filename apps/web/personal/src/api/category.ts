import { createCategoryApi as createCategoryApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

export type { Category } from '@vellastra/shared/types'

const categoryApi = createCategoryApiFactory(request)

/** 获取分类树 */
export function getCategoryTreeApi() {
  return categoryApi.getTree()
}

/** 查看分类详情 */
export function getCategoryDetailApi(id: number) {
  return categoryApi.getDetail(id)
}

/** 新增分类 */
export function createCategoryApi(data: { name: string; description?: string; parentId?: number }) {
  return categoryApi.create(data)
}

/** 更新分类 */
export function updateCategoryApi(id: number, data: { name: string; description?: string }) {
  return categoryApi.update(id, data)
}

/** 删除分类 */
export function deleteCategoryApi(id: number) {
  return categoryApi.delete(id)
}
