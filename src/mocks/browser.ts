// 浏览器环境 MSW 启动入口（mock 模式下由 dataSource 动态加载）
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
