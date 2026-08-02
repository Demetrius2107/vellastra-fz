import { createIdempotentApi as createIdempotentApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const idempotentApi = createIdempotentApiFactory(request)

/** 获取幂等 Token */
export function getIdempotentTokenApi() {
  return idempotentApi.getToken()
}
