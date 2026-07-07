// 明格大屏 模拟数据集（统一存放，禁止硬编码进组件）
import type {
  ActivityItem,
  CategoryShare,
  CityRank,
  DashboardData,
  MapPoint,
  RadarAbility,
  SummaryMetrics,
  TrendPoint,
} from '@/types/dashboard'

/** 核心汇总指标 */
function buildSummary(): SummaryMetrics {
  return {
    todayVisits: 128_640,
    realtimeOrders: 3_872,
    activeUsers: 21_536,
    systemHealth: 97.4,
  }
}

/** 时间趋势数据（近 12 个时间点） */
function buildTrend(): TrendPoint[] {
  const labels = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ]
  const base = [4200, 6800, 9200, 8700, 5400, 6100, 9800, 11_200, 10_400, 7600, 8900, 12_300]
  return labels.map((time, i) => ({ time, value: base[i] }))
}

/** 分类占比数据 */
function buildCategory(): CategoryShare[] {
  return [
    { name: '电商零售', value: 38 },
    { name: '在线教育', value: 22 },
    { name: '本地生活', value: 18 },
    { name: '企业服务', value: 14 },
    { name: '其他', value: 8 },
  ]
}

/** 城市数据排名 */
function buildCityRank(): CityRank[] {
  return [
    { name: '北京', value: 9200 },
    { name: '上海', value: 8800 },
    { name: '广州', value: 7600 },
    { name: '深圳', value: 7400 },
    { name: '杭州', value: 6100 },
    { name: '成都', value: 5300 },
    { name: '武汉', value: 4700 },
    { name: '西安', value: 3900 },
  ]
}

/** 雷达多维能力数据 */
function buildRadar(): RadarAbility[] {
  return [
    { dimension: '处理能力', value: 88, target: 90 },
    { dimension: '稳定性', value: 92, target: 95 },
    { dimension: '安全性', value: 85, target: 90 },
    { dimension: '扩展性', value: 78, target: 85 },
    { dimension: '响应速度', value: 90, target: 92 },
    { dimension: '可用性', value: 95, target: 98 },
  ]
}

/** 实时动态/告警列表 */
function buildActivity(): ActivityItem[] {
  const now = Date.now()
  const make = (offset: number, level: ActivityItem['level'], message: string): ActivityItem => ({
    id: `act-${now}-${offset}`,
    time: new Date(now - offset * 1000).toLocaleTimeString('zh-CN', { hour12: false }),
    level,
    message,
  })
  return [
    make(5, 'info', '华东节点订单处理完成，耗时 32ms'),
    make(22, 'warning', '华南机房 CPU 使用率超过 80%'),
    make(48, 'info', '数据同步任务执行成功'),
    make(75, 'error', '支付网关出现短暂超时，已自动重试'),
    make(120, 'info', '新增活跃用户 +1,204'),
    make(160, 'warning', '风控系统触发 3 次异常登录预警'),
    make(210, 'info', '缓存命中率回升至 96.2%'),
    make(260, 'info', '夜间批处理任务已排期'),
  ]
}

/** 地图态势数据（省份访问量） */
function buildMap(): MapPoint[] {
  return [
    { name: '北京', value: 9200 },
    { name: '天津', value: 3200 },
    { name: '上海', value: 8800 },
    { name: '重庆', value: 4100 },
    { name: '河北', value: 5200 },
    { name: '河南', value: 6100 },
    { name: '云南', value: 2600 },
    { name: '辽宁', value: 3900 },
    { name: '黑龙江', value: 3000 },
    { name: '湖南', value: 4300 },
    { name: '安徽', value: 3700 },
    { name: '山东', value: 7200 },
    { name: '新疆', value: 1800 },
    { name: '江苏', value: 8000 },
    { name: '浙江', value: 7600 },
    { name: '江西', value: 2900 },
    { name: '湖北', value: 5000 },
    { name: '广西', value: 3100 },
    { name: '甘肃', value: 1700 },
    { name: '山西', value: 3400 },
    { name: '内蒙古', value: 2100 },
    { name: '陕西', value: 3900 },
    { name: '吉林', value: 2500 },
    { name: '福建', value: 4600 },
    { name: '贵州', value: 2300 },
    { name: '广东', value: 9800 },
    { name: '青海', value: 900 },
    { name: '西藏', value: 700 },
    { name: '四川', value: 6700 },
    { name: '宁夏', value: 800 },
    { name: '海南', value: 1200 },
    { name: '台湾', value: 1500 },
    { name: '香港', value: 2000 },
    { name: '澳门', value: 600 },
  ]
}

/** 生成完整大屏聚合数据 */
export function createDashboardMockData(): DashboardData {
  return {
    summary: buildSummary(),
    trend: buildTrend(),
    category: buildCategory(),
    cityRank: buildCityRank(),
    radar: buildRadar(),
    activity: buildActivity(),
    map: buildMap(),
  }
}

export const dashboardMockData = createDashboardMockData()
