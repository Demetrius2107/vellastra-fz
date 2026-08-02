<template>
  <div class="article-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>文章列表</span>
          <el-button type="primary" @click="$router.push('/admin/article/edit')">
            <el-icon><Plus /></el-icon> 新建文章
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="queryParams.keyword" placeholder="请输入标题" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryParams.categoryId" placeholder="全部分类" clearable>
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable>
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="views" label="阅读量" width="100" sortable />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isTop" label="置顶" width="80">
          <template #default="{ row }">
            <el-switch :model-value="!!row.isTop" @change="(v: boolean) => handleTop(row, v)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push(`/admin/article/edit/${row.id}`)">编辑</el-button>
            <el-button v-if="row.status === 'draft'" link type="success" @click="handlePublish(row.id)">发布</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.current"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getArticleListApi, deleteArticleApi, topArticleApi, publishArticleApi } from '@/api/article'
import { getCategoryTreeApi } from '@/api/category'

const loading = ref(false)
const total = ref(0)
const categories = ref<any[]>([])

const queryParams = reactive({
  keyword: '',
  categoryId: undefined as number | undefined,
  status: '' as string,
  current: 1,
  size: 10
})

const tableData = ref<any[]>([])

function handleSearch() {
  queryParams.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryParams, { keyword: '', categoryId: undefined, status: '', current: 1, size: 10 })
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getArticleListApi({
      current: queryParams.current,
      size: queryParams.size,
      categoryId: queryParams.categoryId,
      keyword: queryParams.keyword || undefined,
      status: queryParams.status || undefined
    } as any)
    tableData.value = res.data?.records || res.data || []
    total.value = res.data?.total || tableData.value.length
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  await deleteArticleApi(id)
  ElMessage.success('删除成功')
  fetchList()
}

async function handlePublish(id: number) {
  await publishArticleApi(id)
  ElMessage.success('发布成功')
  fetchList()
}

async function handleTop(row: any, val: boolean) {
  await topArticleApi(row.id, val)
  ElMessage.success(val ? '已置顶' : '已取消置顶')
  row.isTop = val
}

onMounted(async () => {
  fetchList()
  const res: any = await getCategoryTreeApi()
  categories.value = res.data || []
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

// 毛玻璃渐变卡片（替代白底）
:deep(.el-card) {
  background: rgba(255, 255, 255, 0.05);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(45, 212, 191, 0.03) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  color: rgba(255, 255, 255, 0.85);
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgba(45, 212, 191, 0.12);
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-card__header .el-button) {
  color: #fff;
}
</style>
