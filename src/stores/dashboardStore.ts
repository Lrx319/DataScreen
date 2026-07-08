import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import { logger } from '@/logs/logger'
import type { DashboardData } from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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

  async function refreshAlerts() {
    try {
      const alerts = await dashboardService.fetchAlerts()
      if (data.value) data.value.alerts = alerts
    } catch (e) {
      logger.error('[store] refresh alerts failed', e)
    }
  }

  return { data, loading, error, loadDashboard, refreshAlerts }
})
