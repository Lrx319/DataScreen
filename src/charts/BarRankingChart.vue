<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'

interface HostRank {
  host_name: string
  room: string
  avg_cpu: number
}

const props = defineProps<{ data: HostRank[] }>()

const sorted = computed(() => [...props.data].sort((a, b) => a.avg_cpu - b.avg_cpu))

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 16, right: 60, bottom: 16, left: 80 },
  tooltip: { 
    trigger: 'axis', 
    axisPointer: { type: 'shadow' },
    formatter: (params: any) => {
      const data = sorted.value[params[0].dataIndex]
      return `${data.host_name}<br/>机房: ${data.room}<br/>CPU使用率: ${data.avg_cpu}%`
    }
  },
  xAxis: { 
    type: 'value', 
    axisLabel: { color: '#8aa6c8', formatter: '{value}%' }, 
    splitLine: { show: false } 
  },
  yAxis: {
    type: 'category',
    data: sorted.value.map((d) => d.host_name.replace('.hismartlab.cn', '')),
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8', fontSize: 10 },
  },
  series: [
    {
      type: 'bar',
      data: sorted.value.map((d) => d.avg_cpu),
      barWidth: 12,
      label: { show: true, position: 'right', color: '#e6f1ff', formatter: '{c}%' },
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#f97316' },
            { offset: 1, color: '#fbbf24' },
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
