<script setup lang="ts">
// Etiqueta pequeña con aspecto de JSON: { "seccion": "01", "nombre": "proyectos" }.
// Mismo resaltado que NameTag: signos en el color de acento, texto en gris.
// Al llegar a la pantalla se escribe letra por letra (typeIn).
defineProps<{ index?: string; text: string }>()

const root = ref<HTMLElement | null>(null)
useMotion(root, (mm, el) => {
  mm.add('all', () => {
    typeIn(el)
  })
})
</script>

<template>
  <p ref="root" class="font-mono text-meta tracking-normal" aria-hidden="true">
    <span class="text-signal">{ </span>
    <template v-if="index"><span class="text-muted">"seccion": </span><span>"{{ index }}"</span><span class="text-muted">, </span></template>
    <span class="text-muted">"nombre": </span><span>"{{ text }}"</span>
    <span class="text-signal"> }</span>
  </p>
</template>
