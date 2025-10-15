import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const audit = await prisma.audit.findUnique({
    where: { id },
    include: {
      criteria: {
        include: {
          evidences: true
        }
      },
      attestation: true
    }
  })

  if (!audit) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }

  return {
    id: audit.id,
    url: audit.url,
    status: audit.status.toLowerCase(),
    score: audit.score,
    applicable: audit.applicable,
    validated: audit.validated,
    createdAt: audit.createdAt,
    criteria: audit.criteria.map((criterion) => ({
      id: criterion.id,
      auditId: criterion.auditId,
      criterionId: criterion.criterionId,
      label: criterion.label,
      theme: criterion.theme,
      type: criterion.type as any,
      wcag: criterion.wcag.split(','),
      status: criterion.status as any,
      description: criterion.description,
      remediation: criterion.remediation,
      evidence: criterion.evidences.map((evidence) => ({
        id: evidence.id,
        type: evidence.type as any,
        path: evidence.path ?? undefined,
        snippet: evidence.snippet ?? undefined,
        description: evidence.description ?? undefined
      }))
    })),
    themes: aggregateThemes(audit.criteria),
    attestation: audit.attestation
      ? {
          statusLabel: audit.attestation.statusLabel,
          scope: audit.attestation.scope,
          score: audit.attestation.score,
          technologies: audit.attestation.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean),
          limitations: audit.attestation.limitations,
          contact: audit.attestation.contact,
          appeal: audit.attestation.appeal
        }
      : {
          statusLabel: 'En cours',
          scope: 'Périmètre à définir',
          score: audit.score,
          technologies: [],
          limitations: '',
          contact: '',
          appeal: ''
        }
  }
})

const aggregateThemes = (criteria: any[]) => {
  const map = new Map<string, { passed: number; applicable: number }>()
  criteria.forEach((criterion) => {
    const entry = map.get(criterion.theme) ?? { passed: 0, applicable: 0 }
    if (criterion.status !== 'not_applicable') {
      entry.applicable += 1
      if (criterion.status === 'passed') {
        entry.passed += 1
      }
    }
    map.set(criterion.theme, entry)
  })

  return Array.from(map.entries()).map(([theme, { passed, applicable }]) => ({
    id: theme,
    label: theme,
    passed,
    applicable,
    score: applicable === 0 ? 0 : Number(((passed / applicable) * 100).toFixed(1))
  }))
}
