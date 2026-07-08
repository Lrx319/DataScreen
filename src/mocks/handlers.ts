import { http, HttpResponse } from 'msw'
import { createDashboardMockData } from './dashboardMock'

export const handlers = [
  http.get('/api/dashboard/summary', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.summary)
  }),
  http.get('/api/dashboard/room-stats', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.roomStats)
  }),
  http.get('/api/dashboard/trend', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.trend)
  }),
  http.get('/api/dashboard/host-rank', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.hostRank)
  }),
  http.get('/api/dashboard/radar', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.radar)
  }),
  http.get('/api/dashboard/alerts', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.alerts)
  }),
  http.get('/api/dashboard/map', () => {
    const data = createDashboardMockData()
    return HttpResponse.json(data.map)
  }),
  http.get('/api/dashboard', () => {
    return HttpResponse.json(createDashboardMockData())
  }),
]
