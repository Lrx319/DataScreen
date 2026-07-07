<script setup lang="ts">
// 访问趋势折线图
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { TrendPoint } from '@/types/dashboard'

const props = defineProps<{ data: TrendPoint[] }>()

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 30, right: 16, bottom: 24, left: 44 },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.time),
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(138,166,200,0.12)' } },
    axisLabel: { color: '#8aa6c8' },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: props.data.map((d) => d.value),
      lineStyle: { width: 3, color: '#22d3ee' },
      itemStyle: { color: '#22d3ee' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34,211,238,0.45)' },
            { offset: 1, color: 'rgba(34,211,238,0.02)' },
          ],
        },
      },
    },
  ],
}))

const { el } = useEcharts(option)
</script>

<template>
  <div ref="el" class="chart" />
</template>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
