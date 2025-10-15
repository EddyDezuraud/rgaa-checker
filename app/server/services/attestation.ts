import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { loadAuditWithCriteria } from './export'
import { chromium } from 'playwright'
import { prisma } from '../utils/prisma'

export const generateAttestationHtml = async (auditId: string) => {
  const audit = await loadAuditWithCriteria(auditId)
  if (!audit) return null
  const templatePath = join(process.cwd(), 'app/server/services/templates/attestation.html')
  const template = await readFile(templatePath, 'utf-8')
  const techList = (audit.attestation?.technologies ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(item => `<li>${item}</li>`)
    .join('')

  const doc = template
    .replace('id="audit-url"></p>', `id="audit-url">${audit.url}</p>`)
    .replace('id="status-label"></p>', `id="status-label">${audit.attestation?.statusLabel ?? 'Déclaration en cours'}</p>`)
    .replace('id="status-score"></span>', `id="status-score">${audit.score.toFixed(1)} %</span>`)
    .replace('id="scope"></p>', `id="scope">${audit.attestation?.scope ?? 'Site complet'}</p>`)
    .replace('id="limitations"></p>', `id="limitations">${audit.attestation?.limitations ?? 'À compléter'}</p>`)
    .replace('id="contact"></p>', `id="contact">${audit.attestation?.contact ?? 'accessibilite@example.com'}</p>`)
    .replace('id="appeal"></p>', `id="appeal">${audit.attestation?.appeal ?? 'Consultez les voies de recours de la DILA.'}</p>`)
    .replace('<ul id="technologies"></ul>', `<ul id="technologies">${techList}</ul>`)
  return doc
}

export const generateAttestationPdf = async (auditId: string) => {
  const html = await generateAttestationHtml(auditId)
  if (!html) return null
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  const pdf = await page.pdf({
    format: 'A4',
    displayHeaderFooter: false,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  })
  await browser.close()
  return pdf
}

export const upsertAttestation = async (auditId: string, payload: {
  statusLabel: string
  scope: string
  limitations: string
  technologies: string[]
  contact: string
  appeal: string
}) => {
  const audit = await prisma.audit.update({
    where: { id: auditId },
    data: {
      attestation: {
        upsert: {
          create: {
            statusLabel: payload.statusLabel,
            scope: payload.scope,
            score: 0,
            technologies: payload.technologies.join(', '),
            limitations: payload.limitations,
            contact: payload.contact,
            appeal: payload.appeal
          },
          update: {
            statusLabel: payload.statusLabel,
            scope: payload.scope,
            technologies: payload.technologies.join(', '),
            limitations: payload.limitations,
            contact: payload.contact,
            appeal: payload.appeal
          }
        }
      }
    },
    include: { attestation: true }
  })
  return audit.attestation
}
