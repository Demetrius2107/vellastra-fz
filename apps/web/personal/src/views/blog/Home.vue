<template>
  <div class="home-page">
    <!-- 分类筛选 -->
    <div class="filter-bar">
      <el-tag
        :type="!currentCategoryId ? 'primary' : 'info'"
        :effect="!currentCategoryId ? 'dark' : 'plain'"
        @click="filterByCategory()"
      >
        全部
      </el-tag>
      <el-tag
        v-for="cat in categories"
        :key="cat.id"
        :type="currentCategoryId === cat.id ? 'primary' : 'info'"
        :effect="currentCategoryId === cat.id ? 'dark' : 'plain'"
        @click="filterByCategory(cat.id)"
      >
        {{ cat.name }}
      </el-tag>
    </div>

    <!-- 文章列表 -->
    <div class="article-list" v-loading="loading">
      <div v-if="articles.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无文章" />
      </div>
      <article
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        @click="goToDetail(article.id!)"
      >
        <div class="card-left">
          <div class="card-header">
            <span v-if="article.isTop" class="top-tag">置顶</span>
            <h2 class="article-title">{{ article.title }}</h2>
          </div>
          <p class="article-summary">{{ article.summary || '暂无摘要' }}</p>
          <div class="card-meta">
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ article.authorName || '匿名' }}
            </span>
            <span class="meta-item" v-if="article.categoryName">
              <el-icon><Folder /></el-icon>
              {{ article.categoryName }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              {{ article.views || 0 }}
            </span>
            <span class="meta-item">
              <el-icon><ChatDotSquare /></el-icon>
              {{ article.commentCount || 0 }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(article.createdAt) }}
            </span>
          </div>
        </div>
      </article>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total > 0">
        <el-pagination
          v-model:current-page="current"
          :page-size="size"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleListApi, type Article } from '@/api/article'
import { getCategoryTreeApi } from '@/api/category'
import dayjs from 'dayjs'
import logger from '@/utils/logger'

const route = useRoute()
const router = useRouter()

const articles = ref<Article[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const current = ref(1)
const size = ref(10)
const total = ref(0)
const currentCategoryId = ref<number | undefined>(undefined)
const keyword = ref('')

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

async function fetchArticles() {
  loading.value = true

  // █████████████████████████████████████████████████████████████████
  // 🎯 埋点: 加载文章列表
  //    记录分页参数和筛选条件，排查列表加载异常
  // █████████████████████████████████████████████████████████████████
  logger.info('ARTICLE', '获取文章列表', {
    page: current.value,
    size: size.value,
    categoryId: currentCategoryId.value,
    keyword: keyword.value
  })

  try {
    const params: any = {
      current: current.value,
      size: size.value
    }
    if (currentCategoryId.value) {
      params.categoryId = currentCategoryId.value
    }
    if (keyword.value) {
      params.keyword = keyword.value
    }
    const res = await getArticleListApi(params)
    const data = res.data
    articles.value = data.records || []
    total.value = data.total || 0

    // █████████████████████████████████████████████████████████████████
    // 🎯 埋点: 文章列表加载成功
    //    记录返回的文章数量和分页信息
    // █████████████████████████████████████████████████████████████████
    logger.success('ARTICLE', `文章列表加载成功`, {
      count: articles.value.length,
      total: total.value,
      page: current.value
    })
  } catch {
    articles.value = []
    logger.error('ARTICLE', '文章列表加载失败')
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await getCategoryTreeApi()
    categories.value = res.data || []
    logger.success('CATEGORY', `分类加载成功`, { count: categories.value.length })
  } catch {
    logger.warn('CATEGORY', '分类加载失败（不影响主流程）')
  }
}

function filterByCategory(id?: number) {
  currentCategoryId.value = id
  current.value = 1
  fetchArticles()
}

function handlePageChange(page: number) {
  current.value = page
  fetchArticles()
}

function goToDetail(id: number) {
  router.push(`/article/${id}`)
}

// 监听 URL 参数中的 categoryId
watch(
  () => route.query.categoryId,
  (val) => {
    if (val) {
      currentCategoryId.value = Number(val)
      current.value = 1
      fetchArticles()
    }
  }
)

onMounted(() => {
  if (route.query.categoryId) {
    currentCategoryId.value = Number(route.query.categoryId)
  }
  fetchCategories()
  fetchArticles()
})
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  .el-tag {
    cursor: pointer;
  }
}

.article-list {
  min-height: 300px;
}

.article-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.top-tag {
  background-color: $danger-color;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
  line-height: 1.4;

  &:hover {
    color: $primary-color;
  }
}

.article-summary {
  color: $text-regular;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: $text-secondary;

  .el-icon {
    font-size: 14px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;
}

.empty-state {
  padding: 60px 0;
}
</style>
