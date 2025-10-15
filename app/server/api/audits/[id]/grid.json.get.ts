import { defineEventHandler, createError } from 'h3'
import { createGridJson, loadAuditWithCriteria } from '../../../services/export'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }
  const audit = await loadAuditWithCriteria(id)
  if (!audit) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }
  return createGridJson(audit)
})
