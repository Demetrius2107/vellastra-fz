<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <el-breadcrumb separator="/" class="purple-breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.meta?.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="navbar-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo.avatar || ''" class="user-avatar">
            {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
          <span class="username">{{ userStore.userInfo.username || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">系统设置</el-dropdown-item>
            <el-dropdown-item command="home">返回首页</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const breadcrumbs = computed(() => route.matched.filter((item) => item.meta?.title))

function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/admin/setting')
  } else if (command === 'home') {
    router.push('/')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' }).then(() => {
      userStore.logout()
      router.push('/login')
    })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .collapse-btn {
    font-size: 20px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    transition: color 0.2s;

    &:hover {
      color: #2dd4bf;
    }
  }
}

.purple-breadcrumb {
  :deep(.el-breadcrumb__inner) {
    color: rgba(255, 255, 255, 0.5);
  }
  :deep(.el-breadcrumb__inner.is-link) {
    color: rgba(255, 255, 255, 0.5);
    &:hover { color: #2dd4bf; }
  }
  :deep(.el-breadcrumb__separator) {
    color: rgba(255, 255, 255, 0.2);
  }
}

.navbar-right {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    padding: 4px 12px;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .user-avatar {
    border: 2px solid rgba(45, 212, 191, 0.3);
    background: linear-gradient(135deg, #0d9488, #2dd4bf);
  }

  .username {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .el-icon {
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>