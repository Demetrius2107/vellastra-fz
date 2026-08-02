<template>
  <div class="category-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon> 新增分类
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" row-key="id" stripe v-loading="loading" :tree-props="{ children: 'children' }" default-expand-all>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="160" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="articleCount" label="文章数" width="100" />
        <el-table-column label="操作" width="180">
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

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑分类' : '新增分类'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="上级分类">
          <el-select v-model="form.parentId" placeholder="无（顶级）" clearable style="width: 100%">
            <el-option v-for="c in topCategories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getCategoryTreeApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/api/category'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: '',
  parentId: undefined as number | undefined
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const topCategories = computed(() => (tableData.value || []).map((c: any) => ({ id: c.id, name: c.name })))

async function fetchTree() {
  loading.value = true
  try {
    const res: any = await getCategoryTreeApi()
    tableData.value = res.data || []
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  editId.value = row?.id ?? null
  Object.assign(form, {
    name: row?.name || '',
    description: row?.description || '',
    parentId: row?.parentId || undefined
  })
  dialogVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editId.value) {
    await updateCategoryApi(editId.value, { name: form.name, description: form.description })
    ElMessage.success('编辑成功')
  } else {
    await createCategoryApi({ name: form.name, description: form.description, parentId: form.parentId })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchTree()
}

async function handleDelete(id: number) {
  await deleteCategoryApi(id)
  ElMessage.success('删除成功')
  fetchTree()
}

onMounted(fetchTree)
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
