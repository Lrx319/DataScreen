<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { RoomStats, SummaryMetrics } from '@/types/dashboard'

interface Props {
  roomStats: RoomStats[]
  summary: SummaryMetrics
  alertCount: number
}

const props = defineProps<Props>()

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 20, right: 20, bottom: 20, left: 20 },
  series: [
    {
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#0a2148',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{c}台',
        color: '#8aa6c8',
        fontSize: 12,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      labelLine: {
        show: true,
        lineStyle: { color: '#8aa6c8' },
      },
      data: props.roomStats.map((r) => ({
        name: r.room,
        value: r.count,
        itemStyle: {
          color: {
            'A机房': '#22d3ee',
            'B机房': '#38bdf8',
            'C机房': '#a855f7',
            'D机房': '#34d399',
            'E机房': '#fbbf24',
          }[r.room] || '#8aa6c8',
        },
      })),
    },
  ],
}))

const { el } = useEcharts(option)
</script>

<template>
  <div ref="el" class="chart">
    <div class="overview__stats">
      <div class="overview__stat">
        <span class="overview__stat-label">服务器总数</span>
        <span class="overview__stat-value">{{ summary.serverCount }}</span>
        <span class="overview__stat-unit">台</span>
      </div>
      <div class="overview__stat">
        <span class="overview__stat-label">平均CPU</span>
        <span class="overview__stat-value" :class="{ 'overview__stat-value--warning': summary.avgCpuUsage > 70 }">{{ summary.avgCpuUsage.toFixed(1) }}</span>
        <span class="overview__stat-unit">%</span>
      </div>
      <div class="overview__stat">
        <span class="overview__stat-label">平均内存</span>
        <span class="overview__stat-value" :class="{ 'overview__stat-value--warning': summary.avgMemUsage > 80 }">{{ summary.avgMemUsage.toFixed(1) }}</span>
        <span class="overview__stat-unit">%</span>
      </div>
      <div class="overview__stat">
        <span class="overview__stat-label">告警数量</span>
        <span class="overview__stat-value" :class="{ 'overview__stat-value--danger': alertCount > 0 }">{{ alertCount }}</span>
        <span class="overview__stat-unit">条</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.overview__stats {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  background: rgba(10, 33, 72, 0.8);
  padding: 12px 30px;
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.overview__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.overview__stat-label {
  font-size: 12px;
  color: #8aa6c8;
}

.overview__stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.overview__stat-value--warning {
  color: #fbbf24;
}

.overview__stat-value--danger {
  color: #f87171;
}

.overview__stat-unit {
  font-size: 12px;
  color: #8aa6c8;
}
</style>
