<script setup lang="ts">
// 全国地图态势总览（动态加载并注册中国地图）
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { MapPoint } from '@/types/dashboard'
import { logger } from '@/logs/logger'

const props = defineProps<{ data: MapPoint[] }>()

const el = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let mapReady = false

async function ensureMap() {
  if (mapReady) return
  try {
    const res = await fetch('/maps/china.json')
    const geoJson = await res.json()
    // 裁掉远离大陆、向下大幅拉伸包围盒的“南海诸岛”要素，避免地图下方出现大片空白
    if (Array.isArray(geoJson.features)) {
      geoJson.features = geoJson.features.filter(
        (f: { properties?: { name?: string } }) => f.properties?.name !== '南海诸岛',
      )
    }
    echarts.registerMap('china', geoJson)
    mapReady = true
    logger.info('[map] china map registered')
  } catch (e) {
    logger.error('[map] failed to load china geojson', e)
  }
}

function buildOption(): echarts.EChartsOption | null {
  if (!mapReady) return null
  return {
    tooltip: { trigger: 'item', formatter: '{b}<br/>访问量: {c}' },
    visualMap: {
      min: 0,
      max: 10000,
      left: 20,
      bottom: 24,
      text: ['高', '低'],
      textStyle: { color: '#8aa6c8' },
      inRange: { color: ['#0a2148', '#155e9c', '#22d3ee', '#7df9ff'] },
      calculable: true,
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: true,
        zoom: 1.2,
        aspectScale: 1,
        label: { show: false },
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: { areaColor: '#22d3ee' },
        },
        itemStyle: {
          borderColor: 'rgba(34,211,238,0.4)',
          borderWidth: 0.6,
          areaColor: '#0a2148',
        },
        data: props.data.map((d) => ({ name: d.name, value: d.value })),
      },
    ],
  }
}

function render() {
  if (!el.value || !chart) return
  const opt = buildOption()
  if (opt) chart.setOption(opt, true)
}

onMounted(async () => {
  if (el.value) chart = echarts.init(el.value)
  window.addEventListener('resize', resize)
  await ensureMap()
  render()
})

watch(
  () => props.data,
  () => render(),
  { deep: true },
)

function resize() {
  chart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
  chart = null
})
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
