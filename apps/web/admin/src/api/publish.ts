import { createPublishApi as createPublishApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const publishApi = createPublishApiFactory(request)

/** 站点列表 */
export function getPublishSitesApi() {
  return publishApi.getSites()
}

/** 站点详情 */
export function getPublishSiteApi(id: number) {
  return publishApi.getSite(id)
}

/** 创建站点 */
export function createPublishSiteApi(data: { name: string; slug: string; repoUrl: string; buildCommand?: string; outputDir?: string; domain?: string }) {
  return publishApi.createSite(data)
}

/** 更新站点 */
export function updatePublishSiteApi(id: number, data: Record<string, unknown>) {
  return publishApi.updateSite(id, data)
}

/** 删除站点 */
export function deletePublishSiteApi(id: number) {
  return publishApi.deleteSite(id)
}

/** 触发构建 */
export function triggerBuildApi(params: { siteId: number; environment?: string }) {
  return publishApi.triggerBuild(params)
}

/** 构建记录分页 */
export function getPublishBuildsApi(params: { siteId?: number; status?: string; current?: number; size?: number }) {
  return publishApi.getBuilds(params)
}

/** 构建详情 */
export function getPublishBuildApi(id: number) {
  return publishApi.getBuild(id)
}

/** 构建历史 */
export function getBuildHistoryApi(siteId: number) {
  return publishApi.getBuildHistory(siteId)
}

/** 重试构建 */
export function retryBuildApi(id: number) {
  return publishApi.retryBuild(id)
}

/** 回滚构建 */
export function rollbackBuildApi(id: number, targetBuildId?: number) {
  return publishApi.rollbackBuild(id, targetBuildId)
}
