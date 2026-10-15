<script setup lang="ts">
// `compact` muestra solo el icono (se usa en la barra flotante).
defineProps<{ compact?: boolean }>()

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="group inline-flex items-center gap-2 text-meta font-medium transition-colors duration-300 hover:text-signal"
      :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      :aria-pressed="isDark"
      @click="toggle"
    >
      <svg
        class="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:rotate-180"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
      </svg>
      <span v-if="!compact">{{ isDark ? 'Claro' : 'Oscuro' }}</span>
    </button>
    <template #fallback>
      <span class="inline-flex h-5" :class="compact ? 'w-10' : 'w-28'" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
