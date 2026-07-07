// MSW 请求拦截处理器（统一在此定义接口契约）
import { http, HttpResponse } from 'msw'
import { createDashboardMockData } from './dashboardMock'

export const handlers = [
  // 大屏聚合数据接口
  http.get('/api/dashboard', () => {
    return HttpResponse.json(createDashboardMockData())
  }),

  // 实时动态列表接口
  http.get('/api/dashboard/activity', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.activity)
  }),
]
