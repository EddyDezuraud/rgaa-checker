import type { Page } from 'playwright'
import type { AuditOptions } from '../audit'
import type { CriteriaResultSummary } from '~/types/audit'

export interface RuleExecutionContext {
  page: Page
  dom: string
  options: AuditOptions
}

export interface RuleResult extends CriteriaResultSummary {
  status: CriteriaResultSummary['status']
}

export interface RgaaRule {
  id: string
  label: string
  theme: string
  type: 'auto' | 'assisted' | 'manual'
  wcag: string[]
  description: string
  remediation: string
  isApplicable: (ctx: RuleExecutionContext) => Promise<boolean>
  run: (ctx: RuleExecutionContext) => Promise<RuleResult>
}
