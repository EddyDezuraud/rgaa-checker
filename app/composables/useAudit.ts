import type { AuditLaunchPayload, AttestationSummary, CriteriaResultSummary, ThemeScore } from '~/types/audit'

export interface AuditDetail {
  id: string
  url: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  score: number
  applicable: number
  validated: number
  createdAt: string
  criteria: CriteriaResultSummary[]
  themes: ThemeScore[]
  attestation: AttestationSummary
}

export const useAuditStore = () => {
  const audit = useState<AuditDetail | null>('audit-detail', () => null)
  const loading = useState('audit-loading', () => false)

  const launch = async (payload: AuditLaunchPayload) => {
    loading.value = true
    try {
      const { id } = await $fetch<{ id: string }>('/api/audits', {
        method: 'POST',
        body: payload
      })
      await refresh(id)
      return id
    } finally {
      loading.value = false
    }
  }

  const refresh = async (id: string) => {
    audit.value = await $fetch<AuditDetail>(`/api/audits/${id}`)
  }

  return {
    audit,
    loading,
    launch,
    refresh
  }
}
