// 双数据源切换机制（环境变量驱动）
import { logger } from '@/logs/logger'

export type DataSourceMode = 'mock' | 'api'

/** 读取当前数据源模式，默认 mock */
export function getDataSourceMode(): DataSourceMode {
  const mode = import.meta.env.VITE_DATA_SOURCE
  return mode === 'api' ? 'api' : 'mock'
}

/**
 * 初始化数据源：
 * - mock：启动 MSW 拦截请求，返回模拟数据
 * - api：不启动 MSW，axios 直接请求真实后端（预留完整逻辑，业务组件无需改动）
 */
export async function initDataSource(): Promise<void> {
  const mode = getDataSourceMode()
  logger.info(`[dataSource] mode = ${mode}`)

  if (mode === 'mock') {
    // 动态加载避免打包进 api 模式产物
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    })
    logger.info('[dataSource] MSW worker started')
  } else {
    logger.info('[dataSource] using real API at', import.meta.env.VITE_API_BASE_URL)
  }
}
