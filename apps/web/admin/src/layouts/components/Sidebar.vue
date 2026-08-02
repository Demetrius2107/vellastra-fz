<template>
  <div class="sidebar">
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        unique-opened
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <el-sub-menu v-if="route.children && route.children.length > 1" :index="route.path">
            <template #title>
              <el-icon><component :is="route.meta?.icon" /></el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children.filter((c: any) => !c.meta?.hidden)"
              :key="child.path"
              :index="route.path + '/' + child.path"
            >
              <el-icon><component :is="child.meta?.icon" /></el-icon>
              <span>{{ child.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else-if="!route.meta?.hidden" :index="route.path">
            <el-icon><component :is="route.meta?.icon" /></el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  return (route.matched[0]?.children || []).filter((r: any) => !r.meta?.hidden)
})
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.el-menu {
  border-right: none;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: rgba(255, 255, 255, 0.65);
  --el-menu-active-color: #a78bfa;
  --el-menu-hover-bg-color: rgba(167, 139, 250, 0.1);
  --el-menu-hover-text-color: #fff;
}

:deep(.el-menu-item) {
  border-radius: 8px;
  margin: 2px 8px;
  padding: 0 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(167, 139, 250, 0.1);
    color: #fff;
  }

  &.is-active {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(167, 139, 250, 0.15));
    color: #a78bfa;
    font-weight: 500;
  }
}

:deep(.el-sub-menu__title) {
  border-radius: 8px;
  margin: 2px 8px;
  color: rgba(255, 255, 255, 0.65);
  transition: all 0.2s;

  &:hover {
    background: rgba(167, 139, 250, 0.1);
    color: #fff;
  }
}

:deep(.el-menu--collapse) {
  .el-menu-item,
  .el-sub-menu__title {
    margin: 2px 6px;
    padding: 0 8px;
    justify-content: center;
  }
}

:deep(.el-icon) {
  color: inherit;
}
</style>