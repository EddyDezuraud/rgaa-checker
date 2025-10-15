import { defineNitroPlugin } from 'nitropack'
import { registerAuditWorker } from '../jobs/audit'

export default defineNitroPlugin(() => {
  if (process.env.NITRO_PRESET === 'server') {
    registerAuditWorker()
  }
})
