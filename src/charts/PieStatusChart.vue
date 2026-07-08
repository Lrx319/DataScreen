<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/utils/chart'

interface CategoryShare {
  name: string
  value: number
}

const props = defineProps<{ data: CategoryShare[] }>()

const option = computed<EChartsOption | null>(() => ({
  tooltip: { 
    trigger: 'item', 
    formatter: '{b}: {c}台 ({d}%)' 
  },
  legend: {
    orient: 'vertical',
    right: 16,
    top: 'center',
    textStyle: { color: '#8aa6c8' },
    itemGap: 12,
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0a1628',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff',
          formatter: '{b}\n{c}台',
        },
      },
      labelLine: { show: false },
      data: props.data.map((d, i) => ({
        ...d,
        itemStyle: {
          color: [
            '#22d3ee',
            '#38bdf8',
            '#a855f7',
            '#34d399',
            '#fbbf24',
          ][i % 5],
        },
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
