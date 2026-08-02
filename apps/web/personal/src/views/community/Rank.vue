<template>
  <div class="rank-page">
    <div class="rank-tabs">
      <button class="rank-tab" :class="{ active: period === 'daily' }" @click="switchPeriod('daily')">日榜</button>
      <button class="rank-tab" :class="{ active: period === 'weekly' }" @click="switchPeriod('weekly')">周榜</button>
      <button class="rank-tab" :class="{ active: period === 'monthly' }" @click="switchPeriod('monthly')">月榜</button>
    </div>

    <div class="rank-list" v-loading="loading">
      <div v-for="item in list" :key="item.id" class="rank-item" @click="goDetail(item.id)">
        <div class="rank-no" :class="{ top: item.rank <= 3 }">{{ item.rank }}</div>
        <div class="rank-main">
          <div class="rank-title">{{ item.title }}</div>
          <div class="rank-meta">
            <span class="author">{{ item.authorName }}</span>
            <span class="score">热度 {{ item.score }}</span>
            <span class="stat"><AppIcon name="view" :size="13" /> {{ item.views }}</span>
            <span class="stat"><AppIcon name="like" :size="13" /> {{ item.likeCount }}</span>
          </div>
        </div>
      </div>
      <el-empty v-if="list.length === 0 && !loading" description="暂无排行数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRankApi } from '@/api/feed'
import { AppIcon } from '@vellastra/ui'

const router = useRouter()
const period = ref<'daily' | 'weekly' | 'monthly'>('daily')
const list = ref<any[]>([])
const loading = ref(false)

async function fetchRank() {
  loading.value = true
  try {
    const res: any = await getRankApi(period.value)
    list.value = res.data || []
  } finally {
    loading.value = false
  }
}

function switchPeriod(p: 'daily' | 'weekly' | 'monthly') {
  period.value = p
  fetchRank()
}

function goDetail(id: number) {
  router.push(`/article/${id}`)
}

onMounted(fetchRank)
</script>

<style lang="scss" scoped>
.rank-page {
  max-width: 760px;
  margin: 0 auto;
}

.rank-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.rank-tab {
  padding: 6px 20px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(45, 212, 191, 0.2);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    border-color: rgba(45, 212, 191, 0.45);
    color: #fff;
  }

  &.active {
    background: linear-gradient(135deg, #0d9488, #2dd4bf);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
  }
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(45, 212, 191, 0.03) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(45, 212, 191, 0.35);
    transform: translateY(-2px);
  }
}

.rank-no {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);

  &.top {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    color: #fff;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
  }
}

.rank-main {
  flex: 1;
  min-width: 0;
}

.rank-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  .score {
    color: #fbbf24;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
