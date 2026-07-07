// Axios 请求工具封装（统一拦截、日志、错误处理）
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { logger } from '@/logs/logger'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截：记录请求日志
http.interceptors.request.use(
  (config) => {
    logger.debug('[http] request', { url: config.url, method: config.method })
    return config
  },
  (error) => {
    logger.error('[http] request error', error)
    return Promise.reject(error)
  },
)

// 响应拦截：统一解包与错误日志
http.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug('[http] response', { url: response.config.url, status: response.status })
    return response
  },
  (error) => {
    logger.error('[http] response error', error?.message ?? error)
    return Promise.reject(error)
  },
)

export default http
export { http }
