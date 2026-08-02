<template>
  <div class="login-container">
    <div class="login-card glass-card">
      <div class="card-header">
        <div class="logo-icon">✦</div>
        <h2 class="gradient-text">Vellastra 登录</h2>
        <p class="subtitle">星垂平野阔，月涌大江流</p>
      </div>

      <el-form ref="formRef" :model="loginForm" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            class="purple-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
            class="purple-input"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="card-footer">
        <router-link to="/register" class="footer-link">没有账号？立即注册</router-link>
        <router-link to="/" class="footer-link">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { loginApi } from '@/api/auth'
import { getUserInfoApi } from '@/api/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import logger from '@/utils/logger'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  logger.info('AUTH', `登录尝试: ${loginForm.username}`)

  loading.value = true
  try {
    const res = await loginApi(loginForm)
    userStore.setToken(res.data.token || res.data)

    const userRes = await getUserInfoApi()
    userStore.setUserInfo(userRes.data)

    logger.success('AUTH', `登录成功: ${loginForm.username}`, {
      role: userRes.data?.role,
      redirect: route.query.redirect
    })

    ElMessage.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } catch (err) {
    logger.warn('AUTH', `登录失败: ${loginForm.username}`, { error: (err as any)?.message })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0a1a 0%, #1a0a2e 50%, #0d1b2a 100%);
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 420px;
  padding: 48px 40px 36px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(167, 139, 250, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(124, 58, 237, 0.1);
  position: relative;
  z-index: 1;
}

.card-header {
  text-align: center;
  margin-bottom: 36px;

  .logo-icon {
    font-size: 40px;
    color: #fbbf24;
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    margin-bottom: 12px;
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    margin: 0;
    font-style: italic;
  }
}

.purple-input {
  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(167, 139, 250, 0.15);
    box-shadow: none;
    border-radius: 10px;
    padding: 4px 16px;
    transition: all 0.3s;
  }
  :deep(.el-input__inner) {
    color: #fff;
    height: 44px;
    &::placeholder { color: rgba(255, 255, 255, 0.3); }
  }
  :deep(.el-input__prefix-inner) {
    color: rgba(167, 139, 250, 0.5);
  }
  :deep(.el-input__wrapper:hover) {
    border-color: rgba(167, 139, 250, 0.3);
  }
  :deep(.el-input__wrapper.is-focus) {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  border: none;
  border-radius: 10px;
  letter-spacing: 4px;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
    transform: translateY(-1px);
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  .footer-link {
    color: rgba(255, 255, 255, 0.4);
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #a78bfa;
    }
  }
}
</style>