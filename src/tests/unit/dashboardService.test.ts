// 业务服务层测试：校验 Mock 环境下正常返回模拟数据
import { describe, expect, it } from 'vitest'
import { fetchActivityList, fetchDashboardData } from '@/services/dashboardService'

describe('dashboardService (mock)', () => {
  it('fetchDashboardData 返回完整聚合数据', async () => {
    const data = await fetchDashboardData()
    expect(data).toBeTruthy()
    expect(data.summary).toBeDefined()
    expect(Array.isArray(data.trend)).toBe(true)
    expect(Array.isArray(data.category)).toBe(true)
    expect(Array.isArray(data.cityRank)).toBe(true)
    expect(Array.isArray(data.radar)).toBe(true)
    expect(Array.isArray(data.activity)).toBe(true)
    expect(Array.isArray(data.map)).toBe(true)
    expect(data.summary.todayVisits).toBeGreaterThan(0)
  })

  it('fetchActivityList 返回动态列表', async () => {
    const list = await fetchActivityList()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]).toHaveProperty('level')
    expect(list[0]).toHaveProperty('message')
  })
})
