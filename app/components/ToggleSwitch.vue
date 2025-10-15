<template>
  <label class="flex items-center justify-between rounded-2xl border border-white/20 bg-white/40 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
    <span>{{ label }}</span>
    <button
      type="button"
      class="relative inline-flex h-6 w-11 items-center rounded-full transition"
      :class="modelValue ? 'bg-primary-500' : 'bg-slate-400 dark:bg-slate-700'"
      role="switch"
      :aria-checked="modelValue"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <span class="sr-only">{{ label }}</span>
      <span
        class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
        :class="modelValue ? 'translate-x-5' : 'translate-x-1'"
      />
    </button>
  </label>
</template>

<script setup lang="ts">
defineProps<{ label: string; modelValue: boolean }>()

defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>
