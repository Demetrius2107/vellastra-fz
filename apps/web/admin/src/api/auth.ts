import { createAuthApi } from '@vellastra/api-core'
import request from '@/utils/authRequest'

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  email: string
  nickname?: string
}

const authApi = createAuthApi(request)

/** 登录 */
export function loginApi(data: LoginForm) {
  return authApi.login(data)
}

/** 注册 */
export function registerApi(data: RegisterForm) {
  return authApi.register(data)
}

/** 登出 */
export function logoutApi() {
  return authApi.logout()
}

/** 刷新 Token */
export function refreshTokenApi() {
  return authApi.refreshToken()
}
