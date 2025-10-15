import { Queue, Worker, QueueScheduler } from 'bullmq'
import { useRuntimeConfig } from '#imports'
import { runAudit } from '../services/audit'
import { prisma } from '../utils/prisma'

let queue: Queue | null = null
let scheduler: QueueScheduler | null = null

const getConnection = () => {
  const config = useRuntimeConfig()
  return config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379'
}

export const getAuditQueue = () => {
  if (!queue) {
    queue = new Queue('audit:run', {
      connection: getConnection()
    })
    scheduler = new QueueScheduler('audit:run', { connection: getConnection() })
  }
  return queue
}

export const enqueueAudit = async (auditId: string, options: any) => {
  const audit = await prisma.audit.update({
    where: { id: auditId },
    data: { status: 'RUNNING' }
  })
  await getAuditQueue().add('run', { auditId, url: audit.url, options }, {
    jobId: auditId,
    removeOnComplete: true,
    removeOnFail: false
  })
}

export const registerAuditWorker = () => {
  const connection = getConnection()
  const worker = new Worker('audit:run', async (job) => {
    const { auditId, url, options } = job.data as { auditId: string; url: string; options: any }
    await runAudit(auditId, url, options)
  }, { connection, concurrency: 1 })

  worker.on('failed', async (job, err) => {
    if (!job) return
    await prisma.audit.update({
      where: { id: job.data.auditId },
      data: { status: 'FAILED' }
    })
    console.error('Audit job failed', err)
  })

  return worker
}
