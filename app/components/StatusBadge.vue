<template>
  <span :class="classes" class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
    <span class="inline-flex h-2.5 w-2.5 rounded-full" :class="dot" />
    <slot />
    <template v-if="!$slots.default">{{ label }}</template>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ status: 'passed' | 'failed' | 'needs_review' }>(), { status: 'needs_review' })

const map = {
  passed: {
    label: 'Conforme',
    classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    dot: 'bg-emerald-500'
  },
  failed: {
    label: 'Non conforme',
    classes: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    dot: 'bg-rose-500'
  },
  needs_review: {
    label: 'À valider',
    classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    dot: 'bg-amber-500'
  }
} as const

const label = computed(() => map[props.status].label)
const classes = computed(() => map[props.status].classes)
const dot = computed(() => map[props.status].dot)
</script>
