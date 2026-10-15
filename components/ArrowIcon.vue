<script setup lang="ts">
withDefaults(defineProps<{ direction?: 'down' | 'up-right' | 'up' }>(), { direction: 'down' })
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="square"
    aria-hidden="true"
    class="h-[0.8em] w-[0.8em] shrink-0"
  >
    <path v-if="direction === 'down'" d="M8 1.5v12M2.5 8.5 8 14l5.5-5.5" />
    <path v-else-if="direction === 'up'" d="M8 14.5v-12M2.5 7.5 8 2l5.5 5.5" />
    <path v-else d="M3 13 13 3M5 3h8v8" />
  </svg>
</template>
