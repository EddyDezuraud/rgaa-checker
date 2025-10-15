import { Client } from 'minio'
import { useRuntimeConfig } from '#imports'
import type { CriteriaResultSummary } from '~/types/audit'
import { prisma } from '../utils/prisma'

const createClient = () => {
  const config = useRuntimeConfig()
  return new Client({
    endPoint: config.minio.endPoint,
    port: config.minio.port,
    accessKey: config.minio.accessKey,
    secretKey: config.minio.secretKey,
    useSSL: config.minio.useSSL
  })
}

export const saveEvidenceAssets = async (auditId: string, criteria: CriteriaResultSummary[]) => {
  const config = useRuntimeConfig()
  const client = createClient()
  const bucket = config.minio.bucket
  const exists = await client.bucketExists(bucket).catch(() => false)
  if (!exists) {
    await client.makeBucket(bucket)
  }
  await Promise.all(criteria.flatMap((criterion) => (criterion.evidence ?? []).map(async (evidence, index) => {
    if (evidence.path) return
    const objectName = `${auditId}/${criterion.id}/${index}.txt`
    await client.putObject(bucket, objectName, Buffer.from(evidence.description ?? evidence.snippet ?? ''))
    await prisma.evidence.update({
      where: { id: evidence.id },
      data: { path: objectName }
    })
  })))
}
