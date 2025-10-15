import { loadAutoRules } from './rules/auto'
import { loadAssistedRules } from './rules/assisted'
import { loadManualRules } from './rules/manual'
import type { RgaaRule, RuleExecutionContext } from './types'

export const getRgaaRules = () => {
  const rules: RgaaRule[] = [
    ...loadAutoRules(),
    ...loadAssistedRules(),
    ...loadManualRules()
  ]

  const createContext = async (ctx: RuleExecutionContext) => {
    return ctx
  }

  const run = async (ctx: RuleExecutionContext) => {
    const results = [] as Awaited<ReturnType<RgaaRule['run']>>[]
    for (const rule of rules) {
      const applicable = await rule.isApplicable(ctx)
      if (!applicable) continue
      const result = await rule.run(ctx)
      results.push(result)
    }
    return results
  }

  return {
    createContext,
    run,
    rules
  }
}
