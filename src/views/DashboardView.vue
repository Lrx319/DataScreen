<script setup lang="ts">
// 大屏首页视图
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore'
import { formatCompact, formatNumber } from '@/utils/format'
import BigScreenLayout from '@/layouts/BigScreenLayout.vue'
import ScreenHeader from '@/components/ScreenHeader.vue'
import BasePanel from '@/components/BasePanel.vue'
import MetricCard from '@/components/MetricCard.vue'
import LineTrendChart from '@/charts/LineTrendChart.vue'
import BarRankingChart from '@/charts/BarRankingChart.vue'
import PieStatusChart from '@/charts/PieStatusChart.vue'
import RadarAbilityChart from '@/charts/RadarAbilityChart.vue'
import MapOverviewChart from '@/charts/MapOverviewChart.vue'

const store = useDashboardStore()
const { data, loading, error } = storeToRefs(store)

const metrics = computed(() => {
  const s = data.value?.summary
  if (!s) return []
  return [
    {
      label: '今日访问量',
      value: formatCompact(s.todayVisits),
      unit: '',
      color: '#22d3ee',
      icon: '👁',
    },
    {
      label: '实时订单数',
      value: formatNumber(s.realtimeOrders),
      unit: '单',
      color: '#38bdf8',
      icon: '🛒',
    },
    {
      label: '活跃用户数',
      value: formatCompact(s.activeUsers),
      unit: '',
      color: '#a855f7',
      icon: '👥',
    },
    {
      label: '系统健康度',
      value: s.systemHealth.toFixed(1),
      unit: '%',
      color: '#34d399',
      icon: '💡',
    },
  ]
})

const levelText: Record<string, string> = {
  info: '信息',
  warning: '警告',
  error: '错误',
}

onMounted(() => {
  store.loadDashboard()
})
</script>

<template>
  <BigScreenLayout>
    <div class="dashboard">
      <!-- 顶部栏 -->
      <div class="dashboard__header">
        <ScreenHeader />
      </div>

      <!-- 核心指标区 -->
      <div class="dashboard__metrics">
        <MetricCard
          v-for="m in metrics"
          :key="m.label"
          :label="m.label"
          :value="m.value"
          :unit="m.unit"
          :color="m.color"
          :icon="m.icon"
        />
      </div>

      <!-- 主体三栏 -->
      <div class="dashboard__main">
        <div class="dashboard__col dashboard__col--left">
          <BasePanel title="访问趋势" subtitle="近 12 小时" class="panel-grow">
            <LineTrendChart v-if="data" :data="data.trend" />
          </BasePanel>
          <BasePanel title="业务分类占比" subtitle="实时" class="panel-grow">
            <PieStatusChart v-if="data" :data="data.category" />
          </BasePanel>
        </div>

        <div class="dashboard__col dashboard__col--center">
          <BasePanel title="全国态势总览" subtitle="区域访问分布" class="panel-grow">
            <MapOverviewChart v-if="data" :data="data.map" />
          </BasePanel>
        </div>

        <div class="dashboard__col dashboard__col--right">
          <BasePanel title="城市数据排名" subtitle="TOP 8" class="panel-grow">
            <BarRankingChart v-if="data" :data="data.cityRank" />
          </BasePanel>
          <BasePanel title="业务能力雷达" subtitle="能力评估" class="panel-grow">
            <RadarAbilityChart v-if="data" :data="data.radar" />
          </BasePanel>
        </div>
      </div>

      <!-- 底部实时动态 -->
      <div class="dashboard__footer">
        <BasePanel title="实时业务动态" subtitle="实时滚动">
          <div v-if="loading" class="dashboard__hint">数据加载中…</div>
          <div v-else-if="error" class="dashboard__hint dashboard__hint--error">{{ error }}</div>
          <div v-else-if="data" class="activity">
            <div class="activity__track">
              <div
                v-for="item in [...data.activity, ...data.activity]"
                :key="item.id"
                class="activity__row"
              >
                <span class="activity__time">{{ item.time }}</span>
                <span class="activity__level" :class="`activity__level--${item.level}`">
                  {{ levelText[item.level] }}
                </span>
                <span class="activity__msg">{{ item.message }}</span>
              </div>
            </div>
          </div>
        </BasePanel>
      </div>
    </div>
  </BigScreenLayout>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-rows: 72px 120px 1fr 150px;
  gap: 14px;
  width: 1920px;
  height: 1080px;
  padding: 14px 20px 20px;
}

.dashboard__header {
  height: 100%;
}

.dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.dashboard__main {
  display: grid;
  grid-template-columns: 460px 1fr 460px;
  gap: 14px;
  min-height: 0;
}

.dashboard__col {
  display: grid;
  gap: 14px;
  grid-template-rows: 1fr 1fr;
  min-height: 0;
}

.dashboard__col--center {
  grid-template-rows: 1fr;
}

.panel-grow {
  min-height: 0;
}

.dashboard__footer {
  min-height: 0;
}

.dashboard__hint {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--bs-text-dim);
}
.dashboard__hint--error {
  color: var(--bs-danger);
}

.activity {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.activity__track {
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: scroll-up 22s linear infinite;
}

.activity__row {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  padding: 4px 6px;
  border-bottom: 1px dashed rgba(138, 166, 200, 0.12);
}

.activity__time {
  color: var(--bs-text-dim);
  font-variant-numeric: tabular-nums;
  min-width: 80px;
}

.activity__level {
  min-width: 44px;
  text-align: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.activity__level--info {
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.12);
}
.activity__level--warning {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
}
.activity__level--error {
  color: #f87171;
  background: rgba(248, 113, 113, 0.12);
}

.activity__msg {
  color: var(--bs-text);
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
