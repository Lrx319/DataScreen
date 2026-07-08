import { describe, expect, it } from 'vitest'
import { fetchDashboardData, fetchSummary, fetchAlerts, fetchRoomStats } from '@/services/dashboardService'

describe('dashboardService (mock)', () => {
  it('fetchDashboardData 返回完整聚合数据', async () => {
    const data = await fetchDashboardData()
    expect(data).toBeTruthy()
    expect(data.summary).toBeDefined()
    expect(data.roomStats).toBeDefined()
    expect(data.trend).toBeDefined()
    expect(data.trend.cpu).toBeDefined()
    expect(data.trend.mem).toBeDefined()
    expect(Array.isArray(data.hostRank)).toBe(true)
    expect(Array.isArray(data.radar)).toBe(true)
    expect(Array.isArray(data.alerts)).toBe(true)
    expect(Array.isArray(data.map)).toBe(true)
    expect(data.summary.serverCount).toBeGreaterThan(0)
  })

  it('fetchSummary 返回服务器统计指标', async () => {
    const summary = await fetchSummary()
    expect(summary).toHaveProperty('serverCount')
    expect(summary).toHaveProperty('avgCpuUsage')
    expect(summary).toHaveProperty('avgDiskIoWait')
    expect(summary).toHaveProperty('avgMemUsage')
    expect(summary.serverCount).toBeGreaterThan(0)
  })

  it('fetchRoomStats 返回机房统计', async () => {
    const stats = await fetchRoomStats()
    expect(Array.isArray(stats)).toBe(true)
    expect(stats.length).toBeGreaterThan(0)
    expect(stats[0]).toHaveProperty('room')
    expect(stats[0]).toHaveProperty('count')
  })

  it('fetchAlerts 返回告警列表', async () => {
    const alerts = await fetchAlerts()
    expect(Array.isArray(alerts)).toBe(true)
    expect(alerts.length).toBeGreaterThan(0)
    expect(alerts[0]).toHaveProperty('host_name')
    expect(alerts[0]).toHaveProperty('mod_name')
    expect(alerts[0]).toHaveProperty('value')
  })
})
