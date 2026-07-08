<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore'
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
      label: '服务器总数',
      value: s.serverCount,
      unit: '台',
      color: '#22d3ee',
      icon: '🖥',
    },
    {
      label: '平均CPU使用率',
      value: s.avgCpuUsage.toFixed(1),
      unit: '%',
      color: '#f97316',
      icon: '⚡',
    },
    {
      label: '平均磁盘IO等待',
      value: s.avgDiskIoWait.toFixed(1),
      unit: 'ms',
      color: '#fbbf24',
      icon: '💿',
    },
    {
      label: '平均内存占用',
      value: s.avgMemUsage.toFixed(1),
      unit: '%',
      color: '#34d399',
      icon: '📊',
    },
  ]
})

const roomStatsForPie = computed(() => {
  return data.value?.roomStats.map((r) => ({
    name: r.room,
    value: r.count,
  })) || []
})

const getRoomColor = (room: string): string => {
  const roomCode = room.charAt(0)
  const colorMap: Record<string, string> = {
    'A': '#22d3ee',
    'B': '#38bdf8',
    'C': '#a855f7',
    'D': '#34d399',
    'E': '#fbbf24',
  }
  return colorMap[roomCode] || '#8aa6c8'
}

onMounted(() => {
  store.loadDashboard()
})
</script>

<template>
  <BigScreenLayout>
    <div class="dashboard">
      <div class="dashboard__header">
        <ScreenHeader />
      </div>

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

      <div class="dashboard__main">
        <div class="dashboard__col dashboard__col--left">
          <BasePanel title="7天CPU/内存趋势" subtitle="采样周期" class="panel-grow">
            <LineTrendChart v-if="data" :data="data.trend" />
          </BasePanel>
          <BasePanel title="五大机房主机分布" subtitle="实时统计" class="panel-grow">
            <PieStatusChart v-if="data" :data="roomStatsForPie" />
          </BasePanel>
        </div>

        <div class="dashboard__col dashboard__col--center">
          <BasePanel title="机房机柜分布总览" subtitle="A/B/C/D/E" class="panel-grow">
            <MapOverviewChart v-if="data" :data="data.map" />
          </BasePanel>
        </div>

        <div class="dashboard__col dashboard__col--right">
          <BasePanel title="主机CPU负载排名" subtitle="TOP 10" class="panel-grow">
            <BarRankingChart v-if="data" :data="data.hostRank" />
          </BasePanel>
          <BasePanel title="四维性能雷达" subtitle="CPU/内存/网络/磁盘" class="panel-grow">
            <RadarAbilityChart v-if="data" :data="data.radar" />
          </BasePanel>
        </div>
      </div>

      <div class="dashboard__footer">
        <BasePanel title="指标超标告警" subtitle="磁盘>90% | CPU>85% | IO>20ms">
          <div v-if="loading" class="dashboard__hint">数据加载中…</div>
          <div v-else-if="error" class="dashboard__hint dashboard__hint--error">{{ error }}</div>
          <div v-else-if="data" class="activity">
            <div class="activity__track">
              <div
                v-for="(item, index) in [...data.alerts, ...data.alerts]"
                :key="index"
                class="activity__row"
              >
                <span class="activity__time">{{ item.collect_time.split(' ')[1] || item.collect_time }}</span>
                <span class="activity__room" :style="{ background: getRoomColor(item.room) + '20', color: getRoomColor(item.room) }">
                  {{ item.room }}
                </span>
                <span class="activity__host">{{ item.host_name }}</span>
                <span class="activity__metric">{{ item.mod_name }}</span>
                <span class="activity__value" :class="{ 'activity__value--warning': item.value > 80 }">
                  {{ item.value }}{{ item.unit }}
                </span>
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

.activity__room {
  min-width: 32px;
  text-align: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.activity__host {
  min-width: 180px;
  color: var(--bs-primary-2);
  font-size: 12px;
}

.activity__metric {
  min-width: 80px;
  color: var(--bs-text);
}

.activity__value {
  color: var(--bs-text);
  font-weight: 600;
}

.activity__value--warning {
  color: #fbbf24;
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
