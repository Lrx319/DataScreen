<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'

interface TrendData {
  cpu: { hour: string; avg_cpu: number }[]
  mem: { hour: string; avg_mem: number }[]
}

const props = defineProps<{ data: TrendData }>()

const option = computed<EChartsOption | null>(() => ({
  grid: { top: 30, right: 16, bottom: 24, left: 44 },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['CPU使用率', '内存使用率'],
    textStyle: { color: '#8aa6c8' },
    top: 0,
  },
  xAxis: {
    type: 'category',
    data: props.data.cpu.map((d) => d.hour),
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.4)' } },
    axisLabel: { color: '#8aa6c8' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(138,166,200,0.12)' } },
    axisLabel: { color: '#8aa6c8', formatter: '{value}%' },
  },
  series: [
    {
      name: 'CPU使用率',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: props.data.cpu.map((d) => d.avg_cpu),
      lineStyle: { width: 3, color: '#f97316' },
      itemStyle: { color: '#f97316' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(249,115,22,0.35)' },
            { offset: 1, color: 'rgba(249,115,22,0.02)' },
          ],
        },
      },
    },
    {
      name: '内存使用率',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: props.data.mem.map((d) => d.avg_mem),
      lineStyle: { width: 3, color: '#34d399' },
      itemStyle: { color: '#34d399' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(52,211,153,0.35)' },
            { offset: 1, color: 'rgba(52,211,153,0.02)' },
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
