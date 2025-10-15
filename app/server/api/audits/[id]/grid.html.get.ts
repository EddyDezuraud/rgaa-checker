import { defineEventHandler, createError } from 'h3'
import { createGridHtml, loadAuditWithCriteria } from '../../../services/export'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }
  const audit = await loadAuditWithCriteria(id)
  if (!audit) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }
  const html = createGridHtml(audit)
  event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return html
})
