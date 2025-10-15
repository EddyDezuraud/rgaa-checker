<template>
  <div class="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-3 px-4">
    <transition-group name="fade-up">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full max-w-sm rounded-3xl bg-white/90 p-4 text-sm shadow-xl backdrop-blur dark:bg-slate-900/90"
        role="status"
        :aria-live="toast.ariaLive ?? 'polite'"
      >
        <p class="font-semibold text-slate-900 dark:text-white">{{ toast.title }}</p>
        <p v-if="toast.description" class="mt-1 text-slate-600 dark:text-slate-300">{{ toast.description }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const toasts = useState<Array<{ id: number; title: string; description?: string }>>('toasts', () => [])
</script>
