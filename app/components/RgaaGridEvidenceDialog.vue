<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6 backdrop-blur" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <div class="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">
      <header class="flex items-start justify-between">
        <div>
          <h3 id="dialog-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ criterion.label }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-300">Thématique : {{ criterion.theme }} · Type : {{ criterion.type }}</p>
        </div>
        <button type="button" class="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:bg-slate-800 dark:text-slate-300" @click="$emit('close')">
          <Icon name="lucide:x" class="h-5 w-5" />
          <span class="sr-only">Fermer</span>
        </button>
      </header>
      <section class="mt-6 space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Preuves</h4>
          <ul class="mt-3 grid gap-3">
            <li v-for="evidence in criterion.evidence" :key="evidence.id" class="rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <p v-if="evidence.type === 'screenshot'">
                <NuxtLink :to="evidence.path" class="text-primary-500 underline" target="_blank">Ouvrir la capture</NuxtLink>
              </p>
              <p v-else-if="evidence.type === 'dom'">Extrait DOM : <code class="rounded bg-slate-900/80 px-2 py-1 text-xs text-white">{{ evidence.snippet }}</code></p>
              <p v-else>{{ evidence.description }}</p>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Recommandation</h4>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ criterion.remediation }}</p>
        </div>
        <div v-if="criterion.type !== 'auto'">
          <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Validation manuelle</h4>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">Confirmez l'état du critère pour recalculer le score.</p>
          <div class="mt-3 flex gap-3">
            <button type="button" class="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105" @click="submitReview('passed')">Conforme</button>
            <button type="button" class="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105" @click="submitReview('failed')">Non conforme</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CriteriaResultSummary } from '~/types/audit'
import { useToast } from '~/composables/useToast'

const props = defineProps<{ criterion: CriteriaResultSummary }>()

const submitReview = async (status: 'passed' | 'failed') => {
  await $fetch(`/api/audits/${props.criterion.auditId}/reviews`, {
    method: 'POST',
    body: {
      criterionId: props.criterion.id,
      status
    }
  })
  useToast().add({ title: 'Revue enregistrée', description: 'Le score a été recalculé.' })
}
</script>
