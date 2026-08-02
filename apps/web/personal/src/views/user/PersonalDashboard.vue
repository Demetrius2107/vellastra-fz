<template>
  <div class="personal-dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.articleCount }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalViews }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalLikes }}</div>
          <div class="stat-label">总点赞</div>
        </div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon">💬</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalComments }}</div>
          <div class="stat-label">总评论</div>
        </div>
      </div>
    </div>

    <!-- 时间线 & 最近文章 -->
    <div class="content-grid">
      <!-- 最近文章 -->
      <div class="glass-card recent-articles">
        <div class="section-header">
          <h3>📋 最近文章</h3>
          <router-link to="/user/articles" class="view-all">查看全部 →</router-link>
        </div>
        <div class="article-list" v-loading="loading">
          <div v-if="recentArticles.length === 0" class="empty-state">
            <p>还没有写过文章</p>
            <router-link to="/user/write">
              <el-button type="primary" size="small">写第一篇</el-button>
            </router-link>
          </div>
          <div v-for="article in recentArticles" :key="article.id" class="article-item">
            <div class="article-meta">
              <span class="article-status" :class="article.status">
                {{ article.status === 'published' ? '已发布' : '草稿' }}
              </span>
              <span class="article-date">{{ formatDate(article.createdAt) }}</span>
            </div>
            <div class="article-title">
              <router-link :to="`/user/write/${article.id}`">{{ article.title }}</router-link>
            </div>
            <div class="article-stats">
              <span>👁️ {{ article.views || 0 }}</span>
              <span>❤️ {{ article.likeCount || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动时间线 -->
      <div class="glass-card activity-timeline">
        <div class="section-header">
          <h3>⏱️ 最近动态</h3>
        </div>
        <div class="timeline">
          <div v-if="activities.length === 0" class="empty-state">
            <p>暂无动态</p>
          </div>
          <div v-for="(item, index) in activities" :key="index" class="timeline-item">
            <div class="timeline-dot" :class="item.type" />
            <div class="timeline-content">
              <div class="timeline-text">{{ item.text }}</div>
              <div class="timeline-time">{{ formatTime(item.time) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleListApi } from '@/api/article'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const userStore = useUserStore()
const loading = ref(false)
const recentArticles = ref<any[]>([])
const activities = ref<any[]>([])

const stats = ref({
  articleCount: 0,
  totalViews: 0,
  totalLikes: 0,
  totalComments: 0
})

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

function formatTime(date?: string) {
  return date ? dayjs(date).fromNow() : ''
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getArticleListApi({
      current: 1,
      size: 10,
      authorId: userStore.userId || undefined
    })
    const data = res.data
    const articles = data.records || []
    recentArticles.value = articles.slice(0, 5)

    // 统计
    stats.value.articleCount = data.total || 0
    stats.value.totalViews = articles.reduce((s: number, a: any) => s + (a.views || 0), 0)
    stats.value.totalLikes = articles.reduce((s: number, a: any) => s + (a.likeCount || 0), 0)

    // 从文章生成活动时间线
    const acts: any[] = []
    articles.slice(0, 10).forEach((a: any) => {
      if (a.createdAt) {
        acts.push({
          type: a.status === 'published' ? 'publish' : 'draft',
          text: a.status === 'published'
            ? `发布了文章「${a.title}」`
            : `创建了草稿「${a.title}」`,
          time: a.createdAt
        })
      }
      if (a.updatedAt && a.updatedAt !== a.createdAt) {
        acts.push({
          type: 'update',
          text: `更新了文章「${a.title}」`,
          time: a.updatedAt
        })
      }
    })
    acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    activities.value = acts.slice(0, 10)
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>

<style lang="scss" scoped>
.personal-dashboard {
  max-width: 1000px;
  margin: 0 auto;
}

// ====== 统计卡片 ======
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(167, 139, 250, 0.12);
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(167, 139, 250, 0.25);
    transform: translateY(-2px);
  }

  .stat-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 2px;
    }
  }
}

// ====== 双栏布局 ======
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(167, 139, 250, 0.1);
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: #f3f4f6;
    margin: 0;
  }

  .view-all {
    color: #a78bfa;
    font-size: 13px;
    text-decoration: none;
    &:hover { color: #c4b5fd; }
  }
}

// ====== 文章列表 ======
.article-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.article-item {
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child { border-bottom: none; }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .article-status {
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 4px;
    font-weight: 500;
    &.published {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    &.draft {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }
  }

  .article-date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
  }

  .article-title {
    margin: 4px 0;
    a {
      color: rgba(255, 255, 255, 0.85);
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: #a78bfa; }
    }
  }

  .article-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}

// ====== 时间线 ======
.timeline {
  position: relative;
  padding-left: 20px;

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: linear-gradient(to bottom, rgba(167, 139, 250, 0.4), rgba(167, 139, 250, 0.05));
    border-radius: 1px;
  }
}

.timeline-item {
  position: relative;
  padding: 0 0 20px 20px;

  &:last-child { padding-bottom: 0; }
}

.timeline-dot {
  position: absolute;
  left: -17px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid;

  &.publish {
    background: rgba(16, 185, 129, 0.3);
    border-color: #34d399;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
  }
  &.draft {
    background: rgba(251, 191, 36, 0.3);
    border-color: #fbbf24;
  }
  &.update {
    background: rgba(167, 139, 250, 0.3);
    border-color: #a78bfa;
  }
}

.timeline-content {
  .timeline-text {
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    line-height: 1.4;
  }
  .timeline-time {
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
    margin-top: 2px;
  }
}

// ====== 空状态 ======
.empty-state {
  text-align: center;
  padding: 32px 0;
  p {
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 12px;
  }
}
</style>