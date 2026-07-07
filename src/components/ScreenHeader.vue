<script setup lang="ts">
// 顶部标题栏：项目标题 + 实时系统时间
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { formatDateTime } from '@/utils/format'

const now = ref(formatDateTime(new Date()))
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = formatDateTime(new Date())
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__side screen-header__side--left">
      <span class="screen-header__tag">REAL-TIME</span>
      <span class="screen-header__date">{{ now.split(' ')[0] }}</span>
    </div>
    <h1 class="screen-header__title">
      <span class="screen-header__cn">明格大屏</span>
      <span class="screen-header__en">BrightScreen</span>
    </h1>
    <div class="screen-header__side screen-header__side--right">
      <span class="screen-header__time">{{ now.split(' ')[1] }}</span>
      <span class="screen-header__tag">DATA VISUAL</span>
    </div>
  </header>
</template>

<style scoped>
.screen-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.screen-header::after {
  content: '';
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 6px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--bs-primary), transparent);
}

.screen-header__title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-weight: 800;
  letter-spacing: 4px;
}

.screen-header__cn {
  font-size: 30px;
  background: linear-gradient(90deg, #fff, var(--bs-primary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.screen-header__en {
  font-size: 18px;
  letter-spacing: 6px;
  color: var(--bs-primary-2);
}

.screen-header__side {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.screen-header__side--right {
  justify-content: flex-end;
}

.screen-header__time {
  font-size: 22px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--bs-text);
}

.screen-header__date {
  font-size: 14px;
  color: var(--bs-text-dim);
}

.screen-header__tag {
  padding: 2px 8px;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--bs-primary);
  border: 1px solid rgba(34, 211, 238, 0.4);
  border-radius: 4px;
}
</style>
