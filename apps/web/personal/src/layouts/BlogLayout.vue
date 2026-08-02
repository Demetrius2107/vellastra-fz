<template>
  <div class="blog-layout">
    <StarField />

    <!-- 左侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">✦</span>
          <span class="logo-text" v-show="!sidebarCollapsed">Vellastra</span>
        </router-link>
      </div>

      <!-- 用户信息 -->
      <div class="user-profile" v-if="userStore.token">
        <div class="avatar-wrapper">
          <el-avatar :size="sidebarCollapsed ? 40 : 64" :src="userStore.userInfo.avatar || ''" class="user-avatar">
            {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
          <div class="avatar-ring" />
        </div>
        <div class="user-meta" v-show="!sidebarCollapsed">
          <div class="user-name">{{ userStore.userInfo.nickname || userStore.userInfo.username }}</div>
          <div class="user-role">
            <el-tag size="small" :type="userStore.userInfo.role === 'admin' ? 'danger' : 'info'">
              {{ userStore.userInfo.role === 'admin' ? '管理员' : '作者' }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 未登录提示 -->
      <div class="user-profile" v-else>
        <div class="avatar-wrapper">
          <el-avatar :size="sidebarCollapsed ? 40 : 64" icon="UserFilled" class="user-avatar guest" />
        </div>
        <div class="user-meta" v-show="!sidebarCollapsed">
          <div class="user-name">游客</div>
          <router-link to="/login" class="login-link">去登录</router-link>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-icon">🏠</span>
          <span class="nav-label" v-show="!sidebarCollapsed">首页</span>
        </router-link>

        <template v-if="userStore.token">
          <router-link to="/user/articles" class="nav-item" :class="{ active: $route.path.startsWith('/user/articles') }">
            <span class="nav-icon">📝</span>
            <span class="nav-label" v-show="!sidebarCollapsed">我的文章</span>
          </router-link>
          <router-link to="/user/dashboard" class="nav-item" :class="{ active: $route.path === '/user/dashboard' }">
            <span class="nav-icon">📊</span>
            <span class="nav-label" v-show="!sidebarCollapsed">个人管理</span>
          </router-link>
          <router-link to="/user/profile" class="nav-item" :class="{ active: $route.path === '/user/profile' }">
            <span class="nav-icon">👤</span>
            <span class="nav-label" v-show="!sidebarCollapsed">个人中心</span>
          </router-link>
          <a v-if="userStore.userInfo.role === 'admin'" :href="adminUrl" target="_blank" rel="noopener" class="nav-item">
            <span class="nav-icon">⚙️</span>
            <span class="nav-label" v-show="!sidebarCollapsed">后台管理</span>
          </a>
        </template>
      </nav>

      <!-- 底部操作 -->
      <div class="sidebar-footer">
        <template v-if="userStore.token">
          <router-link to="/user/write" class="write-btn">
            <el-button type="primary" :circle="sidebarCollapsed" style="width: 100%; background: linear-gradient(135deg, #0d9488, #2dd4bf); border: none;">
              <span v-if="!sidebarCollapsed">✍️ 写文章</span>
              <span v-else>✍️</span>
            </el-button>
          </router-link>
          <el-button class="logout-btn" :circle="sidebarCollapsed" @click="handleLogout">
            <span v-if="!sidebarCollapsed">退出登录</span>
            <span v-else>🚪</span>
          </el-button>
        </template>
        <template v-else>
          <router-link to="/login" class="write-btn">
            <el-button type="primary" style="width: 100%; background: linear-gradient(135deg, #0d9488, #2dd4bf); border: none;">
              登录
            </el-button>
          </router-link>
          <router-link to="/register" class="write-btn" style="margin-top: 8px;">
            <el-button style="width: 100%;">注册</el-button>
          </router-link>
        </template>

        <!-- 折叠按钮 -->
        <el-button class="collapse-btn" :circle="true" @click="toggleSidebar">
          <el-icon><Fold v-if="!sidebarCollapsed" /><Expand v-else /></el-icon>
        </el-button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="main-area" :class="{ collapsed: sidebarCollapsed }">
      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'
import { StarField } from '@vellastra/ui'

const router = useRouter()
const userStore = useUserStore()
const sidebarCollapsed = ref(false)

// 管理后台为独立应用，通过环境变量配置地址（默认开发端口 5174）
const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function handleLogout() {
  ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' }).then(() => {
    userStore.logout()
    router.push('/')
  })
}
</script>

<style lang="scss" scoped>
.blog-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1220 0%, #0f172a 30%, #134e4a 70%, #0a1628 100%);
  position: relative;
}

// ====== 左侧边栏 ======
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: rgba(30, 27, 75, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(45, 212, 191, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0.3s ease;
  overflow: hidden;

  &.collapsed {
    width: 72px;
  }
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(45, 212, 191, 0.1);

  .logo-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo-icon {
    font-size: 24px;
    color: #fbbf24;
    text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #2dd4bf, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
  }
}

// ====== 用户信息 ======
.user-profile {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid rgba(45, 212, 191, 0.1);
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  border: 2px solid rgba(45, 212, 191, 0.4);
  transition: all 0.3s;
  background: linear-gradient(135deg, #0d9488, #2dd4bf);

  &:hover {
    border-color: #2dd4bf;
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.4);
  }

  &.guest {
    background: rgba(255, 255, 255, 0.1);
  }
}

.user-meta {
  text-align: center;
  width: 100%;

  .user-name {
    font-size: 16px;
    font-weight: 600;
    color: #f3f4f6;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .login-link {
    color: #2dd4bf;
    font-size: 13px;
    &:hover { color: #99f6e4; }
  }
}

// ====== 导航 ======
.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #fff;
    background: rgba(45, 212, 191, 0.12);
  }

  &.active {
    color: #fff;
    background: linear-gradient(135deg, rgba(13, 148, 136, 0.3), rgba(45, 212, 191, 0.15));
    box-shadow: inset 3px 0 0 #2dd4bf;
  }

  .nav-icon {
    font-size: 18px;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    font-weight: 500;
  }
}

// ====== 底部 ======
.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(45, 212, 191, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  .write-btn {
    width: 100%;
    text-decoration: none;
  }

  .logout-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    &:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }
  }

  .collapse-btn {
    margin-top: 4px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    &:hover {
      background: rgba(45, 212, 191, 0.15);
      color: #2dd4bf;
    }
  }
}

// ====== 主内容区 ======
.main-area {
  margin-left: 260px;
  flex: 1;
  position: relative;
  z-index: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  &.collapsed {
    margin-left: 72px;
  }
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  min-height: 100vh;
}
</style>