<template>
  <div class="relative h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
    <div
      class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 shadow-lg"
      :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number }>()
</script>
