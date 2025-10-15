<template>
  <section class="glass-card p-8" aria-labelledby="attestation-title">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 id="attestation-title" class="text-xl font-semibold text-slate-800 dark:text-white">Attestation d'accessibilité</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">Document conforme au modèle officiel, disponible en HTML accessible et PDF balisé.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink :to="`/api/audits/${auditId}/attestation.html`" class="pill">Voir HTML</NuxtLink>
        <NuxtLink :to="`/api/audits/${auditId}/attestation.pdf`" class="pill">Télécharger PDF</NuxtLink>
      </div>
    </div>
    <div class="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
      <p><strong>État de conformité :</strong> {{ attestation.statusLabel }}</p>
      <p><strong>Taux de conformité :</strong> {{ attestation.score.toFixed(1) }} %</p>
      <p><strong>Périmètre :</strong> {{ attestation.scope }}</p>
      <p><strong>Technologies utilisées :</strong> {{ attestation.technologies.join(', ') }}</p>
      <p><strong>Contenus non accessibles :</strong> {{ attestation.limitations }}</p>
      <p><strong>Contact :</strong> {{ attestation.contact }}</p>
      <p><strong>Voies de recours :</strong> {{ attestation.appeal }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AttestationSummary } from '~/types/audit'

const props = defineProps<{ auditId: string; attestation: AttestationSummary }>()
</script>

<style scoped>
.pill {
  @apply rounded-full border border-white/30 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200;
}
</style>
