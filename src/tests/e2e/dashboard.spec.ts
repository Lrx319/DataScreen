import { expect, test } from '@playwright/test'

test('数据中心运行监控大屏首页渲染校验', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')

  await expect(page).toHaveTitle(/DataScreen/)

  await expect(page.getByText('数据中心运行监控大屏').first()).toBeVisible()

  await expect(page.getByText('服务器总数')).toBeVisible()
  await expect(page.getByText('平均CPU使用率')).toBeVisible()

  const canvasCount = await page.locator('canvas').count()
  expect(canvasCount).toBeGreaterThan(0)

  await expect(page.getByText('平均内存占用')).toBeVisible()

  expect(errors).toEqual([])
})
