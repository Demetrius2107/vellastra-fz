import type { AxiosInstance } from 'axios'

/** V3 互动与通知 API（Like/Follow/Bookmark/Notification） */
export function createInteractionApi(request: AxiosInstance) {
  return {
    /** 点赞/取消点赞 */
    like(targetType: 'article' | 'question' | 'answer', targetId: number) {
      return request.post('/interaction/like', null, { params: { targetType, targetId } })
    },

    /** 关注用户/话题 */
    follow(targetType: 'user' | 'tag', targetId: number) {
      return request.post('/interaction/follow', null, { params: { targetType, targetId } })
    },

    /** 取消关注 */
    unfollow(targetType: 'user' | 'tag', targetId: number) {
      return request.delete('/interaction/follow', { params: { targetType, targetId } })
    },

    /** 收藏/取消收藏文章 */
    bookmark(articleId: number) {
      return request.post('/interaction/bookmark', null, { params: { articleId } })
    },

    /** 通知列表 */
    getNotifications(params: { current?: number; size?: number; unreadOnly?: boolean }) {
      return request.get('/notification', { params })
    },

    /** 标记单条已读 */
    markNotificationRead(id: number) {
      return request.patch(`/notification/${id}/read`)
    },

    /** 全部已读 */
    markAllNotificationsRead() {
      return request.patch('/notification/read-all')
    }
  }
}
