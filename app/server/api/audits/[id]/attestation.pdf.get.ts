import { defineEventHandler, createError } from 'h3'
import { generateAttestationPdf } from '../../../services/attestation'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }
  const pdf = await generateAttestationPdf(id)
  if (!pdf) {
    throw createError({ statusCode: 404, statusMessage: 'Audit not found' })
  }
  event.node.res.setHeader('Content-Type', 'application/pdf')
  event.node.res.setHeader('Content-Disposition', `inline; filename="attestation-${id}.pdf"`)
  return pdf
})
