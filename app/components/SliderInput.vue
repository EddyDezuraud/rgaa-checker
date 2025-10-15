<template>
  <label class="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/40 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
    <span class="flex items-center justify-between">
      <span>{{ label }}</span>
      <span class="text-xs font-semibold text-primary-500">{{ modelValue }}{{ suffix }}</span>
    </span>
    <input
      :value="modelValue"
      type="range"
      class="accent-primary-500"
      :min="min"
      :max="max"
      :step="step"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    >
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
  suffix?: string
}>(), {
  min: 100,
  max: 200,
  step: 25,
  suffix: ''
})

defineEmits<{ (e: 'update:modelValue', value: number): void }>()
</script>
