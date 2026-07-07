<script setup lang="ts">
// 城市数据排名柱状图
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { CityRank } from '@/types/dashboard'

const props = defineProps<{ data: CityRank[] }>()

const sorted = computed(() => [...props.data].sort((a, b) => a.value - b.value))

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 16, right: 40, bottom: 16, left: 60 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value', axisLabel: { color: '#8aa6c8' }, splitLine: { show: false } },
  yAxis: {
    type: 'category',
    data: sorted.value.map((d) => d.name),
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8' },
  },
  series: [
    {
      type: 'bar',
      data: sorted.value.map((d) => d.value),
      barWidth: 12,
      label: { show: true, position: 'right', color: '#e6f1ff' },
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#38bdf8' },
            { offset: 1, color: '#22d3ee' },
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
