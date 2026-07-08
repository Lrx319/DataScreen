export interface SummaryMetrics {
  serverCount: number
  avgCpuUsage: number
  avgDiskIoWait: number
  avgMemUsage: number
}

export interface TrendData {
  hour: string
  avg_cpu: number
  avg_mem: number
}

export interface RoomStats {
  room: string
  count: number
}

export interface HostRank {
  host_name: string
  room: string
  avg_cpu: number
}

export interface RadarAbility {
  dimension: string
  value: number
  max: number
}

export interface AlertItem {
  host_name: string
  room: string
  mod_name: string
  value: number
  unit: string
  collect_time: string
}

export interface MapPoint {
  name: string
  value: number
}

export interface DashboardData {
  summary: SummaryMetrics
  roomStats: RoomStats[]
  trend: { cpu: { hour: string; avg_cpu: number }[]; mem: { hour: string; avg_mem: number }[] }
  hostRank: HostRank[]
  radar: RadarAbility[]
  alerts: AlertItem[]
  map: MapPoint[]
}
