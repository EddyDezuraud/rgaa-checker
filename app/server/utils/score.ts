import type { CriterionStatus, CriteriaResultSummary } from '~/types/audit'

type Criterion = CriteriaResultSummary & { scoreWeight?: number }

export const createScoreCalculator = (criteria: Criterion[]) => {
  const compute = () => {
    const applicableCriteria = criteria.filter(c => c.status !== 'not_applicable')
    const applicable = applicableCriteria.length
    const validated = applicableCriteria.filter(c => c.status === 'passed').length
    const score = applicable === 0 ? 0 : Number(((validated / applicable) * 100).toFixed(1))
    return {
      score,
      applicable,
      validated
    }
  }

  const updateStatus = (criterionId: string, status: CriterionStatus) => {
    const criterion = criteria.find(c => c.id === criterionId)
    if (criterion) {
      criterion.status = status
    }
    return compute()
  }

  return {
    compute,
    updateStatus
  }
}
