import { createRecycleApi as createRecycleApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const recycleApi = createRecycleApiFactory(request)

/** 回收站分页 */
export function getRecycleListApi(params: { type?: string; keyword?: string; dateFrom?: string; dateTo?: string; current?: number; size?: number }) {
  return recycleApi.getList(params)
}

/** 回收站统计 */
export function getRecycleStatsApi() {
  return recycleApi.getStats()
}

/** 回收项详情 */
export function getRecycleDetailApi(id: number) {
  return recycleApi.getDetail(id)
}

/** 恢复单项 */
export function restoreRecycleApi(id: number) {
  return recycleApi.restore(id)
}

/** 批量恢复 */
export function restoreRecycleBatchApi(ids: number[]) {
  return recycleApi.restoreBatch(ids)
}

/** 永久删除单项 */
export function deleteRecycleApi(id: number) {
  return recycleApi.delete(id)
}

/** 批量永久删除 */
export function deleteRecycleBatchApi(ids: number[]) {
  return recycleApi.deleteBatch(ids)
}

/** 清空回收站 */
export function emptyRecycleApi() {
  return recycleApi.empty()
}
