<template>
  <div class="space-y-2">
    <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{{ label }}</span>
    <div role="radiogroup" class="flex gap-2">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition"
        :class="[
          modelValue === item.value
            ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-200'
            : 'border-white/20 bg-white/30 text-slate-600 hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:text-slate-300'
        ]"
        role="radio"
        :aria-checked="modelValue === item.value"
        @click="$emit('update:modelValue', item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  items: Array<{ label: string; value: string }>
  modelValue: string
}>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
