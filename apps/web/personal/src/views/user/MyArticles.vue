<template>
  <div class="my-articles-page">
    <div class="page-header">
      <h2>我的文章</h2>
    </div>

    <div class="article-list" v-loading="loading">
      <el-empty v-if="articles.length === 0 && !loading" description="还没有写过文章" />

      <el-table v-else :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="250">
          <template #default="{ row }">
            <div class="title-cell">
              <span v-if="row.isTop" class="top-tag">置顶</span>
              <span class="title-text">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览" width="80" align="center" />
        <el-table-column prop="likeCount" label="点赞" width="80" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editArticle(row.id)">编辑</el-button>
            <el-button
              v-if="row.status === 'draft'"
              size="small"
              type="success"
              @click="publishArticle(row as any)"
              :loading="publishingId === row.id"
            >
              发布
            </el-button>
            <el-button size="small" type="danger" @click="deleteArticle(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper" v-if="total > size">
        <el-pagination
          v-model:current-page="current"
          :page-size="size"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchArticles"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleListApi, publishArticleApi, deleteArticleApi, type Article } from '@/api/article'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

const articles = ref<Article[]>([])
const loading = ref(false)
const current = ref(1)
const size = ref(10)
const total = ref(0)
const publishingId = ref<number | null>(null)

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

async function fetchArticles() {
  loading.value = true
  try {
    const res = await getArticleListApi({
      current: current.value,
      size: size.value,
      authorId: userStore.userId || undefined
    })
    const data = res.data
    articles.value = data.records || []
    total.value = data.total || 0
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

function editArticle(id: number) {
  router.push(`/user/write/${id}`)
}

async function publishArticle(row: Article) {
  publishingId.value = row.id!
  try {
    await publishArticleApi(row.id!)
    ElMessage.success('发布成功')
    await fetchArticles()
  } finally {
    publishingId.value = null
  }
}

async function deleteArticle(id: number) {
  try {
    await ElMessageBox.confirm('确定删除该文章吗？已发布的文章不可删除。', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
    await deleteArticleApi(id)
    ElMessage.success('删除成功')
    await fetchArticles()
  } catch {
    // cancel
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style lang="scss" scoped>
.my-articles-page {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.page-header {
  margin-bottom: 20px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-tag {
  background-color: $danger-color;
  color: #fff;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
