<template>
  <div class="search-page">
    <div class="search-box">
      <el-input
        v-model="keyword"
        size="large"
        placeholder="搜索文章、问题、用户..."
        clearable
        @keyup.enter="doSearch"
      >
        <template #prefix>
          <AppIcon name="search" :size="16" />
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="doSearch">搜索</el-button>
    </div>

    <div class="type-tabs" v-if="keyword">
      <button class="type-tab" :class="{ active: !type }" @click="switchType(undefined)">全部</button>
      <button class="type-tab" :class="{ active: type === 'article' }" @click="switchType('article')">文章</button>
      <button class="type-tab" :class="{ active: type === 'question' }" @click="switchType('question')">问题</button>
      <button class="type-tab" :class="{ active: type === 'user' }" @click="switchType('user')">用户</button>
    </div>

    <div class="result-list" v-loading="loading">
      <div v-for="item in list" :key="item.type + item.id" class="result-item" @click="goResult(item)">
        <el-tag size="small" :type="typeTag(item.type)" class="type-tag">{{ typeName(item.type) }}</el-tag>
        <div class="result-main">
          <div class="result-title">{{ item.title }}</div>
          <p class="result-summary">{{ item.summary }}</p>
          <span class="result-author">{{ item.authorName }}</span>
        </div>
      </div>
      <el-empty v-if="searched && list.length === 0 && !loading" description="没有找到相关内容" />
      <div v-if="!searched" class="search-hint">输入关键词，回车搜索全站内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchApi } from '@/api/search'
import { AppIcon } from '@vellastra/ui'

const router = useRouter()
const keyword = ref('')
const type = ref<'article' | 'question' | 'user' | undefined>(undefined)
const list = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)

async function doSearch() {
  if (!keyword.value.trim()) return
  searched.value = true
  loading.value = true
  try {
    const res: any = await searchApi(keyword.value.trim(), type.value)
    list.value = res.data?.records || []
  } finally {
    loading.value = false
  }
}

function switchType(t: 'article' | 'question' | 'user' | undefined) {
  type.value = t
  doSearch()
}

function typeName(t: string) {
  return t === 'article' ? '文章' : t === 'question' ? '问题' : '用户'
}

function typeTag(t: string) {
  return t === 'article' ? 'primary' : t === 'question' ? 'success' : 'warning'
}

function goResult(item: any) {
  if (item.type === 'article') router.push(`/article/${item.id}`)
  else if (item.type === 'question') router.push(`/community/questions/${item.id}`)
  else router.push(`/user/${item.id}`)
}
</script>

<style lang="scss" scoped>
.search-page {
  max-width: 760px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.15) inset;
    border-radius: 10px;
  }

  :deep(.el-input__inner) {
    color: #fff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }
}

.type-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.type-tab {
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(45, 212, 191, 0.2);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    border-color: rgba(45, 212, 191, 0.45);
    color: #fff;
  }

  &.active {
    background: linear-gradient(135deg, #0d9488, #2dd4bf);
    border-color: transparent;
    color: #fff;
  }
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  background-image: linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(45, 212, 191, 0.03) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(45, 212, 191, 0.15);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(45, 212, 191, 0.35);
    transform: translateY(-2px);
  }
}

.type-tag {
  flex-shrink: 0;
  margin-top: 2px;
}

.result-main {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.result-summary {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-author {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.search-hint {
  text-align: center;
  padding: 60px 0;
  color: rgba(255, 255, 255, 0.4);
}
</style>
