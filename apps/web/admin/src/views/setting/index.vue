<template>
  <div class="setting-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-form :model="configForm" label-width="110px" class="config-form">
        <el-form-item v-for="cfg in configKeys" :key="cfg.key" :label="cfg.label">
          <el-input v-model="configForm[cfg.key]" :placeholder="cfg.placeholder" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="friend-card">
      <template #header>
        <div class="card-header">
          <span>友情链接</span>
          <el-button type="primary" @click="openFriendDialog()">
            <el-icon><Plus /></el-icon> 新增友链
          </el-button>
        </div>
      </template>

      <el-table :data="friendLinks" stripe v-loading="friendLoading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" min-width="140" />
        <el-table-column prop="url" label="URL" min-width="200" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary" @click="openFriendDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDeleteFriend(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="friendDialogVisible" :title="friendEditId ? '编辑友链' : '新增友链'" width="480px">
      <el-form :model="friendForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="friendForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="URL" required>
          <el-input v-model="friendForm.url" placeholder="https://" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="friendForm.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="friendForm.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="friendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveFriend">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSettingListApi,
  updateSettingApi,
  getFriendLinksApi,
  createFriendLinkApi,
  updateFriendLinkApi,
  deleteFriendLinkApi
} from '@/api/setting'

const configKeys = [
  { key: 'site_name', label: '站点名称', placeholder: '请输入站点名称' },
  { key: 'site_description', label: '站点描述', placeholder: '请输入站点描述' },
  { key: 'site_keywords', label: '站点关键词', placeholder: '多个关键词用逗号分隔' }
]

const configForm = reactive<Record<string, string>>({})

const friendLoading = ref(false)
const friendLinks = ref<any[]>([])
const friendDialogVisible = ref(false)
const friendEditId = ref<number | null>(null)
const friendForm = reactive({ name: '', url: '', description: '', sortOrder: 0 })

async function fetchConfig() {
  const res: any = await getSettingListApi()
  const data = res.data || {}
  Object.keys(configForm).forEach((k) => delete configForm[k])
  configKeys.forEach(({ key }) => {
    configForm[key] = data[key] ?? ''
  })
}

async function handleSaveConfig() {
  for (const { key } of configKeys) {
    await updateSettingApi(key, configForm[key] ?? '')
  }
  ElMessage.success('保存成功')
}

async function fetchFriends() {
  friendLoading.value = true
  try {
    const res: any = await getFriendLinksApi()
    friendLinks.value = res.data || []
  } finally {
    friendLoading.value = false
  }
}

function openFriendDialog(row?: any) {
  friendEditId.value = row?.id ?? null
  Object.assign(friendForm, {
    name: row?.name || '',
    url: row?.url || '',
    description: row?.description || '',
    sortOrder: row?.sortOrder ?? 0
  })
  friendDialogVisible.value = true
}

async function handleSaveFriend() {
  if (!friendForm.name || !friendForm.url) {
    ElMessage.warning('名称和 URL 必填')
    return
  }
  if (friendEditId.value) {
    await updateFriendLinkApi(friendEditId.value, { ...friendForm })
    ElMessage.success('编辑成功')
  } else {
    await createFriendLinkApi({ ...friendForm })
    ElMessage.success('新增成功')
  }
  friendDialogVisible.value = false
  fetchFriends()
}

async function handleDeleteFriend(id: number) {
  await deleteFriendLinkApi(id)
  ElMessage.success('删除成功')
  fetchFriends()
}

onMounted(() => {
  fetchConfig()
  fetchFriends()
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-form {
  max-width: 640px;
}

.friend-card {
  margin-top: 20px;
}
</style>
