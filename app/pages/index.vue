<template>
  <section class="space-y-12">
    <div class="glass-card relative overflow-hidden p-12 text-center">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,68,255,0.25),_transparent_55%)]" aria-hidden="true" />
      <h1 class="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        Auditez votre accessibilité RGAA en quelques minutes
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
        AccessScope combine tests automatisés, contrôles assistés et validations manuelles pour produire un rapport RGAA v4.1.2 complet, conforme et exploitable.
      </p>
      <div class="mt-8 flex justify-center">
        <AuditForm @submit="startAudit" />
      </div>
    </div>
    <div v-if="auditStore.loading.value" class="flex justify-center">
      <div class="glass-card flex items-center gap-3 px-6 py-3 text-sm text-slate-600 dark:text-slate-200">
        <Icon name="lucide:scan" class="h-5 w-5 animate-spin" />
        Lancement de l'audit…
      </div>
    </div>
    <div v-if="auditStore.audit.value" class="space-y-8">
      <AuditSummary
        :score="auditStore.audit.value.score"
        :validated="auditStore.audit.value.validated"
        :applicable="auditStore.audit.value.applicable"
        :audit-id="auditStore.audit.value.id"
        :themes="auditStore.audit.value.themes"
      />
      <AssistedReviewPanel :pending="auditStore.audit.value.criteria.filter(c => c.status === 'needs_review')" />
      <RgaaGrid :criteria="auditStore.audit.value.criteria" />
      <AttestationPreview :audit-id="auditStore.audit.value.id" :attestation="auditStore.audit.value.attestation" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuditStore } from '~/composables/useAudit'
import type { AuditLaunchPayload } from '~/types/audit'
import AuditForm from '~/components/AuditForm.vue'
import AuditSummary from '~/components/AuditSummary.vue'
import RgaaGrid from '~/components/RgaaGrid.vue'
import AssistedReviewPanel from '~/components/AssistedReviewPanel.vue'
import AttestationPreview from '~/components/AttestationPreview.vue'

const auditStore = useAuditStore()

const router = useRouter()

const startAudit = async (payload: AuditLaunchPayload) => {
  const id = await auditStore.launch(payload)
  await router.push(`/audits/${id}`)
}
</script>
