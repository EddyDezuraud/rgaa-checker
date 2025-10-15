import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { createScoreCalculator } from '../../../utils/score'

const schema = z.object({
  criterionId: z.string(),
  status: z.enum(['passed', 'failed', 'needs_review'])
})

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing audit id' })
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload', data: parsed.error.flatten() })
  }

  const criterion = await prisma.criteriaResult.update({
    where: { id: parsed.data.criterionId },
    data: { status: parsed.data.status }
  })

  const audit = await prisma.audit.findUnique({
    where: { id },
    include: { criteria: true }
  })
  if (!audit) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }

  const calculator = createScoreCalculator(audit.criteria as any)
  const { score, applicable, validated } = calculator.compute()
  await prisma.audit.update({
    where: { id },
    data: {
      score,
      applicable,
      validated
    }
  })

  return { score, applicable, validated }
})
