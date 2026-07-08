import type {
  AlertItem,
  DashboardData,
  HostRank,
  MapPoint,
  RadarAbility,
  RoomStats,
  SummaryMetrics,
} from '@/types/dashboard'

function buildSummary(): SummaryMetrics {
  return {
    serverCount: 25,
    avgCpuUsage: 67.8,
    avgDiskIoWait: 18.5,
    avgMemUsage: 76.2,
  }
}

function buildRoomStats(): RoomStats[] {
  return [
    { room: 'A', count: 7 },
    { room: 'B', count: 6 },
    { room: 'C', count: 5 },
    { room: 'D', count: 4 },
    { room: 'E', count: 3 },
  ]
}

function buildTrend() {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:00']
  const cpuValues = [45.2, 38.6, 72.5, 82.3, 78.6, 85.4, 76.8]
  const memValues = [68.3, 62.4, 78.6, 85.2, 82.1, 86.7, 81.3]
  return {
    cpu: hours.map((hour, i) => ({ hour, avg_cpu: cpuValues[i] })),
    mem: hours.map((hour, i) => ({ hour, avg_mem: memValues[i] })),
  }
}

function buildHostRank(): HostRank[] {
  return [
    { host_name: 'srv-shanghai-04', room: 'B', avg_cpu: 91.4 },
    { host_name: 'srv-shanghai-06', room: 'B', avg_cpu: 89.2 },
    { host_name: 'srv-beijing-03', room: 'A', avg_cpu: 88.5 },
    { host_name: 'srv-shenzhen-04', room: 'D', avg_cpu: 86.4 },
    { host_name: 'srv-beijing-06', room: 'A', avg_cpu: 82.7 },
    { host_name: 'srv-shenzhen-02', room: 'D', avg_cpu: 78.3 },
    { host_name: 'srv-shanghai-02', room: 'B', avg_cpu: 78.6 },
    { host_name: 'srv-beijing-07', room: 'A', avg_cpu: 75.3 },
    { host_name: 'srv-guangzhou-03', room: 'C', avg_cpu: 72.5 },
    { host_name: 'srv-hangzhou-01', room: 'E', avg_cpu: 68.4 },
  ]
}

function buildRadar(): RadarAbility[] {
  return [
    { dimension: 'CPU使用率', value: 67.8, max: 100 },
    { dimension: '内存使用率', value: 76.2, max: 100 },
    { dimension: '网络入流量', value: 285.6, max: 1000 },
    { dimension: '磁盘IO等待', value: 18.5, max: 100 },
  ]
}

function buildAlerts(): AlertItem[] {
  return [
    { host_name: 'srv-beijing-03', room: 'A', mod_name: 'CPU使用率', value: 88.5, unit: '%', collect_time: '2026-07-01 00:00:00' },
    { host_name: 'srv-shanghai-04', room: 'B', mod_name: 'CPU使用率', value: 91.4, unit: '%', collect_time: '2026-07-01 01:00:00' },
    { host_name: 'srv-guangzhou-03', room: 'C', mod_name: 'CPU使用率', value: 82.4, unit: '%', collect_time: '2026-07-01 02:00:00' },
    { host_name: 'srv-beijing-03', room: 'A', mod_name: '磁盘IO等待', value: 25.6, unit: 'ms', collect_time: '2026-07-01 00:00:00' },
    { host_name: 'srv-shanghai-04', room: 'B', mod_name: '磁盘IO等待', value: 28.7, unit: 'ms', collect_time: '2026-07-01 00:05:00' },
    { host_name: 'srv-guangzhou-03', room: 'C', mod_name: '磁盘IO等待', value: 24.3, unit: 'ms', collect_time: '2026-07-01 00:10:00' },
    { host_name: 'srv-hangzhou-01', room: 'E', mod_name: '磁盘使用率', value: 93.2, unit: '%', collect_time: '2026-07-01 00:20:00' },
    { host_name: 'srv-shanghai-04', room: 'B', mod_name: '磁盘使用率', value: 94.1, unit: '%', collect_time: '2026-07-01 00:05:00' },
    { host_name: 'srv-beijing-03', room: 'A', mod_name: '磁盘使用率', value: 92.5, unit: '%', collect_time: '2026-07-01 00:00:00' },
    { host_name: 'srv-shanghai-06', room: 'B', mod_name: 'CPU使用率', value: 91.8, unit: '%', collect_time: '2026-07-01 20:00:00' },
  ]
}

function buildMap(): MapPoint[] {
  return [
    { name: '北京市', value: 7 },
    { name: '上海市', value: 6 },
    { name: '广东省', value: 9 },
    { name: '浙江省', value: 3 },
  ]
}

export function createDashboardMockData(): DashboardData {
  return {
    summary: buildSummary(),
    roomStats: buildRoomStats(),
    trend: buildTrend(),
    hostRank: buildHostRank(),
    radar: buildRadar(),
    alerts: buildAlerts(),
    map: buildMap(),
  }
}

export const dashboardMockData = createDashboardMockData()
