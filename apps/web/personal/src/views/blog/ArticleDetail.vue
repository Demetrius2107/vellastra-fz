<template>
  <div class="article-detail-page" v-loading="loading">
    <template v-if="article">
      <div class="article-header">
        <div class="header-meta">
          <span v-if="article.isTop" class="top-tag">置顶</span>
          <span class="category-tag" v-if="article.categoryName">{{ article.categoryName }}</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-info">
          <span class="info-item">
            <el-icon><User /></el-icon>
            {{ article.authorName || '匿名' }}
          </span>
          <span class="info-item">
            <el-icon><Clock /></el-icon>
            {{ formatDate(article.createdAt) }}
          </span>
          <span class="info-item">
            <el-icon><View /></el-icon>
            {{ article.views || 0 }} 次浏览
          </span>
        </div>
      </div>

      <!-- 封面图 -->
      <div class="article-cover" v-if="article.coverImage">
        <img :src="article.coverImage" :alt="article.title" />
      </div>

      <!-- 文章内容 -->
      <div class="article-content" v-html="renderedContent"></div>

      <!-- 互动栏 -->
      <div class="article-actions">
        <el-button
          :type="liked ? 'primary' : 'default'"
          @click="handleLike"
          round
        >
          {{ liked ? '已赞' : '点赞' }} {{ article.likeCount || 0 }}
        </el-button>
      </div>

      <!-- 评论区 -->
      <div class="comment-section">
        <h3 class="section-title">评论 ({{ totalComments }})</h3>

        <!-- 评论输入 -->
        <div class="comment-input" v-if="userStore.token">
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
          />
          <div class="input-actions">
            <el-button type="primary" @click="submitComment" :loading="submitting">
              发表评论
            </el-button>
          </div>
        </div>
        <div v-else class="login-tip">
          <router-link to="/login">登录</router-link> 后可以发表评论
        </div>

        <!-- 评论列表 -->
        <div class="comment-list" v-loading="commentLoading">
          <div v-if="comments.length === 0" class="no-comment">
            暂无评论，快来抢沙发吧~
          </div>
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">
              <el-avatar :size="36">{{ comment.authorName?.charAt(0) }}</el-avatar>
            </div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ comment.authorName }}</span>
                <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
              <div class="comment-actions">
                <span class="reply-btn" @click="startReply(comment)">回复</span>
              </div>

              <!-- 子评论 -->
              <div v-if="comment.children && comment.children.length > 0" class="sub-comments">
                <div v-for="sub in comment.children" :key="sub.id" class="sub-comment">
                  <div class="sub-comment-body">
                    <strong>{{ sub.authorName }}</strong>
                    <span v-if="sub.replyToName"> 回复 <strong>@{{ sub.replyToName }}</strong></span>
                    <p>{{ sub.content }}</p>
                    <span class="comment-time">{{ formatDate(sub.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- 回复输入框 -->
              <div v-if="replyingTo === comment.id" class="reply-input">
                <el-input
                  v-model="replyContent"
                  type="textarea"
                  :rows="2"
                  :placeholder="`回复 @${comment.authorName}`"
                />
                <div class="input-actions">
                  <el-button size="small" @click="cancelReply">取消</el-button>
                  <el-button size="small" type="primary" @click="submitReply(comment)" :loading="submitting">
                    回复
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-wrapper" v-if="totalComments > size">
            <el-pagination
              v-model:current-page="commentCurrent"
              :page-size="size"
              :total="totalComments"
              layout="prev, pager, next"
              size="small"
              @current-change="fetchComments"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleDetailApi, likeArticleApi, viewArticleApi, type Article } from '@/api/article'
import { getCommentListApi, createCommentApi, replyCommentApi, type Comment } from '@/api/comment'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
import logger from '@/utils/logger'

/**
 * 安全过滤 HTML，移除 script 标签、事件处理器属性及危险标签
 */
function sanitizeHtml(html: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = html
  // 移除 script 标签及其内容
  temp.querySelectorAll('script').forEach((el) => el.remove())
  // 移除所有元素上的事件处理器属性 (onclick, onerror, ...)
  temp.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })
  })
  // 移除危险的内嵌元素
  temp.querySelectorAll('iframe, object, embed, frame').forEach((el) => el.remove())
  // 移除 href/javascript: 和 href/data: 的链接
  temp.querySelectorAll('a[href]').forEach((el) => {
    const href = el.getAttribute('href')?.toLowerCase() || ''
    if (href.startsWith('javascript:') || href.startsWith('data:')) {
      el.removeAttribute('href')
    }
  })
  return temp.innerHTML
}

const route = useRoute()
const userStore = useUserStore()

const article = ref<Article | null>(null)
const loading = ref(false)
const liked = ref(false)
const renderedContent = ref('')

// 评论
const comments = ref<Comment[]>([])
const totalComments = ref(0)
const commentCurrent = ref(1)
const size = ref(10)
const commentLoading = ref(false)
const commentContent = ref('')
const replyContent = ref('')
const replyingTo = ref<number | null>(null)
const submitting = ref(false)

function formatDate(date?: string) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

async function fetchArticle() {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await getArticleDetailApi(Number(id))
    article.value = res.data
    renderedContent.value = sanitizeHtml(res.data.content || '')
  } catch {
    article.value = null
  } finally {
    loading.value = false
  }
}

async function recordView() {
  try {
    await viewArticleApi(Number(route.params.id))
  } catch {
    // ignore
  }
}

async function fetchComments() {
  const articleId = Number(route.params.id)
  if (!articleId) return
  commentLoading.value = true
  try {
    const res = await getCommentListApi({
      current: commentCurrent.value,
      size: size.value,
      articleId
    })
    const data = res.data
    comments.value = data.records || []
    totalComments.value = data.total || 0
  } catch {
    comments.value = []
  } finally {
    commentLoading.value = false
  }
}

async function handleLike() {
  if (!userStore.token) return
  try {
    await likeArticleApi(Number(route.params.id))
    liked.value = !liked.value
    if (article.value) {
      article.value.likeCount = (article.value.likeCount || 0) + (liked.value ? 1 : -1)
    }
  } catch {
    // ignore
  }
}

async function submitComment() {
  if (!commentContent.value.trim()) return
  submitting.value = true
  try {
    await createCommentApi({
      articleId: Number(route.params.id),
      content: commentContent.value.trim()
    })
    commentContent.value = ''
    commentCurrent.value = 1
    await fetchComments()
  } finally {
    submitting.value = false
  }
}

function startReply(comment: Comment) {
  replyingTo.value = comment.id
  replyContent.value = ''
}

function cancelReply() {
  replyingTo.value = null
  replyContent.value = ''
}

async function submitReply(parent: Comment) {
  if (!replyContent.value.trim()) return
  submitting.value = true
  try {
    await replyCommentApi({
      articleId: Number(route.params.id),
      content: replyContent.value.trim(),
      parentId: parent.id,
      replyToId: parent.authorId
    })
    replyContent.value = ''
    replyingTo.value = null
    await fetchComments()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchArticle()
  recordView()
  fetchComments()
})
</script>

<style lang="scss" scoped>
.article-detail-page {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.article-header {
  margin-bottom: 24px;
}

.header-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.top-tag {
  background-color: $danger-color;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.category-tag {
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.article-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: $text-secondary;

  .el-icon {
    font-size: 14px;
  }
}

.article-cover {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
  }
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: $text-primary;
  margin-bottom: 32px;
  min-height: 200px;
}

.article-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  margin-bottom: 32px;
}

.comment-section {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: $text-primary;
  }
}

.comment-input {
  margin-bottom: 24px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 8px;
}

.login-tip {
  text-align: center;
  padding: 20px;
  color: $text-secondary;
  font-size: 14px;
  margin-bottom: 24px;
  background: #fafafa;
  border-radius: 6px;

  a {
    color: $primary-color;
  }
}

.comment-list {
  min-height: 100px;
}

.no-comment {
  text-align: center;
  padding: 40px;
  color: $text-secondary;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
  color: $text-primary;
}

.comment-time {
  font-size: 12px;
  color: $text-secondary;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: $text-regular;
  margin: 4px 0 8px;
}

.comment-actions {
  .reply-btn {
    font-size: 13px;
    color: $text-secondary;
    cursor: pointer;

    &:hover {
      color: $primary-color;
    }
  }
}

.sub-comments {
  margin-top: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.sub-comment {
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.sub-comment-body {
  font-size: 14px;
  color: $text-regular;

  strong {
    color: $text-primary;
  }

  p {
    margin: 4px 0;
  }
}

.reply-input {
  margin-top: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
