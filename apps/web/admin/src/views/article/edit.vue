<template>
  <div class="article-edit">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑文章' : '新建文章' }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <div class="editor-wrapper">
                <TiptapEditor v-model="form.content" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="封面图">
              <el-input v-model="form.coverImage" placeholder="封面图 URL" />
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width: 100%">
                <el-option v-for="t in tags" :key="t.id" :label="t.name" :value="t.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio value="published">发布</el-radio>
                <el-radio value="draft">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="置顶">
              <el-switch v-model="form.isTop" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSave('draft')">保存草稿</el-button>
              <el-button type="success" @click="handleSave('publish')">发布文章</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createArticleApi, updateArticleApi, getArticleDetailApi } from '@/api/article'
import { getCategoryTreeApi } from '@/api/category'
import { getTagListApi } from '@/api/tag'
import { TiptapEditor } from '@vellastra/ui'

const route = useRoute()
const formRef = ref<FormInstance>()
const isEdit = computed(() => !!route.params.id)
const categories = ref<any[]>([])
const tags = ref<any[]>([])

const form = reactive({
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: undefined as number | undefined,
  tags: [] as number[],
  status: 'draft',
  isTop: false
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

async function handleSave(action: string) {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload: any = { ...form, status: action === 'publish' ? 'published' : 'draft' }
  if (isEdit.value) {
    await updateArticleApi(Number(route.params.id), payload)
  } else {
    await createArticleApi(payload)
  }
  ElMessage.success(action === 'publish' ? '发布成功' : '保存成功')
  ;(formRef.value?.$el as any)?.formRef?.resetFields?.()
  setTimeout(() => {
    ;(window as any).location?.reload?.()
  }, 0)
}

onMounted(async () => {
  const [catRes, tagRes] = await Promise.all([getCategoryTreeApi(), getTagListApi()])
  categories.value = (catRes as any).data || []
  tags.value = (tagRes as any).data || []

  if (isEdit.value) {
    const res: any = await getArticleDetailApi(Number(route.params.id))
    const data = res.data || {}
    Object.assign(form, {
      title: data.title || '',
      summary: data.summary || '',
      content: data.content || '',
      coverImage: data.coverImage || '',
      categoryId: data.categoryId,
      tags: data.tags || [],
      status: data.status || 'draft',
      isTop: !!data.isTop
    })
  }
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-wrapper {
  width: 100%;
  min-height: 400px;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  overflow: hidden;
}
</style>
