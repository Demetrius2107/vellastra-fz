import type { AxiosInstance } from 'axios'

/** 幂等 Token API（通用） */
export function createIdempotentApi(request: AxiosInstance) {
  return {
    /** 获取幂等 Token，写操作前调用后放入请求头 X-Idempotent-Token */
    getToken() {
      return request.get('/idempotent/token')
    }
  }
}
