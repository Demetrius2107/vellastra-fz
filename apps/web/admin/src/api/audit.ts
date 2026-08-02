import { createAuditApi as createAuditApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const auditApi = createAuditApiFactory(request)

/** 待审核列表 */
export function getAuditPendingApi(params: { type?: string; current?: number; size?: number }) {
  return auditApi.getPending(params)
}

/** 审核通过 */
export function approveAuditApi(id: number) {
  return auditApi.approve(id)
}

/** 审核拒绝（含原因） */
export function rejectAuditApi(id: number, reason?: string) {
  return auditApi.reject(id, reason)
}

/** 举报列表 */
export function getAuditReportsApi(params: { current?: number; size?: number; status?: number }) {
  return auditApi.getReports(params)
}
