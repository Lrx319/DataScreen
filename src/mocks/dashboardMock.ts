import type { SummaryMetrics, RoomStats, TrendData, HostRank, RadarData, AlertItem, MapPoint, DashboardData } from '../types/dashboard'

function buildSummary(): SummaryMetrics {
  return {
    serverCount: 20,
    avgCpuUsage: 67.8,
    avgDiskIoWait: 18.5,
    avgMemUsage: 76.2,
  }
}

function buildRoomStats(): RoomStats[] {
  return [
    { room: 'A机房', count: 7 },
    { room: 'B机房', count: 4 },
    { room: 'C机房', count: 3 },
    { room: 'D机房', count: 2 },
    { room: 'E机房', count: 4 },
  ]
}

function buildTrend(): TrendData {
  const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  return {
    cpu: hours.map((hour, i) => ({
      hour,
      avg_cpu: 50 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
    })),
    mem: hours.map((hour, i) => ({
      hour,
      avg_mem: 60 + Math.cos(i * 0.2) * 15 + Math.random() * 8,
    })),
  }
}

function buildHostRank(): HostRank[] {
  return [
    { host_name: 'server-009.hismartlab.cn', room: 'C机房', avg_cpu: 91.4 },
    { host_name: 'server-010.hismartlab.cn', room: 'C机房', avg_cpu: 91.8 },
    { host_name: 'server-003.hismartlab.cn', room: 'E机房', avg_cpu: 88.5 },
    { host_name: 'server-015.hismartlab.cn', room: 'E机房', avg_cpu: 89.2 },
    { host_name: 'server-006.hismartlab.cn', room: 'E机房', avg_cpu: 82.7 },
    { host_name: 'server-020.hismartlab.cn', room: 'C机房', avg_cpu: 82.4 },
    { host_name: 'server-013.hismartlab.cn', room: 'D机房', avg_cpu: 78.3 },
    { host_name: 'server-002.hismartlab.cn', room: 'B机房', avg_cpu: 78.6 },
    { host_name: 'server-001.hismartlab.cn', room: 'A机房', avg_cpu: 75.3 },
    { host_name: 'server-018.hismartlab.cn', room: 'D机房', avg_cpu: 72.5 },
  ]
}

function buildRadar(): RadarData {
  return [
    { dimension: 'CPU使用率', value: 67.8, max: 100 },
    { dimension: '内存使用率', value: 76.2, max: 100 },
    { dimension: '网络入流量', value: 156.3, max: 1000 },
    { dimension: '磁盘IO等待', value: 18.5, max: 100 },
  ]
}

function buildAlerts(): AlertItem[] {
  return [
    { host_name: 'server-009.hismartlab.cn', room: 'C机房', mod_name: '磁盘A使用率', value: 92.4, unit: '%', collect_time: '2026-07-01 00:00:00' },
    { host_name: 'server-010.hismartlab.cn', room: 'C机房', mod_name: '磁盘B使用率', value: 95.1, unit: '%', collect_time: '2026-07-01 01:00:00' },
    { host_name: 'server-003.hismartlab.cn', room: 'E机房', mod_name: 'CPU综合使用率', value: 88.5, unit: '%', collect_time: '2026-07-01 02:00:00' },
    { host_name: 'server-015.hismartlab.cn', room: 'E机房', mod_name: 'CPU综合使用率', value: 89.2, unit: '%', collect_time: '2026-07-01 12:00:00' },
    { host_name: 'server-006.hismartlab.cn', room: 'E机房', mod_name: '磁盘C平均I/O等待时间', value: 28.7, unit: 'ms', collect_time: '2026-07-01 20:00:00' },
    { host_name: 'server-001.hismartlab.cn', room: 'A机房', mod_name: '磁盘D平均I/O等待时间', value: 31.2, unit: 'ms', collect_time: '2026-07-01 08:00:00' },
    { host_name: 'server-002.hismartlab.cn', room: 'B机房', mod_name: '磁盘E平均I/O等待时间', value: 24.3, unit: 'ms', collect_time: '2026-07-01 00:05:00' },
    { host_name: 'server-004.hismartlab.cn', room: 'A机房', mod_name: 'CPU综合使用率', value: 85.6, unit: '%', collect_time: '2026-07-01 00:10:00' },
    { host_name: 'server-005.hismartlab.cn', room: 'B机房', mod_name: '磁盘A使用率', value: 94.6, unit: '%', collect_time: '2026-07-01 23:00:00' },
    { host_name: 'server-007.hismartlab.cn', room: 'B机房', mod_name: '磁盘B使用率', value: 91.8, unit: '%', collect_time: '2026-07-01 08:00:00' },
  ]
}

function buildMap(): MapPoint[] {
  return [
    { name: '北京市', value: 7 },
    { name: '上海市', value: 4 },
    { name: '广东省', value: 5 },
    { name: '浙江省', value: 4 },
  ]
}

export function getMockData(): DashboardData {
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
