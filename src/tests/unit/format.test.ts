// 工具函数格式化测试
import { describe, expect, it } from 'vitest'
import {
  formatCompact,
  formatNumber,
  formatPercent,
  formatTime,
  formatDateTime,
} from '@/utils/format'

describe('format utils', () => {
  it('formatNumber 千分位', () => {
    expect(formatNumber(128640)).toBe('128,640')
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(NaN)).toBe('0')
  })

  it('formatPercent 百分比', () => {
    expect(formatPercent(97.4)).toBe('97.4%')
    expect(formatPercent(NaN)).toBe('0%')
  })

  it('formatCompact 万/亿单位', () => {
    expect(formatCompact(128640)).toBe('12.86万')
    expect(formatCompact(123456789)).toBe('1.23亿')
    expect(formatCompact(999)).toBe('999')
  })

  it('formatTime 补零 HH:mm:ss', () => {
    expect(formatTime(new Date(2026, 0, 1, 9, 5, 3))).toBe('09:05:03')
  })

  it('formatDateTime 格式', () => {
    expect(formatDateTime(new Date(2026, 0, 1, 9, 5, 3))).toBe('2026-01-01 09:05:03')
  })
})
