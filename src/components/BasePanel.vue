<script setup lang="ts">
// 通用面板容器组件
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  { title: '', subtitle: '' },
)

const hasHeader = computed(() => props.title || props.subtitle)
</script>

<template>
  <section class="base-panel">
    <header v-if="hasHeader" class="base-panel__header">
      <span class="base-panel__bar" />
      <h3 class="base-panel__title">{{ title }}</h3>
      <span v-if="subtitle" class="base-panel__subtitle">{{ subtitle }}</span>
      <slot name="extra" />
    </header>
    <div class="base-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.base-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bs-panel-bg);
  border: 1px solid var(--bs-panel-border);
  border-radius: 10px;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 0 24px rgba(34, 211, 238, 0.06);
  overflow: hidden;
}

.base-panel::before,
.base-panel::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: var(--bs-primary);
  border-style: solid;
}
.base-panel::before {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
}
.base-panel::after {
  bottom: -1px;
  right: -1px;
  border-width: 0 2px 2px 0;
}

.base-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
}

.base-panel__bar {
  width: 4px;
  height: 14px;
  background: linear-gradient(180deg, var(--bs-primary), var(--bs-primary-2));
  border-radius: 2px;
}

.base-panel__title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--bs-text);
}

.base-panel__subtitle {
  font-size: 12px;
  color: var(--bs-text-dim);
}

.base-panel__body {
  flex: 1;
  min-height: 0;
  padding: 10px 12px;
}
</style>
