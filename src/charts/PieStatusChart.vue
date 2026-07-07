<script setup lang="ts">
// 业务分类占比饼图
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'
import type { CategoryShare } from '@/types/dashboard'

const props = defineProps<{ data: CategoryShare[] }>()

const palette = ['#22d3ee', '#38bdf8', '#a855f7', '#fbbf24', '#34d399']

const option = computed<EChartsOption | null>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    textStyle: { color: '#8aa6c8', fontSize: 12 },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      center: ['38%', '52%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#061227', borderWidth: 2 },
      label: { color: '#e6f1ff', formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: '#8aa6c8' } },
      data: props.data.map((d, i) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: palette[i % palette.length] },
      })),
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
