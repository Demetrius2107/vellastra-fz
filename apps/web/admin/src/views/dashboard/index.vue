<template>
  <div class="dashboard-page">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="4" v-for="item in statCards" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>近 30 天趋势</template>
          <div ref="lineChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header>分类文章占比</template>
          <div ref="pieChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="hot-card">
      <template #header>热门文章 TOP10</template>
      <el-table :data="hotArticles" stripe v-loading="loading">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="title" label="标题" min-width="260" show-overflow-tooltip />
        <el-table-column prop="views" label="浏览量" width="120" sortable />
        <el-table-column prop="likeCount" label="点赞" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getAnalyticsDashboardApi, getAnalyticsTrendAllApi, getHotArticlesApi, getCategoryStatsApi } from '@/api/analytics'

const loading = ref(false)
const lineChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
let lineChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

const statCards = ref([
  { label: '文章总数', value: 0 },
  { label: '用户总数', value: 0 },
  { label: '评论总数', value: 0 },
  { label: '总浏览量', value: 0 },
  { label: '分类数', value: 0 },
  { label: '标签数', value: 0 }
])

const hotArticles = ref<any[]>([])

function initCharts() {
  lineChart = echarts.init(lineChartRef.value)
  pieChart = echarts.init(pieChartRef.value)
}

function renderTrend(data: any) {
  const series = [
    { name: '文章', key: 'articles', color: '#8b5cf6' },
    { name: '浏览', key: 'views', color: '#3b82f6' },
    { name: '用户', key: 'users', color: '#10b981' },
    { name: '评论', key: 'comments', color: '#f59e0b' }
  ]
  const first = data?.articles || data?.views || []
  const dates = first.map((r: any) => String(r.stat_date).slice(5))
  lineChart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: (data?.[s.key] || []).map((r: any) => r.value ?? 0),
      itemStyle: { color: s.color }
    }))
  })
}

function renderCategory(data: any) {
  const rows = Array.isArray(data) ? data : data?.records || []
  pieChart?.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        data: rows.map((r: any) => ({ name: r.name || r.categoryName, value: r.article_count ?? r.articleCount ?? 0 }))
      }
    ]
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const [dashboardRes, trendRes, hotRes, catRes]: any[] = await Promise.all([
      getAnalyticsDashboardApi(),
      getAnalyticsTrendAllApi(30),
      getHotArticlesApi(10),
      getCategoryStatsApi()
    ])
    const d = dashboardRes.data || {}
    statCards.value = [
      { label: '文章总数', value: d.totalArticles ?? 0 },
      { label: '用户总数', value: d.totalUsers ?? 0 },
      { label: '评论总数', value: d.totalComments ?? 0 },
      { label: '总浏览量', value: d.totalViews ?? 0 },
      { label: '分类数', value: d.totalCategories ?? 0 },
      { label: '标签数', value: d.totalTags ?? 0 }
    ]
    hotArticles.value = hotRes.data || []
    initCharts()
    renderTrend(trendRes.data || {})
    renderCategory(catRes.data || [])
    window.addEventListener('resize', handleResize)
  } finally {
    loading.value = false
  }
})

function handleResize() {
  lineChart?.resize()
  pieChart?.resize()
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  pieChart?.dispose()
})
</script>

<style lang="scss" scoped>
.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;

  .stat-label {
    color: $text-secondary;
    font-size: 13px;
  }

  .stat-value {
    font-size: 26px;
    font-weight: 700;
    margin-top: 8px;
    background: $gradient-primary;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.chart {
  height: 320px;
  width: 100%;
}

.hot-card {
  margin-top: 16px;
}
</style>
