<template>
  <div class="user-home-page" v-loading="loading">
    <!-- 用户信息 -->
    <div class="user-card" v-if="profile">
      <div class="user-head">
        <AppAvatar :size="72" :src="profile.avatar" :name="profile.nickname || profile.username" />
        <div class="user-info">
          <div class="user-name">{{ profile.nickname || profile.username }}</div>
          <div class="user-meta">
            <el-tag size="small" type="info">@{{ profile.username }}</el-tag>
            <el-tag size="small" :type="levelTag">Lv.{{ stats.level ?? 3 }}</el-tag>
          </div>
        </div>
        <el-button
          v-if="userStore.token && profile.id !== userStore.userId"
          :type="profile.isFollowing ? 'default' : 'primary'"
          @click="toggleFollow"
        >
          {{ profile.isFollowing ? '已关注' : '关注' }}
        </el-button>
      </div>

      <div class="user-stats" v-if="stats">
        <div class="stat-item">
          <span class="num">{{ stats.articlesCount ?? 0 }}</span>
          <span class="label">文章</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.answersCount ?? 0 }}</span>
          <span class="label">回答</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.followersCount ?? 0 }}</span>
          <span class="label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.followingCount ?? 0 }}</span>
          <span class="label">关注</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.likesReceived ?? 0 }}</span>
          <span class="label">获赞</span>
        </div>
      </div>
    </div>

    <!-- 用户文章 -->
    <div class="user-articles" v-if="articles.length > 0">
      <h3 class="section-title">TA 的文章</h3>
      <div v-for="a in articles" :key="a.id" class="article-item" @click="goArticle(a.id)">
        <div class="article-title">{{ a.title }}</div>
        <div class="article-meta">
          <span><AppIcon name="view" :size="13" /> {{ a.views ?? 0 }}</span>
          <span><AppIcon name="like" :size="13" /> {{ a.likeCount ?? 0 }}</span>
          <span>{{ a.categoryName }}</span>
          <span class="time">{{ formatDate(a.createdAt) }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="profile" class="no-articles">TA 还没有发布文章</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getUserProfileApi, getUserStatsApi } from '@/api/user'
import { getArticleListApi } from '@/api/article'
import { followApi, unfollowApi } from '@/api/interaction'
import { useUserStore } from '@/store/modules/user'
import { AppAvatar, AppIcon } from '@vellastra/ui'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userId = Number(route.params.id)
const loading = ref(false)
const profile = ref<any>({})
const stats = ref<any>({})
const articles = ref<any[]>([])

const levelTag = computed(() => (stats.value.level >= 5 ? 'danger' : stats.value.level >= 3 ? 'warning' : 'info'))

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

async function fetchData() {
  loading.value = true
  try {
    const [profileRes, statsRes, articleRes]: any[] = await Promise.all([
      getUserProfileApi(userId),
      getUserStatsApi(userId),
      getArticleListApi({ current: 1, size: 20, authorId: userId })
    ])
    profile.value = profileRes.data || {}
    stats.value = statsRes.data || {}
    articles.value = articleRes.data?.records || []
  } finally {
    loading.value = false
  }
}

async function toggleFollow() {
  if (profile.value.isFollowing) {
    await unfollowApi(userId)
    profile.value.isFollowing = false
    ElMessage.success('已取消关注')
  } else {
    await followApi(userId)
    profile.value.isFollowing = true
    ElMessage.success('关注成功')
  }
}

function goArticle(id: number) {
  router.push(`/article/${id}`)
}

onMounted(fetchData)
</script>

<style lang="scss" scoped>
.user-home-page {
  max-width: 780px;
  margin: 0 auto;
}

.user-card {
  padding: 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(45, 212, 191, 0.04) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  margin-bottom: 20px;
}

.user-head {
  display: flex;
  align-items: center;
  gap: 18px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.user-meta {
  display: flex;
  gap: 8px;
}

.user-stats {
  display: flex;
  gap: 28px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(45, 212, 191, 0.12);

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .num {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }

    .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 2px;
    }
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 14px;
}

.article-item {
  padding: 14px 18px;
  margin-bottom: 10px;
  border-radius: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(45, 212, 191, 0.12);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(45, 212, 191, 0.35);
    transform: translateY(-2px);
  }
}

.article-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .time {
    margin-left: auto;
  }
}

.no-articles {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
