<template>
  <div class="menu-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon> 新增菜单
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" row-key="id" stripe v-loading="loading" :tree-props="{ children: 'children' }" default-expand-all>
        <el-table-column prop="menuName" label="菜单名称" min-width="160" />
        <el-table-column prop="menuType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.menuType === 1 ? 'primary' : row.menuType === 2 ? 'success' : 'info'" size="small">
              {{ row.menuType === 1 ? '目录' : row.menuType === 2 ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" min-width="140" />
        <el-table-column prop="component" label="组件" min-width="140" />
        <el-table-column prop="perms" label="权限标识" min-width="140" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
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

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑菜单' : '新增菜单'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="无（顶级）" clearable style="width: 100%">
            <el-option v-for="c in tableData" :key="c.id" :label="c.menuName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.menuType">
            <el-radio :value="1">目录</el-radio>
            <el-radio :value="2">菜单</el-radio>
            <el-radio :value="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="form.path" placeholder="如 /comment" />
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="form.component" placeholder="如 comment/index" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.perms" placeholder="如 comment:list" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="如 message" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
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
import { getMenuTreeApi, createMenuApi, updateMenuApi, deleteMenuApi } from '@/api/menu'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  menuName: '',
  menuType: 2,
  parentId: undefined as number | undefined,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortOrder: 0
})

const rules: FormRules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
}

async function fetchTree() {
  loading.value = true
  try {
    const res: any = await getMenuTreeApi()
    tableData.value = res.data || []
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  editId.value = row?.id ?? null
  Object.assign(form, {
    menuName: row?.menuName || '',
    menuType: row?.menuType ?? 2,
    parentId: row?.parentId || undefined,
    path: row?.path || '',
    component: row?.component || '',
    perms: row?.perms || '',
    icon: row?.icon || '',
    sortOrder: row?.sortOrder ?? 0
  })
  dialogVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const payload: any = { ...form }
  if (editId.value) {
    await updateMenuApi(editId.value, payload)
    ElMessage.success('编辑成功')
  } else {
    await createMenuApi(payload)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchTree()
}

async function handleDelete(id: number) {
  await deleteMenuApi(id)
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
