// 明格大屏 BrightScreen - 全局数据类型定义

/** 核心汇总指标 */
export interface SummaryMetrics {
  /** 今日访问量 */
  todayVisits: number
  /** 实时订单数 */
  realtimeOrders: number
  /** 活跃用户数 */
  activeUsers: number
  /** 系统健康度（0-100） */
  systemHealth: number
}

/** 时间趋势数据点 */
export interface TrendPoint {
  /** 时间标签，例如 08:00 */
  time: string
  /** 访问量数值 */
  value: number
}

/** 分类占比数据 */
export interface CategoryShare {
  /** 业务分类名称 */
  name: string
  /** 占比数值 */
  value: number
}

/** 城市数据排名 */
export interface CityRank {
  /** 城市名称 */
  name: string
  /** 数据数值 */
  value: number
}

/** 雷达多维能力数据 */
export interface RadarAbility {
  /** 维度名称 */
  dimension: string
  /** 当前值 */
  value: number
  /** 目标值 */
  target: number
}

/** 实时动态/告警条目 */
export interface ActivityItem {
  /** 唯一标识 */
  id: string
  /** 时间 */
  time: string
  /** 级别：info / warning / error */
  level: 'info' | 'warning' | 'error'
  /** 动态描述 */
  message: string
}

/** 地图态势数据点 */
export interface MapPoint {
  /** 省份名称 */
  name: string
  /** 数值 */
  value: number
}

/** 大屏聚合数据（一次请求返回全部） */
export interface DashboardData {
  summary: SummaryMetrics
  trend: TrendPoint[]
  category: CategoryShare[]
  cityRank: CityRank[]
  radar: RadarAbility[]
  activity: ActivityItem[]
  map: MapPoint[]
}
