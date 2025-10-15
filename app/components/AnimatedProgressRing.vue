<template>
  <div class="relative inline-flex items-center justify-center" role="img" :aria-label="`Score ${value}%`">
    <svg :width="size" :height="size" class="transform -rotate-90" aria-hidden="true">
      <circle
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        class="stroke-slate-200 dark:stroke-slate-800"
        :stroke-width="stroke"
        fill="transparent"
      />
      <circle
        ref="circleRef"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        class="stroke-primary-500"
        :stroke-width="stroke"
        stroke-linecap="round"
        fill="transparent"
        :style="{ strokeDasharray: circumference, strokeDashoffset }"
      />
    </svg>
    <span class="absolute text-center text-lg font-semibold text-slate-800 dark:text-slate-100">
      {{ value.toFixed(1) }}<span class="text-sm">%</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
const props = withDefaults(defineProps<{
  value: number
  size?: number
  stroke?: number
}>(), {
  size: 180,
  stroke: 16
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() => circumference.value - (props.value / 100) * circumference.value)
const circleRef = ref<SVGCircleElement | null>(null)

onMounted(() => {
  if (!circleRef.value) return
  circleRef.value.animate([
    { strokeDashoffset: circumference.value },
    { strokeDashoffset: strokeDashoffset.value }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards'
  })
})
</script>
