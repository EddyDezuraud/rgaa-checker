import { defineEventHandler, createError } from 'h3'
import { generateAttestationHtml } from '../../../services/attestation'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }
  const html = await generateAttestationHtml(id)
  if (!html) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }
  event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return html
})
