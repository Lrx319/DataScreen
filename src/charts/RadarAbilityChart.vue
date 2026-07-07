<script setup lang="ts">
// 业务能力雷达图
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { RadarAbility } from '@/types/dashboard'

const props = defineProps<{ data: RadarAbility[] }>()

const indicator = computed(() => props.data.map((d) => ({ name: d.dimension, max: 100 })))

const option = computed<EChartsOption | null>(() => ({
  tooltip: {},
  legend: {
    bottom: 0,
    textStyle: { color: '#8aa6c8' },
    data: ['当前能力', '目标能力'],
  },
  radar: {
    indicator: indicator.value,
    axisName: { color: '#8aa6c8' },
    splitLine: { lineStyle: { color: 'rgba(138,166,200,0.2)' } },
    splitArea: { areaStyle: { color: ['rgba(34,211,238,0.04)', 'rgba(34,211,238,0.08)'] } },
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.2)' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          name: '目标能力',
          value: props.data.map((d) => d.target),
          lineStyle: { color: '#a855f7', type: 'dashed' },
          itemStyle: { color: '#a855f7' },
          areaStyle: { color: 'rgba(168,85,247,0.1)' },
        },
        {
          name: '当前能力',
          value: props.data.map((d) => d.value),
          lineStyle: { color: '#22d3ee' },
          itemStyle: { color: '#22d3ee' },
          areaStyle: { color: 'rgba(34,211,238,0.25)' },
        },
      ],
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
