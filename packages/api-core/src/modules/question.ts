import type { AxiosInstance } from 'axios'

/** V3 问答系统 API（Question/Answer） */
export function createQuestionApi(request: AxiosInstance) {
  return {
    /** 问题列表（分页+筛选） */
    getList(params: { keyword?: string; tag?: string; solved?: boolean; current?: number; size?: number }) {
      return request.get('/question', { params })
    },

    /** 问题详情（含回答列表） */
    getDetail(id: number) {
      return request.get(`/question/${id}`)
    },

    /** 提问题 */
    create(data: { title: string; content: string; tags?: string[] }) {
      return request.post('/question', data)
    },

    /** 编辑问题 */
    update(id: number, data: { title: string; content: string; tags?: string[] }) {
      return request.put(`/question/${id}`, data)
    },

    /** 删除问题 */
    delete(id: number) {
      return request.delete(`/question/${id}`)
    },

    /** 回答问题 */
    createAnswer(data: { questionId: number; content: string }) {
      return request.post('/answer', data)
    },

    /** 编辑回答 */
    updateAnswer(id: number, data: { content: string }) {
      return request.put(`/answer/${id}`, data)
    },

    /** 采纳回答 */
    acceptAnswer(id: number) {
      return request.post(`/answer/${id}/accept`)
    },

    /** 投票（赞同/反对） */
    voteAnswer(id: number, up: boolean) {
      return request.post(`/answer/${id}/vote`, null, { params: { up } })
    }
  }
}
