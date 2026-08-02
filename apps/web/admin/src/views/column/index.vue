<template>
  <div class="column-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>专栏管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon> 新增专栏
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="专栏名称" min-width="160" />
        <el-table-column prop="slug" label="Slug" width="120" />
        <el-table-column prop="authorName" label="作者" width="120" />
        <el-table-column prop="articleCount" label="文章数" width="90" />
        <el-table-column prop="featured" label="推荐" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.featured" type="warning" size="small">推荐</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push(`/admin/column/${row.id}`)">文章管理</el-button>
            <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
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
          layout="total, prev, pager, next"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑专栏' : '新增专栏'" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="专栏名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Slug" required>
          <el-input v-model="form.slug" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.coverImage" placeholder="URL" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.authorName" />
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
import { ElMessage } from 'element-plus'
import { getColumnListApi, createColumnApi, updateColumnApi, deleteColumnApi } from '@/api/column'

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const editId = ref<number | null>(null)

const queryParams = reactive({ current: 1, size: 10 })

const form = reactive({
  name: '',
  slug: '',
  description: '',
  coverImage: '',
  authorName: ''
})

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getColumnListApi({ current: queryParams.current, size: queryParams.size })
    tableData.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  editId.value = row?.id ?? null
  Object.assign(form, {
    name: row?.name || '',
    slug: row?.slug || '',
    description: row?.description || '',
    coverImage: row?.coverImage || '',
    authorName: row?.authorName || ''
  })
  dialogVisible.value = true
}

async function handleSave() {
  if (!form.name || !form.slug) {
    ElMessage.warning('名称和 Slug 必填')
    return
  }
  if (editId.value) {
    await updateColumnApi(editId.value, { ...form })
    ElMessage.success('编辑成功')
  } else {
    await createColumnApi({ ...form })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchList()
}

async function handleDelete(id: number) {
  await deleteColumnApi(id)
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

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
