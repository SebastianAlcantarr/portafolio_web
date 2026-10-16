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
      <!-- Iconos sun y moon de Lucide (licencia ISC): en modo oscuro se ve el sol para pasar a claro, y viceversa. -->
      <svg
        v-if="isDark"
        class="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        v-else
        class="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <span v-if="!compact">{{ isDark ? 'Claro' : 'Oscuro' }}</span>
    </button>
    <template #fallback>
      <span class="inline-flex h-5" :class="compact ? 'w-10' : 'w-28'" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
