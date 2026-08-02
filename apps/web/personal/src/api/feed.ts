import { createFeedApi as createFeedApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const feedApi = createFeedApiFactory(request)

/** 个性化推荐 */
export function getFeedRecommendApi(params: { current?: number; size?: number }) {
  return feedApi.getRecommend(params)
}

/** 最新内容流 */
export function getFeedLatestApi(params: { current?: number; size?: number }) {
  return feedApi.getLatest(params)
}

/** 关注的人的内容 */
export function getFeedFollowingApi(params: { current?: number; size?: number }) {
  return feedApi.getFollowing(params)
}

/** 热门内容 */
export function getFeedHotApi(params: { current?: number; size?: number }) {
  return feedApi.getHot(params)
}

/** 热度排行榜 */
export function getRankApi(type: 'daily' | 'weekly' | 'monthly') {
  return feedApi.getRank(type)
}
