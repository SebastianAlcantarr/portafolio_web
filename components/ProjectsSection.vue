<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'
import { isPlaceholder } from '~/data/profile'
import { projects } from '~/data/projects'

const section = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const lane = ref<HTMLElement | null>(null)
const active = ref<number | null>(null)

// Escritorio con mouse: al pasar el cursor por una fila aparece la captura del proyecto
// en una tarjeta que sigue al cursor con un poco de retraso y se inclina según la velocidad.
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

  mm.add(`${DESKTOP} and (hover: hover) and (pointer: fine)`, () => {
    const card = preview.value
    const host = list.value
    if (!card || !host || !lane.value) return

    const { lag, tilt, drift } = motion.preview
    const xTo = gsap.quickTo(card, 'x', { duration: lag, ease: 'power3.out' })
    const yTo = gsap.quickTo(card, 'y', { duration: lag, ease: 'power3.out' })
    const rotTo = gsap.quickTo(card, 'rotation', { duration: 0.8, ease: 'power3.out' })
    // Sigue al cursor en vertical dentro del carril libre (columnas 7 a 9) y apenas se mueve en horizontal,
    // así nunca tapa el título ni la descripción.
    const pos = (e: PointerEvent) => {
      const laneRect = lane.value!.getBoundingClientRect()
      const h = card.offsetHeight
      const x = laneRect.left + (e.clientX / window.innerWidth - 0.5) * drift
      return { x, y: gsap.utils.clamp(16, window.innerHeight - h - 16, e.clientY - h / 2) }
    }
    let lastX = 0
    let shown = false

    const show = (e: PointerEvent) => {
      card.style.width = `${lane.value!.getBoundingClientRect().width}px`
      const { x, y } = pos(e)
      gsap.set(card, { x, y })
      lastX = e.clientX
      shown = true
      gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: true })
    }
    const hide = () => {
      shown = false
      active.value = null
      gsap.to(card, { autoAlpha: 0, scale: 0.92, duration: 0.45, ease: 'power3.out', overwrite: true })
      rotTo(0)
    }
    const move = (e: PointerEvent) => {
      if (!shown) return
      const { x, y } = pos(e)
      xTo(x)
      yTo(y)
      rotTo(gsap.utils.clamp(-tilt, tilt, (e.clientX - lastX) * 0.4))
      lastX = e.clientX
    }
    const over = (e: PointerEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>('[data-project-row]')
      if (!row) return
      active.value = Number(row.dataset.projectIndex)
      if (!shown) show(e)
    }

    host.addEventListener('pointerover', over)
    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerleave', hide)
    return () => {
      host.removeEventListener('pointerover', over)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', hide)
    }
  })
})
</script>

<template>
  <section id="proyectos" ref="section" aria-labelledby="proyectos-title" class="pb-24 lg:pb-40">
    <div class="grid-page items-end gap-y-4 pb-10 lg:pb-16">
      <h2 id="proyectos-title" class="col-span-full font-display text-section font-black lg:col-span-8">
        Proyectos
      </h2>
      <p class="col-span-4 max-w-[34ch] text-muted sm:col-span-5 lg:col-span-3 lg:col-start-10">
        Sitios en producción, un concurso de datos y proyectos académicos y de hackatón.
      </p>
      <!-- Mide el carril de la tarjeta flotante (columnas 7 a 9); no se ve. -->
      <div ref="lane" class="hidden lg:col-span-3 lg:col-start-7 lg:row-start-1 lg:block" aria-hidden="true" />
    </div>

    <ol ref="list" class="list-none border-b border-ink">
      <ProjectEntry v-for="(project, i) in projects" :key="project.slug" :project="project" :index="i" />
    </ol>

    <!-- Tarjeta flotante (solo escritorio con mouse). Es decorativa: la información está en las filas. -->
    <div
      ref="preview"
      class="pointer-events-none fixed left-0 top-0 z-40 hidden origin-center opacity-0 lg:block"
      style="transform: scale(0.92); width: 24rem"
      aria-hidden="true"
    >
      <div class="relative aspect-[16/10] overflow-hidden bg-plate shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)]">
        <template v-for="(project, i) in projects" :key="project.slug">
          <img
            v-if="project.image"
            :src="project.image.src"
            alt=""
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
            :class="active === i ? 'opacity-100' : 'opacity-0'"
          />
          <div
            v-else
            class="absolute inset-0 flex items-end p-5 transition-opacity duration-500"
            :class="active === i ? 'opacity-100' : 'opacity-0'"
          >
            <span class="font-display text-[2.25rem] font-black leading-[0.9] tracking-[-0.04em]">
              {{ project.title }}
              <span v-if="project.highlight" class="block text-signal">{{ project.highlight }}</span>
            </span>
          </div>
        </template>
      </div>
      <p class="mt-2 flex justify-between gap-4 whitespace-nowrap font-display text-meta font-bold">
        <span class="text-muted">{{ active !== null ? projects[active].kind ?? 'Proyecto' : '' }}</span>
        <span v-if="active !== null && !isPlaceholder(projects[active].live)" class="inline-flex items-center gap-1 text-signal">
          Ver sitio <ArrowIcon direction="up-right" />
        </span>
      </p>
    </div>
  </section>
</template>
