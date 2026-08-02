import { createInteractionApi as createInteractionApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const interactionApi = createInteractionApiFactory(request)

/** 点赞/取消点赞 */
export function likeApi(targetType: 'article' | 'question' | 'answer', targetId: number) {
  return interactionApi.like(targetType, targetId)
}

/** 关注用户 */
export function followApi(targetId: number) {
  return interactionApi.follow('user', targetId)
}

/** 取消关注 */
export function unfollowApi(targetId: number) {
  return interactionApi.unfollow('user', targetId)
}

/** 收藏/取消收藏文章 */
export function bookmarkApi(articleId: number) {
  return interactionApi.bookmark(articleId)
}

/** 通知列表 */
export function getNotificationsApi(params: { current?: number; size?: number; unreadOnly?: boolean }) {
  return interactionApi.getNotifications(params)
}

/** 标记单条已读 */
export function markNotificationReadApi(id: number) {
  return interactionApi.markNotificationRead(id)
}

/** 全部已读 */
export function markAllNotificationsReadApi() {
  return interactionApi.markAllNotificationsRead()
}
