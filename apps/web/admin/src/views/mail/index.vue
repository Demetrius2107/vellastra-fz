<template>
  <div class="mail-page">
    <el-tabs v-model="activeTab">
      <!-- 订阅者 -->
      <el-tab-pane label="订阅者" name="subscribers">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订阅者列表（已确认 {{ subscriberCount }} 人）</span>
            </div>
          </template>
          <el-table :data="subscribers" stripe v-loading="subLoading">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="email" label="邮箱" min-width="200" />
            <el-table-column prop="name" label="名称" min-width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 1 ? '已确认' : '待确认' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="订阅时间" width="170" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 模板 -->
      <el-tab-pane label="邮件模板" name="templates">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>模板列表</span>
              <el-button type="primary" @click="openTemplateDialog()">
                <el-icon><Plus /></el-icon> 新增模板
              </el-button>
            </div>
          </template>
          <el-table :data="templates" stripe v-loading="tplLoading">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="name" label="模板名称" min-width="150" />
            <el-table-column prop="code" label="编码" min-width="130" />
            <el-table-column prop="subject" label="主题" min-width="180" show-overflow-tooltip />
            <el-table-column label="操作" width="140">
              <template #default="{ row }">
                <el-button link type="primary" @click="openTemplateDialog(row)">编辑</el-button>
                <el-popconfirm title="确定删除吗？" @confirm="handleDeleteTemplate(row.id)">
                  <template #reference>
                    <el-button link type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 发送记录 -->
      <el-tab-pane label="发送记录" name="logs">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>发送记录</span>
              <el-button @click="fetchLogs">刷新</el-button>
            </div>
          </template>
          <el-table :data="logs" stripe v-loading="logLoading">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="to" label="收件人" min-width="180" />
            <el-table-column prop="templateCode" label="模板" min-width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'success' ? 'success' : row.status === 'failed' ? 'danger' : 'warning'" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="batchNo" label="批次号" min-width="140" />
            <el-table-column prop="createdAt" label="时间" width="170" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button v-if="row.status === 'failed'" link type="primary" @click="handleRetry(row.id)">重试</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="templateDialogVisible" :title="templateEditId ? '编辑模板' : '新增模板'" width="600px">
      <el-form :model="templateForm" label-width="90px">
        <el-form-item label="模板名称" required>
          <el-input v-model="templateForm.name" />
        </el-form-item>
        <el-form-item label="编码" required>
          <el-input v-model="templateForm.code" placeholder="唯一编码" />
        </el-form-item>
        <el-form-item label="主题" required>
          <el-input v-model="templateForm.subject" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="templateForm.content" type="textarea" :rows="6" placeholder="支持 {{ variable }} 模板变量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTemplate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSubscribersApi,
  getSubscriberCountApi,
  getMailTemplatesApi,
  createMailTemplateApi,
  updateMailTemplateApi,
  deleteMailTemplateApi,
  getSendLogsApi,
  retrySendMailApi
} from '@/api/mail'

const activeTab = ref('subscribers')

// 订阅者
const subLoading = ref(false)
const subscribers = ref<any[]>([])
const subscriberCount = ref(0)

// 模板
const tplLoading = ref(false)
const templates = ref<any[]>([])
const templateDialogVisible = ref(false)
const templateEditId = ref<number | null>(null)
const templateForm = reactive({ name: '', code: '', subject: '', content: '' })

// 发送记录
const logLoading = ref(false)
const logs = ref<any[]>([])

async function fetchSubscribers() {
  subLoading.value = true
  try {
    const [listRes, countRes]: any[] = await Promise.all([getSubscribersApi({ current: 1, size: 50 }), getSubscriberCountApi()])
    subscribers.value = listRes.data?.records || []
    subscriberCount.value = countRes.data ?? 0
  } finally {
    subLoading.value = false
  }
}

async function fetchTemplates() {
  tplLoading.value = true
  try {
    const res: any = await getMailTemplatesApi({ current: 1, size: 50 })
    templates.value = res.data?.records || []
  } finally {
    tplLoading.value = false
  }
}

async function fetchLogs() {
  logLoading.value = true
  try {
    const res: any = await getSendLogsApi({ current: 1, size: 50 })
    logs.value = res.data?.records || []
  } finally {
    logLoading.value = false
  }
}

function openTemplateDialog(row?: any) {
  templateEditId.value = row?.id ?? null
  Object.assign(templateForm, {
    name: row?.name || '',
    code: row?.code || '',
    subject: row?.subject || '',
    content: row?.content || ''
  })
  templateDialogVisible.value = true
}

async function handleSaveTemplate() {
  if (!templateForm.name || !templateForm.code || !templateForm.subject || !templateForm.content) {
    ElMessage.warning('请填写完整模板信息')
    return
  }
  if (templateEditId.value) {
    await updateMailTemplateApi(templateEditId.value, { ...templateForm })
    ElMessage.success('编辑成功')
  } else {
    await createMailTemplateApi({ ...templateForm })
    ElMessage.success('新增成功')
  }
  templateDialogVisible.value = false
  fetchTemplates()
}

async function handleDeleteTemplate(id: number) {
  await deleteMailTemplateApi(id)
  ElMessage.success('删除成功')
  fetchTemplates()
}

async function handleRetry(id: number) {
  await retrySendMailApi(id)
  ElMessage.success('已重试')
  fetchLogs()
}

onMounted(() => {
  fetchSubscribers()
  fetchTemplates()
  fetchLogs()
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
