import { chromium } from 'playwright'
import { createHash } from 'node:crypto'
import { getRgaaRules } from './rgaa'
import { createScoreCalculator } from '../utils/score'
import { saveEvidenceAssets } from './storage'
import { prisma } from '../utils/prisma'
import type { AuditOptionTheme, AuditOptionViewport } from '~/types/audit'

export interface AuditOptions {
  viewport: AuditOptionViewport
  zoom: number
  cssOff: boolean
  reducedMotion: boolean
  theme: AuditOptionTheme
}

export interface AuditContext {
  page: Awaited<ReturnType<typeof chromium.launchPersistentContext>>
  dom: string
  styles: string
  ariaTree: any
  tabOrder: string[]
}

export interface AuditResultPayload {
  auditId: string
  domHash: string
  engineVersion: string
  criteria: Awaited<ReturnType<ReturnType<typeof getRgaaRules>['run']>>
}

export const AUDIT_ENGINE_VERSION = '2024.04.01'

export async function runAudit (auditId: string, url: string, options: AuditOptions) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    deviceScaleFactor: options.zoom / 100,
    viewport: options.viewport === 'mobile'
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 }
  })

  if (options.reducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  }

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })

  if (options.cssOff) {
    await page.addStyleTag({ content: '* { all: unset !important; }' })
  }

  if (options.theme !== 'system') {
    await page.evaluate((theme) => {
      document.documentElement.setAttribute('data-theme', theme)
    }, options.theme)
  }

  const dom = await page.content()
  const domHash = createHash('sha256').update(dom).digest('hex')

  const rules = getRgaaRules()
  const context = await rules.createContext({ page, dom, options })
  const criteria = (await rules.run(context)).map((criterion) => ({
    ...criterion,
    auditId,
    evidence: criterion.evidence ?? []
  }))

  const scoreCalculator = createScoreCalculator(criteria)
  const { score, applicable, validated } = scoreCalculator.compute()

  await prisma.audit.update({
    where: { id: auditId },
    data: {
      status: 'COMPLETED',
      domHash,
      engineVersion: AUDIT_ENGINE_VERSION,
      score,
      applicable,
      validated,
      criteria: {
        deleteMany: {},
        create: criteria.map((criterion) => ({
          criterionId: criterion.id,
          label: criterion.label,
          theme: criterion.theme,
          type: criterion.type,
          wcag: criterion.wcag.join(','),
          status: criterion.status,
          description: criterion.description,
          remediation: criterion.remediation,
          evidences: {
            create: (criterion.evidence ?? []).map(evidence => ({
              type: evidence.type,
              path: evidence.path ?? null,
              snippet: evidence.snippet ?? null,
              description: evidence.description ?? null
            }))
          }
        }))
      }
    },
    include: {
      criteria: true
    }
  })

  await saveEvidenceAssets(auditId, criteria)

  await browser.close()
}

export async function createAudit (url: string, options: AuditOptions) {
  const audit = await prisma.audit.create({
    data: {
      url,
      options,
      status: 'PENDING'
    }
  })
  return audit
}
