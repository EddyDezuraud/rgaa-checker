<template>
  <section class="glass-card p-8" aria-labelledby="grid-title">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 id="grid-title" class="text-xl font-semibold text-slate-800 dark:text-white">Grille RGAA</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">Filtrez les critères par thématique, statut et type de contrôle.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <select v-model="filters.theme" class="filter">
          <option value="all">Toutes thématiques</option>
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
        <select v-model="filters.status" class="filter">
          <option value="all">Tous statuts</option>
          <option value="passed">Conforme</option>
          <option value="failed">Non conforme</option>
          <option value="needs_review">À valider</option>
        </select>
        <select v-model="filters.type" class="filter">
          <option value="all">Tous types</option>
          <option value="auto">Automatique</option>
          <option value="assisted">Assisté</option>
          <option value="manual">Manuel</option>
        </select>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-3xl border border-white/20 dark:border-white/10">
      <table class="min-w-full divide-y divide-white/10 text-left text-sm text-slate-700 dark:text-slate-200">
        <thead class="bg-white/60 text-xs uppercase tracking-wide text-slate-500 backdrop-blur-md dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th scope="col" class="px-6 py-4">Critère</th>
            <th scope="col" class="px-6 py-4">Statut</th>
            <th scope="col" class="px-6 py-4">Type</th>
            <th scope="col" class="px-6 py-4">Thématique</th>
            <th scope="col" class="px-6 py-4">Preuves</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10 bg-white/70 backdrop-blur dark:divide-white/5 dark:bg-white/5">
          <tr v-for="criterion in filtered" :key="criterion.id" class="transition hover:bg-primary-500/5">
            <th scope="row" class="px-6 py-4">
              <p class="font-semibold">{{ criterion.label }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">WCAG {{ criterion.wcag.join(', ') }}</p>
            </th>
            <td class="px-6 py-4">
              <StatusBadge :status="criterion.status" />
            </td>
            <td class="px-6 py-4 capitalize">{{ criterion.type }}</td>
            <td class="px-6 py-4">{{ criterion.theme }}</td>
            <td class="px-6 py-4">
              <button
                v-if="criterion.evidence?.length"
                type="button"
                class="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 transition hover:bg-primary-500/20"
                @click="activeCriterion = criterion"
              >
                Voir ({{ criterion.evidence.length }})
              </button>
              <span v-else class="text-xs text-slate-400">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Dialog v-if="activeCriterion" :criterion="activeCriterion" @close="activeCriterion = null" />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import StatusBadge from './StatusBadge.vue'
import EvidenceDialog from './RgaaGridEvidenceDialog.vue'
import type { CriteriaResultSummary } from '~/types/audit'

const props = defineProps<{ criteria: CriteriaResultSummary[] }>()

const filters = reactive({ theme: 'all', status: 'all', type: 'all' })

const themes = computed(() => Array.from(new Set(props.criteria.map(c => c.theme))).sort())
const filtered = computed(() => props.criteria.filter((criterion) => {
  return (filters.theme === 'all' || criterion.theme === filters.theme) &&
    (filters.status === 'all' || criterion.status === filters.status) &&
    (filters.type === 'all' || criterion.type === filters.type)
}))

const activeCriterion = ref<CriteriaResultSummary | null>(null)

const Dialog = EvidenceDialog
</script>

<style scoped>
.filter {
  @apply rounded-full border border-white/20 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600 backdrop-blur transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200;
}
</style>
