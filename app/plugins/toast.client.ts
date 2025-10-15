import { defineNuxtPlugin } from '#app'

interface ToastMessage {
  id: number
  title: string
  description?: string
}

export default defineNuxtPlugin((nuxtApp) => {
  const toasts = useState<ToastMessage[]>('toasts', () => [])
  const add = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now()
    toasts.value.push({ id, ...toast })
    setTimeout(() => {
      toasts.value = toasts.value.filter(item => item.id !== id)
    }, 4000)
  }

  nuxtApp.provide('toast', {
    add
  })
})

declare module '#app' {
  interface NuxtApp {
    $toast: {
      add: (toast: { title: string; description?: string }) => void
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: {
      add: (toast: { title: string; description?: string }) => void
    }
  }
}

export const useToast = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$toast
}
