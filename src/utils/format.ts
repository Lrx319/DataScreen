// 全局数值/时间格式化工具

/**
 * 千分位格式化数字
 * @param value 待格式化数值
 * @param digits 保留小数位数，默认 0
 */
export function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '0'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * 百分比格式化
 * @param value 0-100 的数值
 */
export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '0%'
  return `${value.toFixed(digits)}%`
}

/**
 * 将数值格式化为带单位的紧凑字符串（万 / 亿）
 */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (value >= 1e8) return `${(value / 1e8).toFixed(2)}亿`
  if (value >= 1e4) return `${(value / 1e4).toFixed(2)}万`
  return formatNumber(value)
}

/**
 * 补零格式化时间分量
 */
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

/**
 * 格式化日期时间为 HH:mm:ss
 */
export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * 格式化日期为 YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date): string {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  return `${y}-${m}-${d} ${formatTime(date)}`
}
