<template>
  <form @submit.prevent="submit" class="glass-card p-8 space-y-6" aria-label="Lancer un audit RGAA">
    <div>
      <label for="url" class="block text-sm font-medium text-slate-600 dark:text-slate-300">URL à auditer</label>
      <div class="mt-2 flex items-center gap-3">
        <input
          id="url"
          v-model="form.url"
          type="url"
          required
          autocomplete="url"
          placeholder="https://www.exemple.fr"
          class="flex-1 rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-white/10 dark:bg-white/10 dark:text-white"
        >
        <button type="submit" class="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-6 py-3 text-white shadow-lg shadow-primary-500/40 transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200">
          <Icon name="lucide:radar" class="h-5 w-5" />
          Analyser
        </button>
      </div>
    </div>
    <fieldset class="grid gap-4 md:grid-cols-2" aria-describedby="options-caption">
      <legend class="text-sm font-medium text-slate-600 dark:text-slate-300">Options avancées</legend>
      <p id="options-caption" class="text-xs text-slate-500 dark:text-slate-400">Ajustez le rendu Playwright pour tester différents contextes d'usage.</p>
      <ToggleGroup v-model="form.viewport" label="Contexte" :items="viewports" />
      <ToggleGroup v-model="form.theme" label="Thème" :items="themes" />
      <ToggleSwitch v-model="form.cssOff" label="Désactiver les styles" />
      <ToggleSwitch v-model="form.reducedMotion" label="Réduire les animations" />
      <SliderInput v-model="form.zoom" label="Zoom" :min="100" :max="200" :step="25" suffix="%" />
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { AuditLaunchPayload } from '~/types/audit'
const emit = defineEmits<{ (e: 'submit', payload: AuditLaunchPayload): void }>()

const form = reactive<AuditLaunchPayload>({
  url: '',
  viewport: 'desktop',
  zoom: 100,
  cssOff: false,
  reducedMotion: false,
  theme: 'system'
})

const viewports = [
  { label: 'Desktop', value: 'desktop' },
  { label: 'Mobile', value: 'mobile' }
]

const themes = [
  { label: 'Système', value: 'system' },
  { label: 'Clair', value: 'light' },
  { label: 'Sombre', value: 'dark' }
]

const submit = () => {
  emit('submit', { ...form })
}
</script>
