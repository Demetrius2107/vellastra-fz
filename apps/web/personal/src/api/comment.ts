import { createCommentApi as createCommentApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

export type { Comment, CommentQuery } from '@vellastra/shared/types'

const commentApi = createCommentApiFactory(request)

/** 分页查询评论列表 */
export function getCommentListApi(params: import('@vellastra/shared/types').CommentQuery) {
  return commentApi.getList(params)
}

/** 创建评论 */
export function createCommentApi(data: { articleId: number; content: string; parentId?: number }) {
  return commentApi.create(data)
}

/** 回复评论 */
export function replyCommentApi(data: { articleId: number; content: string; parentId: number; replyToId: number }) {
  return commentApi.reply(data)
}

/** 删除评论 */
export function deleteCommentApi(id: number) {
  return commentApi.delete(id)
}

/** 审核评论 */
export function auditCommentApi(id: number, status: number) {
  return commentApi.audit(id, status)
}
