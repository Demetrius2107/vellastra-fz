<template>
  <div class="user-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openCreateDialog()">
            <el-icon><Plus /></el-icon> 新增用户
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="用户名/昵称/邮箱" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="170" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openRoleDialog(row)">角色</el-button>
            <el-button link type="warning" @click="handleToggleStatus(row)">{{ row.status === 1 ? '禁用' : '启用' }}</el-button>
            <el-button link type="warning" @click="handleResetPassword(row.id)">重置密码</el-button>
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

    <!-- 新增用户 -->
    <el-dialog v-model="createVisible" title="新增用户" width="460px">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createForm.email" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="createForm.nickname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateUser">确定</el-button>
      </template>
    </el-dialog>

    <!-- 角色分配 -->
    <el-dialog v-model="roleVisible" title="分配角色" width="420px">
      <el-checkbox-group v-model="userRoleIds">
        <el-checkbox v-for="r in roles" :key="r.id" :value="r.id" :label="r.id">{{ r.roleName }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="roleVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveRoles">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { getUserListApi, createUserApi, deleteUserApi, changeStatusApi, resetPasswordApi } from '@/api/user'
import { getRoleListApi, getUserRoleIdsApi, assignUserRolesApi } from '@/api/role'

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const roles = ref<any[]>([])

const queryParams = reactive({
  keyword: '',
  status: undefined as number | undefined,
  current: 1,
  size: 10
})

// 新增用户
const createVisible = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = reactive({ username: '', password: '', email: '', nickname: '' })
const createRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}

// 角色分配
const roleVisible = ref(false)
const roleTargetUserId = ref<number | null>(null)
const userRoleIds = ref<number[]>([])

function handleSearch() {
  queryParams.current = 1
  fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getUserListApi({
      current: queryParams.current,
      size: queryParams.size,
      keyword: queryParams.keyword || undefined,
      status: queryParams.status
    })
    tableData.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  Object.assign(createForm, { username: '', password: '', email: '', nickname: '' })
  createVisible.value = true
}

async function handleCreateUser() {
  const valid = await createFormRef.value?.validate().catch(() => false)
  if (!valid) return
  await createUserApi({ ...createForm })
  ElMessage.success('新增成功')
  createVisible.value = false
  fetchList()
}

async function handleToggleStatus(row: any) {
  const target = row.status === 1 ? 0 : 1
  await changeStatusApi(row.id, target)
  ElMessage.success(target === 1 ? '用户已启用' : '用户已禁用')
  fetchList()
}

async function handleResetPassword(id: number) {
  await ElMessageBox.confirm('确定重置该用户密码为 123456 吗？', '提示', { type: 'warning' })
  await resetPasswordApi(id)
  ElMessage.success('密码已重置为 123456')
}

async function handleDelete(id: number) {
  await deleteUserApi(id)
  ElMessage.success('删除成功')
  fetchList()
}

async function openRoleDialog(row: any) {
  roleTargetUserId.value = row.id
  const [rolesRes, idsRes]: any[] = await Promise.all([getRoleListApi(), getUserRoleIdsApi(row.id)])
  roles.value = rolesRes.data || []
  userRoleIds.value = idsRes.data || []
  roleVisible.value = true
}

async function handleSaveRoles() {
  if (roleTargetUserId.value != null) {
    await assignUserRolesApi(roleTargetUserId.value, userRoleIds.value)
    ElMessage.success('角色已更新')
    roleVisible.value = false
  }
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
