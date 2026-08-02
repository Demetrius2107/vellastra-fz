<template>
  <div class="column-articles-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>专栏文章管理：{{ column?.name }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="articleTitle" label="文章标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="articleId" label="文章ID" width="90" />
        <el-table-column prop="note" label="备注" min-width="140" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleMoveUp(row)">上移</el-button>
            <el-popconfirm title="移出专栏？" @confirm="handleRemove(row.id)">
              <template #reference>
                <el-button link type="danger">移出</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getColumnDetailApi,
  getColumnArticlesApi,
  removeColumnArticleApi,
  sortColumnArticleApi
} from '@/api/column'

const route = useRoute()
const columnId = Number(route.params.id)
const column = ref<any>({})
const tableData = ref<any[]>([])
const loading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const [detailRes, listRes]: any[] = await Promise.all([getColumnDetailApi(columnId), getColumnArticlesApi(columnId)])
    column.value = detailRes.data || {}
    tableData.value = listRes.data || []
  } finally {
    loading.value = false
  }
}

async function handleMoveUp(row: any) {
  const idx = tableData.value.findIndex((r) => r.id === row.id)
  if (idx <= 0) return
  const prev = tableData.value[idx - 1]
  const minSort = Math.min(row.sortOrder ?? idx, prev.sortOrder ?? idx - 1)
  await sortColumnArticleApi(row.id, Math.max(0, minSort - 1))
  ElMessage.success('已上移')
  fetchData()
}

async function handleRemove(id: number) {
  await removeColumnArticleApi(id)
  ElMessage.success('已移出专栏')
  fetchData()
}

onMounted(fetchData)
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
