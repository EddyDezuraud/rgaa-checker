<template>
  <section class="glass-card p-8" aria-labelledby="assisted-title">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 id="assisted-title" class="text-xl font-semibold text-slate-800 dark:text-white">Contrôles assistés</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">Validez les critères nécessitant une interprétation humaine.</p>
      </div>
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ pending.length }} en attente</p>
    </div>

    <TransitionGroup name="fade-up" tag="div" class="mt-6 grid gap-4 md:grid-cols-2">
      <article v-for="criterion in pending" :key="criterion.id" class="rounded-3xl border border-white/20 bg-white/60 p-6 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/10">
        <header class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-slate-800 dark:text-white">{{ criterion.label }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-300">{{ criterion.theme }} · {{ criterion.type.toUpperCase() }}</p>
          </div>
          <StatusBadge :status="criterion.status" />
        </header>
        <p class="mt-4 text-sm text-slate-600 dark:text-slate-300">{{ criterion.description }}</p>
        <div class="mt-4 space-y-3">
          <button
            v-for="action in actions"
            :key="action.value"
            type="button"
            class="w-full rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-primary-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            @click="submitReview(criterion.id, action.value)"
          >
            {{ action.label }}
          </button>
        </div>
      </article>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import type { CriteriaResultSummary } from '~/types/audit'
import { useToast } from '~/composables/useToast'

const props = defineProps<{ pending: CriteriaResultSummary[] }>()

const actions = [
  { value: 'passed', label: 'Je confirme : conforme' },
  { value: 'failed', label: 'Je confirme : non conforme' },
  { value: 'needs_review', label: 'À revoir plus tard' }
] as const

const submitReview = async (criterionId: string, status: CriteriaResultSummary['status']) => {
  await $fetch(`/api/audits/${props.pending[0]?.auditId ?? ''}/reviews`, {
    method: 'POST',
    body: {
      criterionId,
      status
    }
  })
  useToast().add({ title: 'Contrôle mis à jour', description: 'Merci pour votre expertise !' })
}
</script>
