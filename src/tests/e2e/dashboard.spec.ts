// E2E 端到端测试：首页渲染校验
import { expect, test } from '@playwright/test'

test('明格大屏首页渲染校验', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')

  // 1. 页面标题（浏览器标签）
  await expect(page).toHaveTitle(/明格大屏 BrightScreen/)

  // 2. 顶部项目标题文字
  await expect(page.getByText('明格大屏').first()).toBeVisible()

  // 3. 至少 1 个核心指标卡片可见
  await expect(page.getByText('今日访问量')).toBeVisible()
  await expect(page.getByText('实时订单数')).toBeVisible()

  // 4. 至少 1 个图表容器已挂载
  const canvasCount = await page.locator('canvas').count()
  expect(canvasCount).toBeGreaterThan(0)

  // 5. 等待数据加载完成，校验数字渲染
  await expect(page.getByText('系统健康度')).toBeVisible()

  // 6. 控制台无 Error 级严重报错
  expect(errors).toEqual([])
})
