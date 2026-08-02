import type { AxiosInstance } from 'axios'

/** 发布引擎 API（publish 服务） */
export function createPublishApi(request: AxiosInstance) {
  return {
    // ===== 站点 =====
    /** 站点列表 */
    getSites() {
      return request.get('/publish/sites')
    },

    /** 站点详情 */
    getSite(id: number) {
      return request.get(`/publish/sites/${id}`)
    },

    /** 创建站点 */
    createSite(data: { name: string; slug: string; repoUrl: string; buildCommand?: string; outputDir?: string; domain?: string }) {
      return request.post('/publish/sites', data)
    },

    /** 更新站点 */
    updateSite(id: number, data: Record<string, unknown>) {
      return request.put(`/publish/sites/${id}`, data)
    },

    /** 删除站点 */
    deleteSite(id: number) {
      return request.delete(`/publish/sites/${id}`)
    },

    // ===== 构建 =====
    /** 触发构建 */
    triggerBuild(params: { siteId: number; environment?: string }) {
      return request.post('/publish/builds', null, { params })
    },

    /** 构建记录分页 */
    getBuilds(params: { siteId?: number; status?: string; current?: number; size?: number }) {
      return request.get('/publish/builds', { params })
    },

    /** 构建详情 */
    getBuild(id: number) {
      return request.get(`/publish/builds/${id}`)
    },

    /** 构建历史 */
    getBuildHistory(siteId: number) {
      return request.get(`/publish/builds/history/${siteId}`)
    },

    /** 重试构建 */
    retryBuild(id: number) {
      return request.post(`/publish/builds/${id}/retry`)
    },

    /** 回滚到指定版本 */
    rollbackBuild(id: number, targetBuildId?: number) {
      return request.post(`/publish/builds/${id}/rollback`, null, { params: { targetBuildId } })
    }
  }
}
