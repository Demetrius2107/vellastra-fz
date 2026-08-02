<template>
  <div class="tag-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>标签管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon> 新增标签
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="标签名称" min-width="160" />
        <el-table-column prop="articleCount" label="文章数" width="100" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑标签' : '新增标签'" width="420px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getTagListApi, createTagApi, updateTagApi, deleteTagApi } from '@/api/tag'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({ name: '' })

const rules: FormRules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getTagListApi()
    tableData.value = res.data || []
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  editId.value = row?.id ?? null
  form.name = row?.name || ''
  dialogVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editId.value) {
    await updateTagApi(editId.value, { name: form.name })
    ElMessage.success('编辑成功')
  } else {
    await createTagApi({ name: form.name })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchList()
}

async function handleDelete(id: number) {
  await deleteTagApi(id)
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
</style>
