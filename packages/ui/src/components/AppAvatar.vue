<template>
  <div
    class="app-avatar"
    :class="{ 'is-image': !!src }"
    :style="style"
    :title="name"
  >
    <img v-if="src" :src="src" :alt="name" />
    <span v-else>{{ initial }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Vellastra 头像组件
 * 有头像 URL 时显示图片；无头像时显示名字首字母，
 * 背景色由用户名哈希生成（稳定、随机分布在青绿/金橙系，避开蓝紫）。
 */

const props = withDefaults(defineProps<{ name?: string; size?: number; src?: string }>(), {
  name: '',
  size: 36,
  src: ''
})

// 色相板：青绿 / 金色 / 橙 / 绿 / 琥珀（避开蓝紫色相 220-280）
const HUES = [160, 170, 180, 150, 145, 35, 25, 45, 190, 135]

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const initial = computed(() => props.name?.trim()?.charAt(0)?.toUpperCase() || '?')

const style = computed(() => {
  const base = {
    width: props.size + 'px',
    height: props.size + 'px',
    fontSize: Math.max(12, Math.round(props.size * 0.42)) + 'px'
  }
  if (props.src) return base
  const hue = HUES[hashCode(props.name || 'anonymous') % HUES.length]
  return {
    ...base,
    background: `linear-gradient(135deg, hsl(${hue}, 62%, 40%) 0%, hsl(${hue + 22}, 68%, 52%) 100%)`,
    color: '#fff'
  }
})
</script>

<style scoped>
.app-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  font-weight: 600;
  user-select: none;
  overflow: hidden;

  &.is-image {
    background: transparent;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
