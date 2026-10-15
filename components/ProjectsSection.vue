<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="proyectos" aria-labelledby="proyectos-title" class="pb-12 lg:pb-20">
    <div class="grid-page items-end gap-y-4 pb-10 lg:pb-16">
      <h2 id="proyectos-title" class="col-span-full font-display text-section font-black lg:col-span-8">
        Proyectos
      </h2>
      <p class="col-span-4 max-w-[34ch] text-muted sm:col-span-5 lg:col-span-3 lg:col-start-10">
        Sitios en producción, un concurso de datos y proyectos académicos y de hackatón.
      </p>
    </div>

    <ol class="list-none">
      <ProjectEntry v-for="project in projects" :key="project.slug" :project="project" />
    </ol>
  </section>
</template>
