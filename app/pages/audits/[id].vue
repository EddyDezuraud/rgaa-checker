<template>
  <section v-if="audit" class="space-y-8" aria-live="polite">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Audit RGAA</p>
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-white">{{ audit.url }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-300">Lancé le {{ formattedDate }}</p>
      </div>
      <StatusBadge :status="statusBadge" />
    </header>
    <AuditSummary
      :score="audit.score"
      :validated="audit.validated"
      :applicable="audit.applicable"
      :audit-id="audit.id"
      :themes="audit.themes"
    />
    <AssistedReviewPanel :pending="audit.criteria.filter(c => c.status === 'needs_review')" />
    <RgaaGrid :criteria="audit.criteria" />
    <AttestationPreview :audit-id="audit.id" :attestation="audit.attestation" />
  </section>
  <div v-else class="glass-card flex items-center gap-3 px-6 py-4 text-sm text-slate-600 dark:text-slate-200">
    <Icon name="lucide:loader" class="h-5 w-5 animate-spin" />
    Chargement de l'audit…
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useAuditStore } from '~/composables/useAudit'
import StatusBadge from '~/components/StatusBadge.vue'
import AuditSummary from '~/components/AuditSummary.vue'
import RgaaGrid from '~/components/RgaaGrid.vue'
import AssistedReviewPanel from '~/components/AssistedReviewPanel.vue'
import AttestationPreview from '~/components/AttestationPreview.vue'

const route = useRoute()
const store = useAuditStore()
const audit = computed(() => store.audit.value)
const statusBadge = computed(() => {
  if (!audit.value) return 'needs_review'
  if (audit.value.status === 'completed') return 'passed'
  if (audit.value.status === 'failed') return 'failed'
  return 'needs_review'
})

const formattedDate = computed(() => audit.value ? new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short'
}).format(new Date(audit.value.createdAt)) : '')

watchEffect(async () => {
  if (route.params.id) {
    await store.refresh(String(route.params.id))
  }
})
</script>
