import { createSearchApi as createSearchApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const searchClient = createSearchApiFactory(request)

/** 全局搜索（文章/问题/用户） */
export function searchApi(keyword: string, type?: 'article' | 'question' | 'user', params: { current?: number; size?: number } = {}) {
  return searchClient.search(keyword, type, params)
}

/** 搜索建议 */
export function getSearchSuggestApi(keyword: string) {
  return searchClient.suggest(keyword)
}
