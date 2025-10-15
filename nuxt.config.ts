import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'shadcn-nuxt'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  tailwindcss: {
    viewer: false
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },
  runtimeConfig: {
    jwtSecret: '',
    redisUrl: '',
    postgresUrl: '',
    minio: {
      endPoint: '',
      port: 9000,
      accessKey: '',
      secretKey: '',
      useSSL: false,
      bucket: 'rgaa-audits'
    },
    public: {
      appName: 'AccessScope RGAA'
    }
  },
  nitro: {
    preset: 'node-server'
  },
  typescript: {
    strict: true,
    shim: false
  },
  devtools: { enabled: true }
})
