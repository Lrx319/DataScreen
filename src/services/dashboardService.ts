import http from './http'
import type { AlertItem, DashboardData, HostRank, MapPoint, RadarAbility, RoomStats, SummaryMetrics } from '@/types/dashboard'

export async function fetchDashboardData(): Promise<DashboardData> {
  const res = await http.get<DashboardData>('/dashboard')
  return res.data
}

export async function fetchSummary(): Promise<SummaryMetrics> {
  const res = await http.get<SummaryMetrics>('/dashboard/summary')
  return res.data
}

export async function fetchRoomStats(): Promise<RoomStats[]> {
  const res = await http.get<RoomStats[]>('/dashboard/room-stats')
  return res.data
}

export async function fetchTrend() {
  const res = await http.get('/dashboard/trend')
  return res.data
}

export async function fetchHostRank(): Promise<HostRank[]> {
  const res = await http.get<HostRank[]>('/dashboard/host-rank')
  return res.data
}

export async function fetchRadar(): Promise<RadarAbility[]> {
  const res = await http.get<RadarAbility[]>('/dashboard/radar')
  return res.data
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await http.get<AlertItem[]>('/dashboard/alerts')
  return res.data
}

export async function fetchMap(): Promise<MapPoint[]> {
  const res = await http.get<MapPoint[]>('/dashboard/map')
  return res.data
}

export const dashboardService = {
  fetchDashboardData,
  fetchSummary,
  fetchRoomStats,
  fetchTrend,
  fetchHostRank,
  fetchRadar,
  fetchAlerts,
  fetchMap,
}
