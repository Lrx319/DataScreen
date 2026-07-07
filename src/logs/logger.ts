// 可扩展全局日志系统
// 默认：开发环境打印至浏览器控制台；预留对接 Sentry 等线上监控平台

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogTransport {
  log(level: LogLevel, message: string, meta?: unknown): void
}

/** 控制台传输（默认） */
const consoleTransport: LogTransport = {
  log(level, message, meta) {
    const tag = '[BrightScreen]'
    const payload = meta !== undefined ? [message, meta] : [message]
    switch (level) {
      case 'info':
        console.info(tag, ...payload)
        break
      case 'warn':
        console.warn(tag, ...payload)
        break
      case 'error':
        console.error(tag, ...payload)
        break
      case 'debug':
        console.debug(tag, ...payload)
        break
    }
  },
}

export class Logger {
  private transports: LogTransport[] = []
  private isDev = import.meta.env.DEV

  constructor() {
    // 开发环境默认启用控制台输出
    if (this.isDev) {
      this.addTransport(consoleTransport)
    }
  }

  /** 添加日志传输通道（如对接 Sentry：logger.addTransport(sentryTransport)） */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport)
  }

  /** 设置是否处于开发模式（控制控制台输出） */
  setDevMode(isDev: boolean): void {
    this.isDev = isDev
  }

  info(message: string, meta?: unknown): void {
    this.dispatch('info', message, meta)
  }

  warn(message: string, meta?: unknown): void {
    this.dispatch('warn', message, meta)
  }

  error(message: string, meta?: unknown): void {
    this.dispatch('error', message, meta)
  }

  debug(message: string, meta?: unknown): void {
    this.dispatch('debug', message, meta)
  }

  private dispatch(level: LogLevel, message: string, meta?: unknown): void {
    // 无论如何，开发环境确保控制台可见
    if (this.isDev && !this.transports.includes(consoleTransport)) {
      consoleTransport.log(level, message, meta)
    }
    for (const transport of this.transports) {
      transport.log(level, message, meta)
    }
  }
}

export const logger = new Logger()
export default logger
