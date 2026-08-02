import { createQuestionApi as createQuestionApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const questionApi = createQuestionApiFactory(request)

/** 问题列表 */
export function getQuestionListApi(params: { keyword?: string; solved?: boolean; current?: number; size?: number }) {
  return questionApi.getList(params)
}

/** 问题详情（含回答） */
export function getQuestionDetailApi(id: number) {
  return questionApi.getDetail(id)
}

/** 提问题 */
export function createQuestionApi(data: { title: string; content: string; tags?: string[] }) {
  return questionApi.create(data)
}

/** 编辑问题 */
export function updateQuestionApi(id: number, data: { title: string; content: string; tags?: string[] }) {
  return questionApi.update(id, data)
}

/** 删除问题 */
export function deleteQuestionApi(id: number) {
  return questionApi.delete(id)
}

/** 回答问题 */
export function createAnswerApi(data: { questionId: number; content: string }) {
  return questionApi.createAnswer(data)
}

/** 编辑回答 */
export function updateAnswerApi(id: number, data: { content: string }) {
  return questionApi.updateAnswer(id, data)
}

/** 采纳回答 */
export function acceptAnswerApi(id: number) {
  return questionApi.acceptAnswer(id)
}

/** 投票（赞同/反对） */
export function voteAnswerApi(id: number, up: boolean) {
  return questionApi.voteAnswer(id, up)
}
