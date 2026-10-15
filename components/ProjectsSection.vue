<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'
import { projects } from '~/data/projects'

const section = ref<HTMLElement | null>(null)

useMotion(section, (mm, el) => {
  const heading = el.querySelector<HTMLElement>('#proyectos-title')
  const list = el.querySelector<HTMLElement>('ol')
  const items = [...el.querySelectorAll<HTMLElement>('[data-stack-item]')]

  mm.add('all', () => {
    if (heading) revealChars(heading)
  })

  // Escritorio: cada proyecto se queda fijo (sticky) y el siguiente sube y lo cubre.
  // Mientras lo cubre, el de abajo se encoge y se oscurece.
  mm.add(DESKTOP, () => {
    if (!list) return
    // Posición natural de cada proyecto en el documento. Los items son sticky, así que su
    // posición en pantalla miente cuando están fijos: se calcula desde la lista, que no lo es.
    const top = (i: number) =>
      list.getBoundingClientRect().top + window.scrollY + items.slice(0, i).reduce((sum, it) => sum + it.offsetHeight, 0)
    const vh = () => window.innerHeight

    items.forEach((item, i) => {
      const card = item.querySelector<HTMLElement>('[data-stack-card]')
      const dim = item.querySelector<HTMLElement>('[data-stack-dim]')
      const img = item.querySelector<HTMLElement>('[data-stack-img]')
      const title = item.querySelector<HTMLElement>('[data-stack-title]')
      const ficha = item.querySelector<HTMLElement>('[data-stack-ficha]')

      if (card && i < items.length - 1) {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: items[i + 1],
              start: () => top(i + 1) - vh(),
              end: () => top(i + 1),
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(card, { scale: motion.stack.shrinkTo }, 0)
          .to(dim, { opacity: motion.stack.dimTo }, 0)
      }

      // La captura se mueve un poco más lento que su marco mientras el proyecto pasa por la pantalla.
      const half = motion.stack.parallax / 2
      const travel = { start: () => top(i) - vh(), end: () => top(i) + vh(), scrub: true, invalidateOnRefresh: true }
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.15, yPercent: -half },
          { yPercent: half, ease: 'none', scrollTrigger: { trigger: item, ...travel } },
        )
      }
      if (title) {
        gsap.fromTo(title, { yPercent: half * 2 }, { yPercent: -half, ease: 'none', scrollTrigger: { trigger: item, ...travel } })
      }

      // La ficha de vidrio sube desde abajo cuando el proyecto termina de entrar.
      if (ficha) {
        gsap.from(ficha, {
          yPercent: 35,
          autoAlpha: 0,
          ease: 'expo.out',
          duration: 1.2,
          scrollTrigger: {
            trigger: item,
            start: () => top(i) - vh() * 0.35,
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        })
      }
    })
  })
})
</script>

<template>
  <section id="proyectos" ref="section" aria-labelledby="proyectos-title" class="pb-12 lg:pb-20">
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
