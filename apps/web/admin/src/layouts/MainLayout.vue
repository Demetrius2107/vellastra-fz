<template>
  <el-container class="main-layout">
    <!-- 左侧边栏 -->
    <el-aside :width="appStore.sidebarCollapsed ? '72px' : '240px'" class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">✦</span>
          <span class="logo-text" v-show="!appStore.sidebarCollapsed">Vellastra</span>
        </router-link>
      </div>
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header height="60px">
        <Navbar />
      </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  background: linear-gradient(135deg, #0f0a1a 0%, #1a0a2e 50%, #0d1b2a 100%);
}

.admin-sidebar {
  background: linear-gradient(180deg, rgba(30, 27, 75, 0.9), rgba(46, 16, 101, 0.9));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(167, 139, 250, 0.1);
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    padding: 20px 16px;
    border-bottom: 1px solid rgba(167, 139, 250, 0.1);
    flex-shrink: 0;

    .logo-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .logo-icon {
      font-size: 22px;
      color: #fbbf24;
      text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #a78bfa, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
    }
  }
}

.el-header {
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(167, 139, 250, 0.08);
  backdrop-filter: blur(12px);
}

.el-main {
  background: transparent;
  padding: 24px;
  overflow-y: auto;
}
</style>

<style lang="scss">
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

// 覆盖 Element Plus 暗色主题样式
.el-main {
  --el-bg-color: transparent;
}
</style>