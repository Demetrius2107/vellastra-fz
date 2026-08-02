import { createAuthRequest } from '@vellastra/api-core'
import { useUserStore } from '@/store/modules/user'

/** 鉴权专用请求实例（baseURL=/auth） */
const authRequest = createAuthRequest(() => {
  const userStore = useUserStore()
  return userStore.token
})

export default authRequest
