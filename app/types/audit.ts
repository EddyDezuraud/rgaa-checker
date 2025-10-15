export type AuditOptionViewport = 'desktop' | 'mobile'
export type AuditOptionTheme = 'system' | 'light' | 'dark'

export interface AuditLaunchPayload {
  url: string
  viewport: AuditOptionViewport
  zoom: number
  cssOff: boolean
  reducedMotion: boolean
  theme: AuditOptionTheme
}

export type CriterionStatus = 'passed' | 'failed' | 'needs_review' | 'not_applicable'
export type CriterionType = 'auto' | 'assisted' | 'manual'

export interface CriteriaResultSummary {
  id: string
  auditId: string
  criterionId: string
  label: string
  theme: string
  type: CriterionType
  wcag: string[]
  status: CriterionStatus
  description: string
  remediation: string
  evidence: Array<{
    id: string
    type: 'screenshot' | 'dom' | 'note'
    path?: string
    snippet?: string
    description?: string
  }>
}

export interface ThemeScore {
  id: string
  label: string
  score: number
  passed: number
  applicable: number
}

export interface AttestationSummary {
  statusLabel: string
  scope: string
  score: number
  technologies: string[]
  limitations: string
  contact: string
  appeal: string
}
