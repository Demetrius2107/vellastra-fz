<template>
  <div class="question-detail-page" v-loading="loading">
    <!-- 问题主体 -->
    <div class="question-card">
      <div class="q-head">
        <h1 class="q-title">
          <el-tag v-if="question.solved" type="success" size="small">已解决</el-tag>
          {{ question.title }}
        </h1>
        <div class="q-meta">
          <AppAvatar :size="24" :name="question.authorName" />
          <span class="author" @click="goUser(question.authorId)">{{ question.authorName }}</span>
          <el-tag v-for="t in question.tags" :key="t" size="small" class="q-tag">{{ t }}</el-tag>
          <span class="time">{{ formatDate(question.createdAt) }}</span>
        </div>
      </div>
      <p class="q-content">{{ question.content }}</p>
      <div class="q-stats">
        <span class="stat-item"><AppIcon name="view" :size="14" /> {{ question.views ?? 0 }} 浏览</span>
        <span class="stat-item"><AppIcon name="comment" :size="14" /> {{ (question.answers || []).length }} 回答</span>
      </div>
    </div>

    <!-- 回答列表 -->
    <div class="answers-section">
      <h3 class="section-title">回答 ({{ (question.answers || []).length }})</h3>

      <div v-if="(question.answers || []).length === 0" class="no-answer">还没有回答，来抢沙发~</div>

      <div v-for="a in question.answers" :key="a.id" class="answer-card" :class="{ accepted: a.accepted }">
        <div class="answer-vote">
          <button class="vote-btn up" :class="{ active: votedUp.has(a.id) }" @click="vote(a, true)">▲</button>
          <span class="vote-num">{{ a.votes ?? 0 }}</span>
          <button class="vote-btn down" @click="vote(a, false)">▼</button>
        </div>
        <div class="answer-body">
          <div class="answer-head">
            <AppAvatar :size="24" :name="a.authorName" />
            <span class="author" @click="goUser(a.authorId)">{{ a.authorName }}</span>
            <el-tag v-if="a.accepted" type="success" size="small">已采纳</el-tag>
            <span class="time">{{ formatDate(a.createdAt) }}</span>
          </div>
          <p class="answer-content">{{ a.content }}</p>
          <div class="answer-actions" v-if="userStore.token">
            <el-button v-if="!a.accepted" size="small" type="success" plain @click="accept(a)">采纳为最佳答案</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 回答输入 -->
    <div class="reply-box" v-if="userStore.token">
      <h3 class="section-title">我的回答</h3>
      <el-input v-model="replyContent" type="textarea" :rows="4" placeholder="写下你的回答..." />
      <div class="reply-actions">
        <el-button type="primary" @click="submitReply" :loading="submitting">提交回答</el-button>
      </div>
    </div>
    <div v-else class="login-tip">
      <router-link to="/login">登录</router-link> 后可以回答问题
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getQuestionDetailApi, createAnswerApi, acceptAnswerApi, voteAnswerApi } from '@/api/question'
import { useUserStore } from '@/store/modules/user'
import { AppIcon, AppAvatar } from '@vellastra/ui'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const questionId = Number(route.params.id)
const loading = ref(false)
const question = ref<any>({})
const replyContent = ref('')
const submitting = ref(false)
const votedUp = ref<Set<number>>(new Set())

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

async function fetchDetail() {
  loading.value = true
  try {
    const res: any = await getQuestionDetailApi(questionId)
    question.value = res.data || {}
  } finally {
    loading.value = false
  }
}

async function submitReply() {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回答内容')
    return
  }
  submitting.value = true
  try {
    await createAnswerApi({ questionId, content: replyContent.value.trim() })
    ElMessage.success('回答成功')
    replyContent.value = ''
    fetchDetail()
  } finally {
    submitting.value = false
  }
}

async function accept(answer: any) {
  await acceptAnswerApi(answer.id)
  ElMessage.success('已采纳')
  fetchDetail()
}

async function vote(answer: any, up: boolean) {
  const res: any = await voteAnswerApi(answer.id, up)
  await fetchDetail()
  if (up) {
    const newSet = new Set(votedUp.value)
    res.data && res.data.votes !== undefined && newSet.add(answer.id)
    votedUp.value = newSet
  }
}

function goUser(id?: number) {
  if (id) router.push(`/user/${id}`)
}

onMounted(fetchDetail)
</script>

<style lang="scss" scoped>
.question-detail-page {
  max-width: 860px;
  margin: 0 auto;
}

.question-card {
  padding: 28px 28px 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(45, 212, 191, 0.04) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.q-head {
  margin-bottom: 14px;
}

.q-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.q-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;

  .author {
    color: #5eead4;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
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

.q-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.8;
  margin: 0 0 16px;
}

.q-stats {
  display: flex;
  gap: 20px;
  padding-top: 14px;
  border-top: 1px solid rgba(45, 212, 191, 0.12);

  .stat-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
  }
}

.answers-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
}

.answer-card {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(45, 212, 191, 0.12);

  &.accepted {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.06);
  }
}

.answer-vote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 40px;
  padding-top: 4px;

  .vote-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid rgba(45, 212, 191, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(45, 212, 191, 0.5);
      color: #fff;
    }

    &.active {
      background: linear-gradient(135deg, #0d9488, #2dd4bf);
      border-color: transparent;
      color: #fff;
    }
  }

  .vote-num {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }
}

.answer-body {
  flex: 1;
  min-width: 0;
}

.answer-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .author {
    font-size: 14px;
    font-weight: 600;
    color: #5eead4;
    cursor: pointer;
  }

  .time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-left: auto;
  }
}

.answer-content {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.answer-actions {
  margin-top: 10px;
}

.no-answer {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
}

.reply-box {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(45, 212, 191, 0.12);

  .section-title {
    margin-bottom: 12px;
  }
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.login-tip {
  text-align: center;
  padding: 20px;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(45, 212, 191, 0.12);
  border-radius: 8px;

  a {
    color: #2dd4bf;
  }
}

:deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.15) inset;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
}
</style>
