<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'

interface RadarAbility {
  dimension: string
  value: number
  max: number
}

const props = defineProps<{ data: RadarAbility[] }>()

const option = computed<EChartsOption | null>(() => ({
  radar: {
    indicator: props.data.map((d) => ({
      name: d.dimension,
      max: d.max,
    })),
    shape: 'polygon',
    splitNumber: 4,
    axisName: { color: '#8aa6c8', fontSize: 12 },
    splitLine: { lineStyle: { color: 'rgba(138,166,200,0.2)' } },
    splitArea: { show: true, areaStyle: { color: ['rgba(34,211,238,0.04)', 'rgba(34,211,238,0.08)'] } },
    axisLine: { lineStyle: { color: 'rgba(138,166,200,0.3)' } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: props.data.map((d) => d.value),
          name: '当前值',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#22d3ee' },
          itemStyle: { color: '#22d3ee' },
          areaStyle: { color: 'rgba(34,211,238,0.3)' },
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
