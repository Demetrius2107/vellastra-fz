import { createMailApi as createMailApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const mailApi = createMailApiFactory(request)

// ===== 订阅管理 =====
/** 订阅 */
export function subscribeMailApi(email: string, name?: string) {
  return mailApi.subscribe(email, name)
}

/** 确认订阅 */
export function confirmMailApi(token: string) {
  return mailApi.confirm(token)
}

/** 退订 */
export function unsubscribeMailApi(token: string) {
  return mailApi.unsubscribe(token)
}

/** 订阅者分页 */
export function getSubscribersApi(params: { status?: number; current?: number; size?: number }) {
  return mailApi.getSubscribers(params)
}

/** 已确认订阅者数量 */
export function getSubscriberCountApi() {
  return mailApi.getSubscriberCount()
}

// ===== 模板管理 =====
/** 模板分页 */
export function getMailTemplatesApi(params: { current?: number; size?: number }) {
  return mailApi.getTemplates(params)
}

/** 模板详情 */
export function getMailTemplateApi(id: number) {
  return mailApi.getTemplate(id)
}

/** 创建模板 */
export function createMailTemplateApi(data: { name: string; code: string; subject: string; content: string; createdBy?: string }) {
  return mailApi.createTemplate(data)
}

/** 更新模板 */
export function updateMailTemplateApi(id: number, data: Record<string, unknown>) {
  return mailApi.updateTemplate(id, data)
}

/** 删除模板 */
export function deleteMailTemplateApi(id: number) {
  return mailApi.deleteTemplate(id)
}

/** 模板渲染预览 */
export function previewMailTemplateApi(id: number, variables?: Record<string, unknown>) {
  return mailApi.previewTemplate(id, variables)
}

// ===== 发送与追踪 =====
/** 单封发送 */
export function sendSingleMailApi(to: string, templateCode: string, variables?: Record<string, unknown>) {
  return mailApi.sendSingle(to, templateCode, variables)
}

/** 批量发送 */
export function sendBatchMailApi(templateCode: string, emails: string[]) {
  return mailApi.sendBatch(templateCode, emails)
}

/** 重试失败邮件 */
export function retrySendMailApi(id: number) {
  return mailApi.retrySend(id)
}

/** 标记退信 */
export function markBounceMailApi(id: number, reason?: string) {
  return mailApi.markBounce(id, reason)
}

/** 发送记录分页 */
export function getSendLogsApi(params: { status?: string; batchNo?: string; current?: number; size?: number }) {
  return mailApi.getSendLogs(params)
}
