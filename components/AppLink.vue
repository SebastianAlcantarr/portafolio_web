<script setup lang="ts">
import { isPlaceholder } from '~/data/profile'

// Enlace que, si la URL todavía es un placeholder, se muestra marcado y sin navegar.
const props = defineProps<{
  href?: string
  external?: boolean
}>()

const pending = computed(() => isPlaceholder(props.href))
</script>

<template>
  <span
    v-if="pending"
    class="inline-flex items-center gap-2 text-muted"
    :title="`Placeholder pendiente: ${href ?? ''}`"
  >
    <slot />
    <span class="border border-dashed border-current px-1 font-sans text-[0.75em] font-medium leading-tight">
      {{ href }}
    </span>
  </span>
  <a
    v-else
    :href="href"
    v-bind="external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
  >
    <slot />
  </a>
</template>
