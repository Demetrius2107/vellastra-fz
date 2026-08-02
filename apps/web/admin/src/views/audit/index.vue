<template>
  <div class="audit-page">
    <el-tabs v-model="activeTab">
      <!-- 待审核内容 -->
      <el-tab-pane label="待审核内容" name="pending">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待审核列表</span>
              <el-button @click="fetchPending">刷新</el-button>
            </div>
          </template>

          <el-table :data="pendingList" stripe v-loading="pendingLoading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
            <el-table-column prop="authorName" label="作者" width="120" />
            <el-table-column prop="createdAt" label="提交时间" width="170" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="success" @click="handleApprove(row.id)">通过</el-button>
                <el-popconfirm title="确定拒绝吗？" @confirm="handleReject(row.id)">
                  <template #reference>
                    <el-button link type="danger">拒绝</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="pendingQuery.current"
              v-model:page-size="pendingQuery.size"
              :total="pendingTotal"
              layout="total, prev, pager, next"
              @size-change="fetchPending"
              @current-change="fetchPending"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 举报列表 -->
      <el-tab-pane label="举报处理" name="reports">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>举报列表</span>
              <el-button @click="fetchReports">刷新</el-button>
            </div>
          </template>

          <el-table :data="reportList" stripe v-loading="reportLoading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="targetType" label="举报类型" width="110">
              <template #default="{ row }">
                <el-tag size="small">{{ row.targetType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" min-width="220" show-overflow-tooltip />
            <el-table-column prop="reporter" label="举报人" width="120" />
            <el-table-column prop="createdAt" label="时间" width="170" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
                  {{ row.status === 1 ? '已处理' : '待处理' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAuditPendingApi, approveAuditApi, rejectAuditApi, getAuditReportsApi } from '@/api/audit'

const activeTab = ref('pending')

// 待审核
const pendingLoading = ref(false)
const pendingList = ref<any[]>([])
const pendingTotal = ref(0)
const pendingQuery = reactive({ current: 1, size: 10 })

// 举报
const reportLoading = ref(false)
const reportList = ref<any[]>([])

async function fetchPending() {
  pendingLoading.value = true
  try {
    const res: any = await getAuditPendingApi({ current: pendingQuery.current, size: pendingQuery.size })
    pendingList.value = res.data?.records || []
    pendingTotal.value = res.data?.total || 0
  } finally {
    pendingLoading.value = false
  }
}

async function handleApprove(id: number) {
  await approveAuditApi(id)
  ElMessage.success('已通过')
  fetchPending()
}

async function handleReject(id: number) {
  await rejectAuditApi(id)
  ElMessage.success('已拒绝')
  fetchPending()
}

async function fetchReports() {
  reportLoading.value = true
  try {
    const res: any = await getAuditReportsApi({ current: 1, size: 20 })
    reportList.value = res.data?.records || []
  } finally {
    reportLoading.value = false
  }
}

onMounted(() => {
  fetchPending()
  fetchReports()
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
