import { defineEventHandler, readBody, createError } from 'h3'
import { createAudit } from '../../services/audit'
import { enqueueAudit } from '../../jobs/audit'
import { z } from 'zod'

const schema = z.object({
  url: z.string().url(),
  viewport: z.enum(['desktop', 'mobile']).default('desktop'),
  zoom: z.number().min(50).max(300).default(100),
  cssOff: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
  theme: z.enum(['system', 'light', 'dark']).default('system')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload', data: parsed.error.flatten() })
  }

  const audit = await createAudit(parsed.data.url, parsed.data)
  await enqueueAudit(audit.id, parsed.data)

  return { id: audit.id }
})
