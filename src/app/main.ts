// 明格大屏 BrightScreen 应用入口
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { initDataSource } from '@/services/dataSource'
import { logger } from '@/logs/logger'
import '@/assets/global.css'

async function bootstrap() {
  await initDataSource()
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
  logger.info('[app] BrightScreen mounted')
}

bootstrap().catch((err) => {
  logger.error('[app] bootstrap failed', err)
})
