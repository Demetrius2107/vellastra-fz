<template>
  <div class="write-article-page">
    <div class="page-header">
      <div class="header-left">
        <h2 class="gradient-text">{{ isEdit ? '编辑文章' : '写文章' }}</h2>
        <p class="subtitle">用 Markdown 和富文本方式记录你的想法</p>
      </div>
      <div class="header-actions">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="saveAsDraft" :loading="saving" class="draft-btn">保存草稿</el-button>
        <el-button type="primary" @click="publishDirectly" :loading="publishing" class="publish-btn">发布文章</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <!-- 标题 -->
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="输入一个吸引人的标题..."
          size="large"
          class="title-input"
          maxlength="128"
          show-word-limit
        />
      </el-form-item>

      <!-- 元信息行 -->
      <div class="meta-row">
        <el-form-item label="分类" prop="categoryId" class="meta-item">
          <el-select v-model="form.categoryId" placeholder="选择分类" clearable>
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" class="meta-item">
          <el-select v-model="form.tags" placeholder="选择标签" multiple clearable filterable>
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图" class="meta-item">
          <el-input v-model="form.coverImage" placeholder="封面图 URL（可选）" clearable>
            <template #append>
              <el-button @click="handleCoverUpload">上传</el-button>
            </template>
          </el-input>
        </el-form-item>
      </div>

      <!-- 富文本编辑器 -->
      <el-form-item label="文章内容" prop="content">
        <TiptapEditor v-model="form.content" />
      </el-form-item>

      <!-- 摘要 -->
      <el-form-item label="文章摘要（用于列表展示）" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="3"
          placeholder="简要描述文章内容..."
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createArticleApi, updateArticleApi, getArticleDetailApi, type Article } from '@/api/article'
import { getCategoryTreeApi } from '@/api/category'
import { getTagListApi } from '@/api/tag'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { TiptapEditor } from '@vellastra/ui'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => (route.params.id ? Number(route.params.id) : null))

const categories = ref<any[]>([])
const tags = ref<any[]>([])
const saving = ref(false)
const publishing = ref(false)

const form = reactive({
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tags: [] as number[]
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

async function fetchCategories() {
  try {
    const res = await getCategoryTreeApi()
    categories.value = res.data || []
  } catch { /* ignore */ }
}

async function fetchTags() {
  try {
    const res = await getTagListApi()
    tags.value = res.data || []
  } catch { /* ignore */ }
}

async function loadArticle() {
  if (!articleId.value) return
  try {
    const res = await getArticleDetailApi(articleId.value)
    const data = res.data
    form.title = data.title || ''
    form.summary = data.summary || ''
    form.content = data.content || ''
    form.coverImage = data.coverImage || ''
    form.categoryId = data.categoryId
    form.tags = data.tags || []
  } catch {
    ElMessage.error('文章加载失败')
    router.push('/user/articles')
  }
}

async function save(status: 'draft' | 'published') {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload = {
    title: form.title,
    summary: form.summary,
    content: form.content,
    coverImage: form.coverImage || undefined,
    categoryId: form.categoryId,
    tagIds: form.tags.length > 0 ? form.tags : undefined,
    status
  }

  if (isEdit.value && articleId.value) {
    await updateArticleApi(articleId.value, payload)
    ElMessage.success('保存成功')
  } else {
    await createArticleApi(payload)
    ElMessage.success(status === 'draft' ? '草稿已保存' : '文章已发布')
    router.push('/user/articles')
  }
}

async function saveAsDraft() {
  saving.value = true
  try { await save('draft') } finally { saving.value = false }
}

async function publishDirectly() {
  publishing.value = true
  try { await save('published') } finally { publishing.value = false }
}

function handleCoverUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      form.coverImage = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

function cancel() {
  router.push(isEdit.value ? '/user/articles' : '/')
}

onMounted(() => {
  fetchCategories()
  fetchTags()
  if (isEdit.value) loadArticle()
})
</script>

<style lang="scss" scoped>
.write-article-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(167, 139, 250, 0.15);

  .header-left {
    h2 {
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 6px;
    }
    .subtitle {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.draft-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
}

.publish-btn {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  border: none;
  &:hover {
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
  }
}

.title-input {
  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(167, 139, 250, 0.15);
    box-shadow: none;
    border-radius: 10px;
    padding: 4px 16px;
  }
  :deep(.el-input__inner) {
    color: #fff;
    font-size: 18px;
    &::placeholder { color: rgba(255, 255, 255, 0.3); }
  }
}

.meta-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.meta-item {
  :deep(.el-select), :deep(.el-input) {
    width: 100%;
  }
  :deep(.el-select__wrapper),
  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(167, 139, 250, 0.15);
    box-shadow: none;
    border-radius: 8px;
  }
  :deep(.el-select__placeholder),
  :deep(.el-input__inner) {
    color: rgba(255, 255, 255, 0.8);
  }
}

:deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  padding-bottom: 6px;
}

:deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(167, 139, 250, 0.15);
  box-shadow: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  &::placeholder { color: rgba(255, 255, 255, 0.3); }
}
</style>