<template>
  <section class="grid gap-8 lg:grid-cols-2" aria-label="Synthèse de l'audit">
    <div class="glass-card flex flex-col items-center justify-center gap-6 p-8 text-center">
      <AnimatedProgressRing :value="score" :size="220" />
      <h2 class="text-2xl font-semibold text-slate-800 dark:text-white">Conformité globale</h2>
      <p class="max-w-sm text-sm text-slate-600 dark:text-slate-300">
        Score basé sur {{ validated }} critères validés sur {{ applicable }} applicables.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink :to="`/api/audits/${auditId}/grid.html`" class="pill">Grille HTML</NuxtLink>
        <NuxtLink :to="`/api/audits/${auditId}/grid.json`" class="pill">JSON</NuxtLink>
        <NuxtLink :to="`/api/audits/${auditId}/grid.xlsx`" class="pill">XLSX</NuxtLink>
        <NuxtLink :to="`/api/audits/${auditId}/attestation.pdf`" class="pill">Attestation PDF</NuxtLink>
      </div>
    </div>
    <div class="glass-card p-8">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-white">Thématiques</h3>
      <ul class="mt-6 grid gap-4">
        <li v-for="theme in themes" :key="theme.id">
          <ThemeScoreCard :theme="theme" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import ThemeScoreCard from './ThemeScoreCard.vue'
import AnimatedProgressRing from './AnimatedProgressRing.vue'
import type { ThemeScore } from '~/types/audit'

defineProps<{
  score: number
  validated: number
  applicable: number
  auditId: string
  themes: Array<ThemeScore>
}>()
</script>

<style scoped>
.pill {
  @apply rounded-full border border-white/30 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20;
}
</style>
