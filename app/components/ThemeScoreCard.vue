<template>
  <article class="flex items-start justify-between rounded-2xl border border-white/20 bg-white/50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/10">
    <div>
      <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-100">{{ theme.label }}</h4>
      <p class="text-xs text-slate-500 dark:text-slate-300">{{ theme.passed }} / {{ theme.applicable }} critères conformes</p>
      <ProgressBar :value="theme.score" class="mt-3" />
    </div>
    <span class="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-300">{{ theme.score.toFixed(1) }} %</span>
  </article>
</template>

<script setup lang="ts">
import ProgressBar from './ProgressBar.vue'
import type { ThemeScore } from '~/types/audit'

defineProps<{ theme: ThemeScore }>()
</script>
