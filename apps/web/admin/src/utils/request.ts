import { createRequest } from '@vellastra/api-core'
import { useUserStore } from '@/store/modules/user'

/** 通用请求实例（复用 api-core，路径已对齐后端网关） */
const request = createRequest(() => {
  const userStore = useUserStore()
  return userStore.token
})

export default request
