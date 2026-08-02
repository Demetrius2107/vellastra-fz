import type { AxiosInstance } from 'axios'
import type { CommentQuery } from '@vellastra/shared/types'

export function createCommentApi(request: AxiosInstance) {
  return {
    /** 分页查询评论列表 */
    getList(params: CommentQuery) {
      return request.get('/comment', { params })
    },

    /** 创建评论 */
    create(data: { articleId: number; content: string; parentId?: number }) {
      return request.post('/comment', data)
    },

    /** 回复评论 */
    reply(data: { articleId: number; content: string; parentId: number; replyToId: number }) {
      return request.post('/comment/reply', data)
    },

    /** 删除评论 */
    delete(id: number) {
      return request.delete(`/comment/${id}`)
    },

    /** 审核评论 */
    audit(id: number, status: number) {
      return request.patch(`/comment/${id}/audit`, null, { params: { status } })
    }
  }
}