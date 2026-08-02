<template>
  <div class="role-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon> 新增角色
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="roleName" label="角色名称" min-width="140" />
        <el-table-column prop="roleCode" label="角色编码" min-width="120" />
        <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary" @click="openMenuDialog(row)">菜单权限</el-button>
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

    <!-- 新增/编辑角色 -->
    <el-dialog v-model="dialogVisible" :title="editId ? '编辑角色' : '新增角色'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="如 EDITOR" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
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

    <!-- 菜单权限分配 -->
    <el-dialog v-model="menuDialogVisible" title="分配菜单权限" width="420px">
      <el-tree
        ref="menuTreeRef"
        :data="menuTree"
        show-checkbox
        node-key="id"
        :props="{ label: 'menuName', children: 'children' }"
        default-expand-all
      />
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveMenus">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import {
  getRoleListApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getRoleMenuIdsApi,
  assignRoleMenusApi
} from '@/api/role'
import { getMenuTreeApi } from '@/api/menu'

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({ roleName: '', roleCode: '', description: '', sortOrder: 0 })
const rules: FormRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 菜单权限
const menuDialogVisible = ref(false)
const menuTargetRoleId = ref<number | null>(null)
const menuTree = ref<any[]>([])
const menuTreeRef = ref<InstanceType<typeof ElTree>>()

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getRoleListApi()
    tableData.value = res.data || []
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  editId.value = row?.id ?? null
  Object.assign(form, {
    roleName: row?.roleName || '',
    roleCode: row?.roleCode || '',
    description: row?.description || '',
    sortOrder: row?.sortOrder ?? 0
  })
  dialogVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editId.value) {
    await updateRoleApi(editId.value, { ...form })
    ElMessage.success('编辑成功')
  } else {
    await createRoleApi({ ...form })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchList()
}

async function handleDelete(id: number) {
  await deleteRoleApi(id)
  ElMessage.success('删除成功')
  fetchList()
}

async function openMenuDialog(row: any) {
  menuTargetRoleId.value = row.id
  const [menuRes, idsRes]: any[] = await Promise.all([getMenuTreeApi(), getRoleMenuIdsApi(row.id)])
  menuTree.value = menuRes.data || []
  menuDialogVisible.value = true
  await new Promise((r) => setTimeout(r, 0))
  menuTreeRef.value?.setCheckedKeys(idsRes.data || [], false)
}

async function handleSaveMenus() {
  if (menuTargetRoleId.value == null) return
  const checked = menuTreeRef.value?.getCheckedKeys(false) || []
  const halfChecked = menuTreeRef.value?.getHalfCheckedKeys() || []
  await assignRoleMenusApi(menuTargetRoleId.value, [...checked, ...halfChecked] as number[])
  ElMessage.success('菜单权限已更新')
  menuDialogVisible.value = false
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
