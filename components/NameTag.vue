<script setup lang="ts">
import { profile } from '~/data/profile'

// El nombre envuelto en una etiqueta HTML: <name> … </name>.
// Los signos < / > van en el color de acento y la palabra "name" en gris, como resaltado de código.
// Las etiquetas son decorativas: los lectores de pantalla solo leen el nombre.
</script>

<template>
  <span class="inline-flex flex-wrap items-baseline gap-x-[0.4em]">
    <span class="font-mono font-medium tracking-normal" aria-hidden="true"><span class="text-signal">&lt;</span><span class="text-muted">name</span><span class="text-signal">&gt;</span></span>
    <span>{{ profile.name }}</span>
    <span class="font-mono font-medium tracking-normal" aria-hidden="true"><span class="text-signal">&lt;/</span><span class="text-muted">name</span><span class="text-signal">&gt;</span></span>
  </span>
</template>
