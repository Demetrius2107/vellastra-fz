<template>
  <div class="comment-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>评论管理</span>
          <el-button @click="handleReset">刷新</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable>
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="authorName" label="评论人" width="120" />
        <el-table-column prop="articleId" label="文章ID" width="90" />
        <el-table-column prop="content" label="内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'" size="small">
              {{ row.status === 1 ? '已通过' : row.status === 2 ? '已拒绝' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== 1" link type="success" @click="handleAudit(row.id, 1)">通过</el-button>
            <el-button v-if="row.status !== 2" link type="warning" @click="handleAudit(row.id, 2)">拒绝</el-button>
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
import { getCommentListApi, auditCommentApi, deleteCommentApi } from '@/api/comment'

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

const queryParams = reactive({
  status: undefined as number | undefined,
  current: 1,
  size: 10
})

function handleSearch() {
  queryParams.current = 1
  fetchList()
}

function handleReset() {
  Object.assign(queryParams, { status: undefined, current: 1, size: 10 })
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getCommentListApi({
      current: queryParams.current,
      size: queryParams.size,
      status: queryParams.status
    })
    tableData.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

async function handleAudit(id: number, status: number) {
  await auditCommentApi(id, status)
  ElMessage.success(status === 1 ? '审核通过' : '已拒绝')
  fetchList()
}

async function handleDelete(id: number) {
  await deleteCommentApi(id)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(fetchList)
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
</style>
