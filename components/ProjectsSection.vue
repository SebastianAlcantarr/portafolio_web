<script setup lang="ts">
import gsap from 'gsap'
import { projects } from '~/data/projects'

const section = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
// Entrada del título y de las filas. La captura flotante de cada proyecto vive en ProjectEntry.
useMotion(section, (mm, el) => {
  const heading = el.querySelector<HTMLElement>('#proyectos-title')
  const rows = el.querySelectorAll<HTMLElement>('[data-project-row]')

  mm.add('all', () => {
    if (heading) revealChars(heading)
    gsap.from(rows, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: list.value, start: 'top 85%', once: true },
    })
  })
})
</script>

<template>
  <section id="proyectos" ref="section" aria-labelledby="proyectos-title" class="pb-24 lg:pb-40">
    <div class="grid-page items-end gap-y-4 pb-10 lg:pb-16">
      <CodeLabel index="01" text="proyectos" class="col-span-full" />
      <h2 id="proyectos-title" class="col-span-full font-display text-section font-black lg:col-span-8">
        Proyectos
      </h2>
      <p class="col-span-4 max-w-[34ch] text-muted sm:col-span-5 lg:col-span-3 lg:col-start-10">
       Proyectos académicos y en produccion  en los que he participado
      </p>
    </div>

    <ol ref="list" class="list-none border-b border-ink">
      <ProjectEntry v-for="(project, i) in projects" :key="project.slug" :project="project" :index="i" />
    </ol>

  </section>
</template>
