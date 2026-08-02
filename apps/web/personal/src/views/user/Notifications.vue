<template>
  <div class="notifications-page">
    <div class="page-head">
      <h2>通知中心</h2>
      <el-button size="small" @click="markAllRead">全部已读</el-button>
    </div>

    <div class="notify-list" v-loading="loading">
      <div v-for="n in list" :key="n.id" class="notify-item" :class="{ unread: !n.read }" @click="markRead(n)">
        <span class="notify-dot" :class="{ active: !n.read }"></span>
        <span class="notify-type">{{ typeIcon(n.type) }}</span>
        <div class="notify-body">
          <p class="notify-content">{{ n.content }}</p>
          <span class="notify-time">{{ formatDate(n.createdAt) }}</span>
        </div>
      </div>
      <el-empty v-if="list.length === 0 && !loading" description="暂无通知" />
    </div>

    <div class="pagination-wrapper" v-if="total > size">
      <el-pagination
        v-model:current-page="current"
        :page-size="size"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '@/api/interaction'

const list = ref<any[]>([])
const loading = ref(false)
const current = ref(1)
const size = ref(10)
const total = ref(0)

function formatDate(date?: string) {
  return date ? dayjs(date).format('MM-DD HH:mm') : ''
}

function typeIcon(type: string) {
  const map: Record<string, string> = { like: '❤️', comment: '💬', follow: '👤', answer: '✅' }
  return map[type] || '🔔'
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getNotificationsApi({ current: current.value, size: size.value })
    list.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

async function markRead(n: any) {
  if (n.read) return
  await markNotificationReadApi(n.id)
  n.read = true
}

async function markAllRead() {
  await markAllNotificationsReadApi()
  ElMessage.success('已全部标记为已读')
  fetchList()
}

onMounted(fetchList)
</script>

<style lang="scss" scoped>
.notifications-page {
  max-width: 720px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
}

.notify-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 10px;
  border-radius: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(45, 212, 191, 0.1);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(45, 212, 191, 0.3);
  }

  &.unread {
    border-color: rgba(45, 212, 191, 0.35);
    background: rgba(13, 148, 136, 0.08);
  }
}

.notify-dot {
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
  background: transparent;
  flex-shrink: 0;

  &.active {
    background: #2dd4bf;
    box-shadow: 0 0 8px rgba(45, 212, 191, 0.6);
  }
}

.notify-type {
  font-size: 18px;
  flex-shrink: 0;
}

.notify-body {
  flex: 1;
  min-width: 0;
}

.notify-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 4px;
}

.notify-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 18px;

  :deep(.el-pagination) {
    --el-pagination-bg-color: rgba(255, 255, 255, 0.06);
    --el-pagination-text-color: rgba(255, 255, 255, 0.7);
    --el-pagination-button-color: rgba(255, 255, 255, 0.7);
    --el-pagination-hover-color: #2dd4bf;
    --el-pagination-button-disabled-bg-color: transparent;
  }

  :deep(.el-pager li),
  :deep(.btn-prev),
  :deep(.btn-next) {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(45, 212, 191, 0.15);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 3px;

    &:hover {
      color: #fff;
      border-color: rgba(45, 212, 191, 0.4);
    }

    &.is-active {
      background: linear-gradient(135deg, #0d9488, #2dd4bf);
      border-color: transparent;
      color: #fff;
    }
  }
}
</style>
