import { defineEventHandler, createError } from 'h3'
import { createGridXlsx, loadAuditWithCriteria } from '../../../services/export'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }
  const audit = await loadAuditWithCriteria(id)
  if (!audit) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }
  const buffer = createGridXlsx(audit)
  event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  event.node.res.setHeader('Content-Disposition', `attachment; filename="grid-${id}.xlsx"`)
  return buffer
})
