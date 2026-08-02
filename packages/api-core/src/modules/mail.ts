import type { AxiosInstance } from 'axios'

/** 邮件系统 API（mail 服务） */
export function createMailApi(request: AxiosInstance) {
  return {
    // ===== 订阅管理 =====
    /** 订阅（发送确认邮件，double opt-in） */
    subscribe(email: string, name?: string) {
      return request.post('/mail/subscribers', null, { params: { email, name } })
    },

    /** 确认订阅（邮件链接点击） */
    confirm(token: string) {
      return request.get('/mail/subscribers/confirm', { params: { token } })
    },

    /** 退订（邮件链接点击） */
    unsubscribe(token: string) {
      return request.get('/mail/subscribers/unsubscribe', { params: { token } })
    },

    /** 订阅者分页 */
    getSubscribers(params: { status?: number; current?: number; size?: number }) {
      return request.get('/mail/subscribers', { params })
    },

    /** 已确认订阅者数量 */
    getSubscriberCount() {
      return request.get('/mail/subscribers/count')
    },

    // ===== 模板管理 =====
    /** 模板分页 */
    getTemplates(params: { current?: number; size?: number }) {
      return request.get('/mail/templates', { params })
    },

    /** 模板详情 */
    getTemplate(id: number) {
      return request.get(`/mail/templates/${id}`)
    },

    /** 创建模板 */
    createTemplate(data: { name: string; code: string; subject: string; content: string; createdBy?: string }) {
      return request.post('/mail/templates', data)
    },

    /** 更新模板 */
    updateTemplate(id: number, data: Record<string, unknown>) {
      return request.put(`/mail/templates/${id}`, data)
    },

    /** 删除模板 */
    deleteTemplate(id: number) {
      return request.delete(`/mail/templates/${id}`)
    },

    /** 模板渲染预览 */
    previewTemplate(id: number, variables?: Record<string, unknown>) {
      return request.post(`/mail/templates/${id}/preview`, variables)
    },

    // ===== 发送与追踪 =====
    /** 单封发送 */
    sendSingle(to: string, templateCode: string, variables?: Record<string, unknown>) {
      return request.post('/mail/send/single', variables, { params: { to, templateCode } })
    },

    /** 批量发送 */
    sendBatch(templateCode: string, emails: string[]) {
      return request.post('/mail/send/batch', emails, { params: { templateCode } })
    },

    /** 重试失败邮件 */
    retrySend(id: number) {
      return request.post(`/mail/send/${id}/retry`)
    },

    /** 标记退信 */
    markBounce(id: number, reason?: string) {
      return request.post(`/mail/send/${id}/bounce`, null, { params: { reason } })
    },

    /** 发送记录分页 */
    getSendLogs(params: { status?: string; batchNo?: string; current?: number; size?: number }) {
      return request.get('/mail/send/logs', { params })
    },

    /** 打开追踪（透明像素，由邮件客户端请求） */
    trackOpen(logId: number) {
      return request.get(`/mail/track/open/${logId}`, { responseType: 'blob' })
    },

    /** 点击追踪（302 跳转） */
    trackClick(logId: number, url?: string) {
      return request.get(`/mail/track/click/${logId}`, { params: { url } })
    }
  }
}
