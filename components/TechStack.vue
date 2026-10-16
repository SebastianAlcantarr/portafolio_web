<script setup lang="ts">
// Tecnologías de un proyecto, fijas debajo de su descripción: icono de marca y nombre.

const props = defineProps<{ stack: string[]; kind?: string }>()

// En los datos a veces vienen juntas ("Nuxt, FastAPI") o con detalle ("Python (Pandas,NumPY)"): se separan.
const techs = computed(() =>
  props.stack
    .flatMap((entry) => entry.replace(/\(([^)]*)\)/g, ',$1').split(','))
    .map((t) => t.trim())
    .filter(Boolean),
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="kind" class="text-meta text-muted">{{ kind }}</p>
    <ul class="flex flex-wrap gap-x-4 gap-y-2 text-meta" aria-label="Tecnologías">
      <li v-for="tech in techs" :key="tech" data-tech class="flex items-center gap-1.5 text-[1.3rem]">
        <TechIcon :name="tech" />
        <span class="text-meta text-muted">{{ tech }}</span>
      </li>
    </ul>
  </div>
</template>
