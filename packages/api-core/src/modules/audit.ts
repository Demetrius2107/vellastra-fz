import type { AxiosInstance } from 'axios'

/** V3 内容审核与风控 API（Audit） */
export function createAuditApi(request: AxiosInstance) {
  return {
    /** 待审核列表 */
    getPending(params: { type?: string; current?: number; size?: number }) {
      return request.get('/audit/pending', { params })
    },

    /** 审核通过 */
    approve(id: number) {
      return request.post('/audit/approve', null, { params: { id } })
    },

    /** 审核拒绝（含原因） */
    reject(id: number, reason?: string) {
      return request.post('/audit/reject', null, { params: { id, reason } })
    },

    /** 用户举报内容 */
    report(data: { targetType: string; targetId: number; reason: string }) {
      return request.post('/audit/report', data)
    },

    /** 举报列表 */
    getReports(params: { current?: number; size?: number; status?: number }) {
      return request.get('/audit/reports', { params })
    }
  }
}
