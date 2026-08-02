<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2 class="page-title">个人中心</h2>

      <div class="avatar-section">
        <el-avatar :size="80" :src="userStore.userInfo.avatar || ''">
          {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() }}
        </el-avatar>
        <div class="avatar-info">
          <div class="nickname">{{ form.nickname || form.username }}</div>
          <div class="role-tag">
            <el-tag size="small" :type="userStore.userInfo.role === 'admin' ? 'danger' : 'primary'">
              {{ userStore.userInfo.role === 'admin' ? '管理员' : '用户' }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名">
          <el-input :model-value="form.username" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" placeholder="输入头像 URL" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate" :loading="saving">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getUserInfoApi, updateUserApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive({
  username: '',
  nickname: '',
  email: '',
  avatar: ''
})

const rules: FormRules = {
  nickname: [{ max: 20, message: '昵称最多 20 个字符', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }]
}

async function loadUserInfo() {
  try {
    const res = await getUserInfoApi()
    const data = res.data
    form.username = data.username || ''
    form.nickname = data.nickname || ''
    form.email = data.email || ''
    form.avatar = data.avatar || ''
    userStore.setUserInfo(data)
  } catch {
    // ignore
  }
}

async function handleUpdate() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    await updateUserApi(userStore.userId!, {
      nickname: form.nickname,
      email: form.email,
      avatar: form.avatar
    })
    ElMessage.success('保存成功')
    await loadUserInfo()
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-info {
  .nickname {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }

  .role-tag {
    margin-top: 4px;
  }
}
</style>
