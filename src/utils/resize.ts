// 大屏自适应缩放工具：基于 1920x1080 设计稿，等比缩放铺满窗口

/**
 * 计算缩放比例：保持宽高比，取宽、高缩放比例的最小值（contain 模式）
 */
export function getScreenScale(
  baseWidth = 1920,
  baseHeight = 1080,
): { scale: number; x: number; y: number } {
  const scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight)
  return {
    scale,
    x: scale,
    y: scale,
  }
}

/**
 * 注册窗口缩放监听，返回移除监听的函数
 * @param callback 缩放变化时回调，参数为当前 scale
 */
export function onScreenResize(callback: (scale: number) => void): () => void {
  const handler = () => callback(getScreenScale().scale)
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}
