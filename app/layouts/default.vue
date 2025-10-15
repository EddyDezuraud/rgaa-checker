<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-slate-950/60 border-b border-white/20 dark:border-white/10">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">A</span>
          <span class="text-lg">AccessScope RGAA</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <ColorModeSwitch />
          <NuxtLink to="/demo" class="rounded-full border border-white/30 bg-white/40 px-4 py-2 text-sm font-medium text-slate-800 backdrop-blur-md transition hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">Demo</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-12">
      <slot />
    </main>
    <footer class="border-t border-white/20 bg-white/60 py-6 text-center text-sm text-slate-600 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
      © {{ new Date().getFullYear() }} AccessScope – Audit RGAA automatisé et assisté.
    </footer>
    <ToastShelf />
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    ToastShelf: defineAsyncComponent(() => import('~/components/ToastShelf.vue')),
    ColorModeSwitch: defineComponent({
      name: 'ColorModeSwitch',
      setup () {
        const colorMode = useColorMode()
        const isDark = computed(() => colorMode.value === 'dark')
        const toggle = () => {
          colorMode.preference = isDark.value ? 'light' : 'dark'
        }
        return () => (
          <button
            type="button"
            aria-label="Basculer le thème"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/60 text-slate-800 transition hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            onClick={toggle}
          >
            <span aria-hidden="true">{isDark.value ? '🌙' : '☀️'}</span>
          </button>
        )
      }
    })
  }
})
</script>
