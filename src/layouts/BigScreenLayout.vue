<script setup lang="ts">
// 大屏整体布局：基于 1920x1080 设计稿等比缩放铺满窗口
import { onMounted, ref } from 'vue'
import { getScreenScale, onScreenResize } from '@/utils/resize'

const scale = ref(getScreenScale().scale)

onMounted(() => {
  const stop = onScreenResize((s) => (scale.value = s))
  // 组件卸载时清理（布局通常常驻，这里仅做防御）
  window.addEventListener('beforeunload', stop)
})
</script>

<template>
  <div class="big-screen">
    <div
      class="big-screen__stage"
      :style="{
        transform: `translate(-50%, -50%) scale(${scale})`,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.big-screen {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--bs-bg-grad);
  overflow: hidden;
}

.big-screen__stage {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  display: flex;
  flex-direction: column;
}
</style>
