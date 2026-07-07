// 业务服务层：所有组件只允许通过此层获取数据
import http from './http'
import type { ActivityItem, DashboardData } from '@/types/dashboard'

/**
 * 获取大屏聚合数据（核心汇总、趋势、占比、排名、雷达、活动、地图）
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const res = await http.get<DashboardData>('/dashboard')
  return res.data
}

/**
 * 获取实时动态列表
 */
export async function fetchActivityList(): Promise<ActivityItem[]> {
  const res = await http.get<ActivityItem[]>('/dashboard/activity')
  return res.data
}

export const dashboardService = {
  fetchDashboardData,
  fetchActivityList,
}
