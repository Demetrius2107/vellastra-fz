import { defineStore } from 'pinia'
import { ref } from 'vue'
import logger from '@/utils/logger'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const userInfo = ref<any>({})
    const userId = ref<number | null>(null)

    function setToken(val: string) {
      // █████████████████████████████████████████████████████████████████
      // 🎯 埋点: Token 变更
      //    监听登录/刷新 Token 的时机
      // █████████████████████████████████████████████████████████████████
      logger.store('user', 'setToken', { hasToken: !!val, preview: val.substring(0, 20) + '...' })
      token.value = val
    }

    function setUserInfo(info: any) {
      // █████████████████████████████████████████████████████████████████
      // 🎯 埋点: 用户信息更新
      //    记录当前登录用户的身份信息（不含敏感字段）
      // █████████████████████████████████████████████████████████████████
      logger.store('user', 'setUserInfo', {
        id: info?.id,
        username: info?.username,
        nickname: info?.nickname,
        role: info?.role
      })
      userInfo.value = info
      if (info && info.id) {
        userId.value = info.id
      }
    }

    function logout() {
      // █████████████████████████████████████████████████████████████████
      // 🎯 埋点: 用户登出
      //    记录退出登录事件，排查非正常登出
      // █████████████████████████████████████████████████████████████████
      logger.store('user', 'logout', { previousUserId: userId.value })
      token.value = ''
      userInfo.value = {}
      userId.value = null
    }

    return { token, userInfo, userId, setToken, setUserInfo, logout }
  },
  {
    persist: {
      key: 'vellastra-user-store',
      storage: localStorage,
      paths: ['token', 'userInfo', 'userId']
    }
  }
)
