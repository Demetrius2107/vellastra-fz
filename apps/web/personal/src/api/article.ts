import { createArticleApi as createArticleApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

export type { Article, ArticleQuery, PageResult } from '@vellastra/shared/types'

const articleApi = createArticleApiFactory(request)

/** 分页查询文章列表 */
export function getArticleListApi(params: import('@vellastra/shared/types').ArticleQuery) {
  return articleApi.getList(params)
}

/** 查看文章详情 */
export function getArticleDetailApi(id: number) {
  return articleApi.getDetail(id)
}

/** 创建文章 */
export function createArticleApi(data: Partial<import('@vellastra/shared/types').Article>) {
  return articleApi.create(data)
}

/** 更新文章 */
export function updateArticleApi(id: number, data: Partial<import('@vellastra/shared/types').Article>) {
  return articleApi.update(id, data)
}

/** 删除文章 */
export function deleteArticleApi(id: number) {
  return articleApi.delete(id)
}

/** 发布文章（草稿 → 已发布） */
export function publishArticleApi(id: number) {
  return articleApi.publish(id)
}

/** 撤回发布（已发布 → 下架） */
export function withdrawArticleApi(id: number) {
  return articleApi.withdraw(id)
}

/** 设置/取消置顶 */
export function topArticleApi(id: number, top: boolean) {
  return articleApi.setTop(id, top)
}

/** 浏览计数 */
export function viewArticleApi(id: number) {
  return articleApi.view(id)
}

/** 点赞/取消点赞 */
export function likeArticleApi(id: number) {
  return articleApi.like(id)
}

/** 获取最新文章 */
export function getLatestArticlesApi(size: number = 5) {
  return articleApi.getLatest(size)
}

/** 批量操作文章 */
export function batchArticleApi(ids: number[], action: 'delete' | 'publish') {
  return articleApi.batch(ids, action)
}
