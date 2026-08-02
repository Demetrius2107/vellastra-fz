import type { AxiosInstance } from 'axios'

/** V3 全局搜索 API（Search） */
export function createSearchApi(request: AxiosInstance) {
  return {
    /** 全局搜索（文章/问题/用户） */
    search(keyword: string, type?: 'article' | 'question' | 'user', params: { current?: number; size?: number } = {}) {
      return request.get('/search', { params: { keyword, type, ...params } })
    },

    /** 搜索建议（前缀匹配） */
    suggest(keyword: string) {
      return request.get('/search/suggestion', { params: { keyword } })
    }
  }
}
