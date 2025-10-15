import { describe, it, expect } from 'vitest'
import { createScoreCalculator } from '~/server/utils/score'

describe('score calculator', () => {
  it('computes the correct percentage with rounding', () => {
    const calculator = createScoreCalculator([
      { id: '1', status: 'passed' } as any,
      { id: '2', status: 'passed' } as any,
      { id: '3', status: 'failed' } as any
    ])
    expect(calculator.compute()).toEqual({ score: 66.7, applicable: 3, validated: 2 })
  })

  it('updates status and recomputes score', () => {
    const calculator = createScoreCalculator([
      { id: '1', status: 'needs_review' } as any,
      { id: '2', status: 'passed' } as any
    ])
    calculator.updateStatus('1', 'passed')
    expect(calculator.compute()).toEqual({ score: 100, applicable: 2, validated: 2 })
  })
})
