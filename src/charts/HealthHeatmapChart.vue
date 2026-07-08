<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { HostRank } from '@/types/dashboard'

interface Props {
  hostRank: HostRank[]
}

const props = defineProps<Props>()

const roomOrder = ['A', 'B', 'C', 'D', 'E']

const hosts = computed(() => {
  const names = props.hostRank.map(h => {
    const match = h.host_name.match(/server-(\d+)/)
    return match ? `S${match[1]}` : h.host_name.replace('.hismartlab.cn', '')
  })
  return names
})

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 50, right: 80, bottom: 80, left: 50 },
  tooltip: {
    position: 'top',
    formatter: (params: any) => {
      const data = params.data as [string, string, number, string]
      return `${data[1]}<br/>机房: ${data[0]}<br/>CPU使用率: ${data[2].toFixed(1)}%`
    },
  },
  xAxis: {
    type: 'category',
    data: rooms.value,
    splitArea: { show: true },
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8', fontSize: 14, fontWeight: 'bold' },
  },
  yAxis: {
    type: 'category',
    data: hosts.value,
    splitArea: { show: true },
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8', fontSize: 10, rotate: 0 },
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'vertical',
    right: 10,
    top: 'center',
    inRange: {
      color: ['#065f46', '#16a34a', '#4ade80', '#fbbf24', '#f97316', '#dc2626'],
    },
    textStyle: { color: '#8aa6c8' },
  },
  series: [
    {
      name: 'CPU负载',
      type: 'heatmap',
      data: props.hostRank.map((h, i) => [h.room, hosts.value[i], h.avg_cpu]),
      label: {
        show: true,
        color: '#fff',
        fontSize: 10,
        formatter: (params: any) => params.data[2].toFixed(0),
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
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
