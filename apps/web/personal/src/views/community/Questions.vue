<template>
  <div class="questions-page">
    <div class="page-head">
      <h2>问答社区</h2>
      <el-button type="primary" @click="openAsk">我要提问</el-button>
    </div>

    <div class="questions-list" v-loading="loading">
      <div v-if="questions.length === 0 && !loading" class="empty">
        <el-empty description="还没有问题，来提第一个吧" />
      </div>
      <div v-for="q in questions" :key="q.id" class="question-card" @click="goDetail(q.id)">
        <div class="q-stats">
          <div class="stat">
            <span class="num">{{ q.answersCount ?? 0 }}</span>
            <span class="label">回答</span>
          </div>
          <div class="stat">
            <span class="num">{{ q.views ?? 0 }}</span>
            <span class="label">浏览</span>
          </div>
        </div>
        <div class="q-main">
          <div class="q-title">
            <el-tag v-if="q.solved" type="success" size="small">已解决</el-tag>
            <span class="title-text">{{ q.title }}</span>
          </div>
          <p class="q-content">{{ q.content }}</p>
          <div class="q-meta">
            <AppAvatar :size="20" :name="q.authorName" />
            <span class="author">{{ q.authorName }}</span>
            <el-tag v-for="t in q.tags" :key="t" size="small" class="q-tag">{{ t }}</el-tag>
            <span class="time">{{ formatDate(q.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper" v-if="total > size">
      <el-pagination
        v-model:current-page="current"
        :page-size="size"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchList"
      />
    </div>

    <el-dialog v-model="askVisible" title="我要提问" width="600px">
      <el-form :model="askForm" label-width="60px">
        <el-form-item label="标题" required>
          <el-input v-model="askForm.title" placeholder="一句话描述你的问题" />
        </el-form-item>
        <el-form-item label="详情">
          <el-input v-model="askForm.content" type="textarea" :rows="5" placeholder="补充问题细节" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="askVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAsk" :loading="submitting">发布问题</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getQuestionListApi, createQuestionApi } from '@/api/question'
import { AppAvatar } from '@vellastra/ui'

const router = useRouter()
const questions = ref<any[]>([])
const loading = ref(false)
const current = ref(1)
const size = ref(10)
const total = ref(0)

const askVisible = ref(false)
const submitting = ref(false)
const askForm = reactive({ title: '', content: '' })

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getQuestionListApi({ current: current.value, size: size.value })
    questions.value = res.data?.records || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function openAsk() {
  Object.assign(askForm, { title: '', content: '' })
  askVisible.value = true
}

async function submitAsk() {
  if (!askForm.title) {
    ElMessage.warning('请输入问题标题')
    return
  }
  submitting.value = true
  try {
    await createQuestionApi({ ...askForm })
    ElMessage.success('提问成功')
    askVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

function goDetail(id: number) {
  router.push(`/community/questions/${id}`)
}

onMounted(fetchList)
</script>

<style lang="scss" scoped>
.questions-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
}

.question-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 14px;
  cursor: pointer;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(45, 212, 191, 0.03) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(45, 212, 191, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
}

.q-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 56px;
  padding-top: 2px;

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);

    .num {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.q-main {
  flex: 1;
  min-width: 0;
}

.q-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .title-text {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      color: #2dd4bf;
    }
  }
}

.q-content {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.q-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  .author {
    color: rgba(255, 255, 255, 0.7);
  }

  .q-tag {
    background: rgba(45, 212, 191, 0.12);
    border: none;
    color: #5eead4;
  }

  .time {
    color: rgba(255, 255, 255, 0.4);
    margin-left: auto;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  :deep(.el-pagination) {
    --el-pagination-bg-color: rgba(255, 255, 255, 0.06);
    --el-pagination-text-color: rgba(255, 255, 255, 0.7);
    --el-pagination-button-color: rgba(255, 255, 255, 0.7);
    --el-pagination-hover-color: #2dd4bf;
    --el-pagination-button-disabled-bg-color: transparent;
  }

  :deep(.el-pager li),
  :deep(.btn-prev),
  :deep(.btn-next) {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(45, 212, 191, 0.15);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 3px;

    &:hover {
      color: #fff;
      border-color: rgba(45, 212, 191, 0.4);
    }

    &.is-active {
      background: linear-gradient(135deg, #0d9488, #2dd4bf);
      border-color: transparent;
      color: #fff;
    }
  }
}

.empty {
  padding: 60px 0;
}
</style>
