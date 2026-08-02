<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Vellastra 自绘线性图标（星垂野风格）
 * 统一 24x24 viewBox、stroke 线条风，替代 element-plus 图标。
 * 用法：<AppIcon name="user" :size="14" />
 */

export type AppIconName =
  | 'user'
  | 'folder'
  | 'view'
  | 'comment'
  | 'clock'
  | 'like'
  | 'search'
  | 'back'
  | 'edit'
  | 'trash'
  | 'publish'
  | 'top'

const ICON_PATHS: Record<AppIconName, string[]> = {
  // 用户（作者）
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  // 文件夹（分类）
  folder: ['M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  // 眼睛（浏览量）
  view: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  // 对话气泡（评论）
  comment: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  // 时钟（时间）
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
  // 心形（点赞）
  like: ['M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12C19 16.4 12 21 12 21z'],
  // 搜索
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35'],
  // 返回箭头
  back: ['M19 12H5', 'M12 19l-7-7 7-7'],
  // 编辑（铅笔）
  edit: ['M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'],
  // 删除（垃圾桶）
  trash: ['M3 6h18', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'],
  // 发布（上升箭头）
  publish: ['M12 19V5', 'M5 12l7-7 7 7'],
  // 置顶（钉）
  top: ['M12 17v-5', 'M6 3h12', 'M12 3v9', 'M18 21H6']
}

const props = withDefaults(defineProps<{ name: AppIconName; size?: number | string }>(), {
  size: 16
})

const paths = computed(() => ICON_PATHS[props.name] || [])
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: -0.15em;
  flex-shrink: 0;
}
</style>
