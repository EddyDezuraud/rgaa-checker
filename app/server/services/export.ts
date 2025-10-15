import { prisma } from '../utils/prisma'
import { JSDOM } from 'jsdom'
import { utils, write } from 'xlsx'

export const loadAuditWithCriteria = async (auditId: string) => {
  return prisma.audit.findUnique({
    where: { id: auditId },
    include: {
      criteria: {
        include: { evidences: true }
      },
      attestation: true
    }
  })
}

export const createGridJson = (audit: any) => {
  return {
    id: audit.id,
    url: audit.url,
    score: audit.score,
    criteria: audit.criteria.map((criterion: any) => ({
      id: criterion.id,
      label: criterion.label,
      theme: criterion.theme,
      type: criterion.type,
      wcag: typeof criterion.wcag === 'string' ? criterion.wcag.split(',') : criterion.wcag,
      status: criterion.status,
      description: criterion.description,
      remediation: criterion.remediation,
      evidence: criterion.evidences
    }))
  }
}

export const createGridHtml = (audit: any) => {
  const headers = ['Critère', 'Statut', 'Type', 'Thématique', 'Description', 'Remédiation']
  const rows = audit.criteria.map((criterion: any) => [
    `${criterion.criterionId} – ${criterion.label}`,
    criterion.status,
    criterion.type,
    criterion.theme,
    criterion.description,
    criterion.remediation
  ])
  const dom = new JSDOM(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Grille RGAA</title></head><body></body></html>`)
  const table = dom.window.document.createElement('table')
  const thead = dom.window.document.createElement('thead')
  const tbody = dom.window.document.createElement('tbody')
  const trHead = dom.window.document.createElement('tr')
  headers.forEach((header) => {
    const th = dom.window.document.createElement('th')
    th.textContent = header
    trHead.appendChild(th)
  })
  thead.appendChild(trHead)
  rows.forEach((row) => {
    const tr = dom.window.document.createElement('tr')
    row.forEach((cell) => {
      const td = dom.window.document.createElement('td')
      td.textContent = String(cell)
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(thead)
  table.appendChild(tbody)
  dom.window.document.body.appendChild(table)
  return dom.serialize()
}

export const createGridXlsx = (audit: any) => {
  const data = audit.criteria.map((criterion: any) => ({
    Critere: `${criterion.criterionId} – ${criterion.label}`,
    Statut: criterion.status,
    Type: criterion.type,
    Theme: criterion.theme,
    Description: criterion.description,
    Remediation: criterion.remediation
  }))
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Grille')
  return write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
