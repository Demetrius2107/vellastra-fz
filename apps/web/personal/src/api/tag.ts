import { createTagApi as createTagApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

export type { Tag } from '@vellastra/shared/types'

const tagApi = createTagApiFactory(request)

/** 获取标签列表 */
export function getTagListApi() {
  return tagApi.getList()
}

/** 创建标签 */
export function createTagApi(data: { name: string }) {
  return tagApi.create(data)
}

/** 更新标签 */
export function updateTagApi(id: number, data: { name: string }) {
  return tagApi.update(id, data)
}

/** 删除标签 */
export function deleteTagApi(id: number) {
  return tagApi.delete(id)
}
