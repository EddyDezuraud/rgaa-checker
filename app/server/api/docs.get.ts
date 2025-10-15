import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    openapi: '3.1.0',
    info: {
      title: 'AccessScope RGAA API',
      version: '0.1.0'
    },
    paths: {
      '/api/audits': {
        post: {
          summary: 'Lancer un audit',
          requestBody: {
            required: true
          },
          responses: {
            '200': {
              description: 'Audit programmé'
            }
          }
        }
      }
    }
  }
})
