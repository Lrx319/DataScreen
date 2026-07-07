// ECharts 通用封装：负责初始化、数据更新、自适应销毁
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import * as echarts from 'echarts'
import { logger } from '@/logs/logger'

type EChartsOption = echarts.EChartsOption

export function useEcharts(optionRef: Ref<EChartsOption | null>) {
  const el = ref<HTMLElement | null>(null)
  let chart: echarts.ECharts | null = null

  function render() {
    if (!el.value) return
    if (!chart) {
      chart = echarts.init(el.value)
    }
    if (optionRef.value) {
      chart.setOption(optionRef.value, true)
    }
  }

  function resize() {
    chart?.resize()
  }

  onMounted(() => {
    render()
    window.addEventListener('resize', resize)
  })

  watch(optionRef, () => render(), { deep: true })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    chart?.dispose()
    chart = null
  })

  return { el, resize, getInstance: () => chart, logger }
}
