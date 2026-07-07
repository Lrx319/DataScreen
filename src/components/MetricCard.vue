<script setup lang="ts">
// 核心指标卡片
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    unit?: string
    color?: string
    icon?: string
  }>(),
  { unit: '', color: '#22d3ee', icon: '' },
)

const displayValue = computed(() => props.value)
</script>

<template>
  <div class="metric-card" :style="{ '--card-color': color }">
    <div v-if="icon" class="metric-card__icon">{{ icon }}</div>
    <div class="metric-card__content">
      <div class="metric-card__label">{{ label }}</div>
      <div class="metric-card__value">
        {{ displayValue }}<span v-if="unit" class="metric-card__unit">{{ unit }}</span>
      </div>
    </div>
    <div class="metric-card__glow" />
  </div>
</template>

<style scoped>
.metric-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(13, 38, 76, 0.7), rgba(6, 18, 39, 0.7));
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-left: 3px solid var(--card-color);
  overflow: hidden;
}

.metric-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  font-size: 24px;
  border-radius: 50%;
  background: rgba(34, 211, 238, 0.12);
  color: var(--card-color);
}

.metric-card__label {
  font-size: 13px;
  color: var(--bs-text-dim);
  letter-spacing: 1px;
}

.metric-card__value {
  margin-top: 4px;
  font-size: 30px;
  font-weight: 700;
  color: var(--bs-text);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.35);
}

.metric-card__unit {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--bs-text-dim);
}

.metric-card__glow {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--card-color);
  opacity: 0.12;
  filter: blur(20px);
}
</style>
