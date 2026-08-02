import { createColumnApi as createColumnApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const columnApi = createColumnApiFactory(request)

/** 专栏分页 */
export function getColumnListApi(params: { status?: number; featured?: boolean; current?: number; size?: number }) {
  return columnApi.getList(params)
}

/** 全部专栏 */
export function getAllColumnsApi() {
  return columnApi.getAll()
}

/** 专栏详情 */
export function getColumnDetailApi(id: number) {
  return columnApi.getDetail(id)
}

/** 创建专栏 */
export function createColumnApi(data: { name: string; slug: string; description?: string; coverImage?: string; authorId?: number; authorName?: string }) {
  return columnApi.create(data)
}

/** 更新专栏 */
export function updateColumnApi(id: number, data: Record<string, unknown>) {
  return columnApi.update(id, data)
}

/** 删除专栏 */
export function deleteColumnApi(id: number) {
  return columnApi.delete(id)
}

/** 专栏文章列表 */
export function getColumnArticlesApi(columnId: number) {
  return columnApi.getArticles(columnId)
}

/** 收录文章 */
export function addColumnArticleApi(columnId: number, data: { articleId: number; articleTitle?: string; note?: string }) {
  return columnApi.addArticle(columnId, data)
}

/** 批量收录 */
export function batchAddColumnArticlesApi(columnId: number, data: Array<{ articleId: number; articleTitle?: string; note?: string }>) {
  return columnApi.batchAddArticles(columnId, data)
}

/** 移出专栏 */
export function removeColumnArticleApi(id: number) {
  return columnApi.removeArticle(id)
}

/** 调整文章排序 */
export function sortColumnArticleApi(id: number, sortOrder: number) {
  return columnApi.sortArticle(id, sortOrder)
}
