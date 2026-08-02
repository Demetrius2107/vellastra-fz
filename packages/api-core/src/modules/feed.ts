import type { AxiosInstance } from 'axios'

/** V3 内容流与排行榜 API（Feed/Rank） */
export function createFeedApi(request: AxiosInstance) {
  return {
    /** 个性化推荐（登录用户） */
    getRecommend(params: { current?: number; size?: number }) {
      return request.get('/feed/recommend', { params })
    },

    /** 最新内容流 */
    getLatest(params: { current?: number; size?: number }) {
      return request.get('/feed/latest', { params })
    },

    /** 关注的人的内容 */
    getFollowing(params: { current?: number; size?: number }) {
      return request.get('/feed/following', { params })
    },

    /** 热门内容 */
    getHot(params: { current?: number; size?: number }) {
      return request.get('/feed/hot', { params })
    },

    /** 热度排行榜（Hacker News 风格） */
    getRank(type: 'daily' | 'weekly' | 'monthly') {
      return request.get(`/rank/${type}`)
    }
  }
}
