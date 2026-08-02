<template>
  <div class="publish-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>发布站点</span>
          <el-button type="primary" @click="openSiteDialog()">
            <el-icon><Plus /></el-icon> 新增站点
          </el-button>
        </div>
      </template>

      <el-table :data="sites" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="站点名称" min-width="140" />
        <el-table-column prop="slug" label="Slug" width="110" />
        <el-table-column prop="repoUrl" label="仓库地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="domain" label="域名" min-width="140" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleBuild(row.id)">触发构建</el-button>
            <el-button link type="primary" @click="openSiteDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDeleteSite(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover" class="build-card">
      <template #header>
        <div class="card-header">
          <span>构建记录</span>
          <el-button @click="fetchBuilds">刷新</el-button>
        </div>
      </template>

      <el-table :data="builds" stripe v-loading="buildLoading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="siteName" label="站点" min-width="120" />
        <el-table-column prop="environment" label="环境" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : row.status === 'failed' ? 'danger' : 'warning'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="170" />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button v-if="row.status === 'failed'" link type="primary" @click="handleRetry(row.id)">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="siteDialogVisible" :title="siteEditId ? '编辑站点' : '新增站点'" width="520px">
      <el-form :model="siteForm" label-width="100px">
        <el-form-item label="站点名称" required>
          <el-input v-model="siteForm.name" />
        </el-form-item>
        <el-form-item label="Slug" required>
          <el-input v-model="siteForm.slug" placeholder="唯一标识" />
        </el-form-item>
        <el-form-item label="仓库地址" required>
          <el-input v-model="siteForm.repoUrl" placeholder="https://github.com/xxx/yyy.git" />
        </el-form-item>
        <el-form-item label="构建命令">
          <el-input v-model="siteForm.buildCommand" placeholder="如 npm run build" />
        </el-form-item>
        <el-form-item label="输出目录">
          <el-input v-model="siteForm.outputDir" placeholder="如 dist" />
        </el-form-item>
        <el-form-item label="域名">
          <el-input v-model="siteForm.domain" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="siteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSite">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPublishSitesApi,
  createPublishSiteApi,
  updatePublishSiteApi,
  deletePublishSiteApi,
  triggerBuildApi,
  getPublishBuildsApi,
  retryBuildApi
} from '@/api/publish'

const loading = ref(false)
const buildLoading = ref(false)
const sites = ref<any[]>([])
const builds = ref<any[]>([])

const siteDialogVisible = ref(false)
const siteEditId = ref<number | null>(null)
const siteForm = reactive({
  name: '',
  slug: '',
  repoUrl: '',
  buildCommand: '',
  outputDir: '',
  domain: ''
})

async function fetchSites() {
  loading.value = true
  try {
    const res: any = await getPublishSitesApi()
    sites.value = res.data || []
  } finally {
    loading.value = false
  }
}

async function fetchBuilds() {
  buildLoading.value = true
  try {
    const res: any = await getPublishBuildsApi({ current: 1, size: 20 })
    builds.value = res.data?.records || []
  } finally {
    buildLoading.value = false
  }
}

function openSiteDialog(row?: any) {
  siteEditId.value = row?.id ?? null
  Object.assign(siteForm, {
    name: row?.name || '',
    slug: row?.slug || '',
    repoUrl: row?.repoUrl || '',
    buildCommand: row?.buildCommand || '',
    outputDir: row?.outputDir || '',
    domain: row?.domain || ''
  })
  siteDialogVisible.value = true
}

async function handleSaveSite() {
  if (!siteForm.name || !siteForm.slug || !siteForm.repoUrl) {
    ElMessage.warning('名称、Slug、仓库地址必填')
    return
  }
  if (siteEditId.value) {
    await updatePublishSiteApi(siteEditId.value, { ...siteForm })
    ElMessage.success('编辑成功')
  } else {
    await createPublishSiteApi({ ...siteForm })
    ElMessage.success('新增成功')
  }
  siteDialogVisible.value = false
  fetchSites()
}

async function handleDeleteSite(id: number) {
  await deletePublishSiteApi(id)
  ElMessage.success('删除成功')
  fetchSites()
}

async function handleBuild(siteId: number) {
  await triggerBuildApi({ siteId })
  ElMessage.success('已触发构建')
  fetchBuilds()
}

async function handleRetry(id: number) {
  await retryBuildApi(id)
  ElMessage.success('已重试')
  fetchBuilds()
}

onMounted(() => {
  fetchSites()
  fetchBuilds()
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.build-card {
  margin-top: 20px;
}
</style>
