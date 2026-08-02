<template>
  <div class="recycle-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>内容回收站</span>
          <div>
            <el-button type="danger" plain @click="handleEmpty">清空回收站</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="全部类型" clearable>
            <el-option label="文章" value="article" />
            <el-option label="评论" value="comment" />
            <el-option label="分类" value="category" />
            <el-option label="标签" value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="标题/内容关键词" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="type" label="类型" width="90">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题/内容" min-width="220" show-overflow-tooltip />
        <el-table-column prop="deletedBy" label="删除人" width="100" />
        <el-table-column prop="deletedAt" label="删除时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="success" @click="handleRestore(row.id)">恢复</el-button>
            <el-popconfirm title="永久删除？不可恢复！" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">永久删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-button type="success" plain :disabled="!selectedIds.length" @click="handleRestoreBatch">
          批量恢复（{{ selectedIds.length }}）
        </el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRecycleListApi,
  getRecycleStatsApi,
  restoreRecycleApi,
  restoreRecycleBatchApi,
  deleteRecycleApi,
  emptyRecycleApi
} from '@/api/recycle'

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const selectedIds = ref<number[]>([])

const queryParams = reactive({
  type: '',
  keyword: '',
  current: 1,
  size: 10
})

function handleSearch() {
  queryParams.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryParams, { type: '', keyword: '', current: 1, size: 10 })
  fetchList()
}

function handleSelectionChange(rows: any[]) {
  selectedIds.value = rows.map((r) => r.id)
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getRecycleListApi({
      current: queryParams.current,
      size: queryParams.size,
      type: queryParams.type || undefined,
      keyword: queryParams.keyword || undefined
    })
    tableData.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

async function handleRestore(id: number) {
  await restoreRecycleApi(id)
  ElMessage.success('恢复成功')
  fetchList()
}

async function handleRestoreBatch() {
  if (!selectedIds.value.length) return
  await restoreRecycleBatchApi(selectedIds.value)
  ElMessage.success('批量恢复成功')
  fetchList()
}

async function handleDelete(id: number) {
  await deleteRecycleApi(id)
  ElMessage.success('已永久删除')
  fetchList()
}

async function handleEmpty() {
  await ElMessageBox.confirm('确定清空回收站吗？该操作不可恢复！', '警告', { type: 'warning' })
  await emptyRecycleApi()
  ElMessage.success('回收站已清空')
  fetchList()
}

onMounted(() => {
  fetchList()
  getRecycleStatsApi()
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
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
