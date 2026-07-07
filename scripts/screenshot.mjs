// 自动化截图脚本：独立启动 Vite 预览服务，加载大屏页面并截图到 docs/assets
// 使用：node scripts/screenshot.mjs   （或 npm run screenshot）
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const PORT = Number(process.env.SCREENSHOT_PORT || 5199)
const TARGET = `http://127.0.0.1:${PORT}/`
const OUT_DIR = join(root, 'docs', 'assets')
const OUT_FILE = join(OUT_DIR, 'dashboard-preview.png')

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return true
    } catch {
      // 服务尚未就绪，继续等待
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js')
  if (!existsSync(viteBin)) {
    console.error('[screenshot] 未找到 vite，请先执行 npm install')
    process.exit(1)
  }

  // 独立启动一个临时开发服务（严格占用专用端口，避免与本机其它服务冲突）
  const server = spawn(process.execPath, [viteBin, '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: 'ignore',
  })

  let exitCode = 0
  try {
    const ready = await waitForServer(TARGET)
    if (!ready) {
      console.error('[screenshot] 开发服务启动超时')
      exitCode = 1
    } else {
      const browser = await chromium.launch()
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
      })
      await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 30000 })
      // 等待核心图表挂载并完成数据渲染
      await page.waitForSelector('.dashboard__col--center canvas', { timeout: 30000 })
      await page.waitForTimeout(3500)
      await page.screenshot({ path: OUT_FILE })
      console.log(`[screenshot] 截图已生成 -> ${OUT_FILE}`)
      await browser.close()
    }
  } catch (e) {
    console.error('[screenshot] 执行失败:', e)
    exitCode = 1
  } finally {
    server.kill('SIGKILL')
  }
  process.exit(exitCode)
}

main()
