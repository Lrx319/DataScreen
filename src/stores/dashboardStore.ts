// 大屏数据状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import { logger } from '@/logs/logger'
import type { DashboardData } from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** 加载完整大屏数据 */
  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      data.value = await dashboardService.fetchDashboardData()
      logger.info('[store] dashboard loaded')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
      logger.error('[store] load dashboard failed', e)
    } finally {
      loading.value = false
    }
  }

  /** 单独刷新实时动态 */
  async function refreshActivity() {
    try {
      const activity = await dashboardService.fetchActivityList()
      if (data.value) data.value.activity = activity
    } catch (e) {
      logger.error('[store] refresh activity failed', e)
    }
  }

  return { data, loading, error, loadDashboard, refreshActivity }
})
