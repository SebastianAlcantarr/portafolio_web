<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'
import { isPlaceholder } from '~/data/profile'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project; index: number }>()

const liveHref = computed(() => (isPlaceholder(props.project.live) ? undefined : props.project.live))
const images = computed(() => props.project.images ?? [])

// Captura visible en la tarjeta; cambia con las flechas.
const frame = ref(0)
const step = (d: number) => {
  const n = images.value.length
  frame.value = (frame.value + d + n) % n
}

const row = ref<HTMLElement | null>(null)
const lane = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)

// Escritorio con mouse: cada fila tiene su propia tarjeta, dentro de su carril (columnas 7 a 9).
// La fila la recorta (overflow-hidden), así que nunca puede verse sobre otro proyecto.
useMotion(row, (mm, el) => {
  // La etiqueta JSON se escribe sola y los iconos del stack saltan uno tras otro.
  mm.add('all', () => {
    el.querySelectorAll<HTMLElement>('[data-type]').forEach(typeIn)
    gsap.from(el.querySelectorAll('[data-tech]'), {
      y: 12,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'back.out(2.5)',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    })
  })

  mm.add(`${DESKTOP} and (hover: hover) and (pointer: fine)`, () => {
    const box = card.value
    const host = lane.value
    if (!box || !host) return

    const { lag, tilt, drift } = motion.preview
    const yTo = gsap.quickTo(box, 'y', { duration: lag, ease: 'power3.out' })
    const xTo = gsap.quickTo(box, 'x', { duration: lag, ease: 'power3.out' })
    const rotTo = gsap.quickTo(box, 'rotation', { duration: 0.8, ease: 'power3.out' })
    // Posición relativa al carril, limitada a los bordes de la fila.
    const pos = (e: PointerEvent) => {
      const laneRect = host.getBoundingClientRect()
      const rowRect = el.getBoundingClientRect()
      const h = box.offsetHeight
      const min = rowRect.top - laneRect.top
      const max = Math.max(min, rowRect.bottom - laneRect.top - h)
      return {
        x: (e.clientX / window.innerWidth - 0.5) * drift,
        y: gsap.utils.clamp(min, max, e.clientY - laneRect.top - h / 2),
      }
    }
    let lastX = 0

    const enter = (e: PointerEvent) => {
      const { x, y } = pos(e)
      xTo(x, x)
      yTo(y, y)
      lastX = e.clientX
      gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
    }
    const move = (e: PointerEvent) => {
      const { x, y } = pos(e)
      xTo(x)
      yTo(y)
      rotTo(gsap.utils.clamp(-tilt, tilt, (e.clientX - lastX) * 0.4))
      lastX = e.clientX
    }
    const leave = () => {
      frame.value = 0
      rotTo(0)
      gsap.to(box, { autoAlpha: 0, scale: 0.92, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    }

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  })
})
</script>

<template>
  <!-- Fila del índice de proyectos. En escritorio, al pasar el cursor aparece su captura flotante. -->
  <li ref="row" :id="`proyecto-${project.slug}`" :data-project-index="index" data-project-row class="group relative scroll-mt-24 border-t border-ink lg:overflow-hidden">
    <div class="grid-page gap-y-5 py-7 lg:items-baseline lg:py-9">

      <p data-type class="col-span-full -mb-3 font-mono text-meta tracking-normal text-muted lg:col-span-6 lg:-mb-6" aria-hidden="true">
        <span class="text-signal">{</span> "id": <span class="text-ink">"{{ String(index + 1).padStart(2, '0') }}"</span>, "slug": <span class="text-ink">"{{ project.slug }}"</span> <span class="text-signal">}</span>
      </p>
      <h3
        :id="`titulo-${project.slug}`"
        class="col-span-full font-display text-[clamp(2rem,1rem+3.8vw,4.75rem)] font-black leading-[0.9] tracking-[-0.04em] lg:col-span-6"
      >
        <component
          :is="liveHref ? 'a' : 'span'"
          v-bind="liveHref ? { href: liveHref, target: '_blank', rel: 'noopener noreferrer' } : {}"
          class="inline-flex items-baseline gap-[0.2em] transition-transform duration-700 ease-out-expo lg:group-hover:translate-x-3"
          :class="liveHref ? 'hover:text-signal' : ''"
        >
          {{ project.title }}
          <span
            v-if="liveHref"
            class="text-[0.5em] text-signal opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowIcon direction="up-right" />
          </span>
        </component>
      </h3>

      <!-- Carril de la tarjeta flotante (columnas 7 a 9, solo escritorio con mouse). Es decorativa: la información está en la fila. -->
      <div ref="lane" class="relative hidden lg:col-span-3 lg:col-start-7 lg:row-start-1 lg:block lg:self-start" aria-hidden="true">
        <div
          ref="card"
          class="pointer-events-none absolute inset-x-0 top-0 z-10 origin-center opacity-0"
          style="transform: scale(0.92)"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-plate shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)]">
            <template v-if="images.length">
              <img
                v-for="(image, j) in images"
                :key="image.src"
                :src="asset(image.src)"
                alt=""
                width="1440"
                height="900"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
                :class="frame === j ? 'opacity-100' : 'opacity-0'"
              />
            </template>
            <div v-else class="absolute inset-0 flex items-end p-5">
              <span class="font-display text-[2.25rem] font-black leading-[0.9] tracking-[-0.04em]">
                {{ project.title }}
                <span v-if="project.highlight" class="block text-signal">{{ project.highlight }}</span>
              </span>
            </div>

            <!-- Flechas e indicador: lo único de la tarjeta que recibe el cursor. -->
            <template v-if="images.length > 1">
              <button
                type="button"
                tabindex="-1"
                class="pointer-events-auto absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center bg-signal font-display text-2xl font-bold text-ink"
                aria-label="Captura anterior"
                @click="step(-1)"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                tabindex="-1"
                class="pointer-events-auto absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center bg-signal font-display text-2xl font-bold text-ink"
                aria-label="Captura siguiente"
                @click="step(1)"
              >
                &rsaquo;
              </button>
              <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                <span
                  v-for="(image, j) in images"
                  :key="image.src"
                  class="h-1 w-6 transition-colors duration-500"
                  :class="frame === j ? 'bg-signal' : 'bg-white/40'"
                />
              </div>
            </template>
          </div>
          <p class="mt-2 flex justify-between gap-4 whitespace-nowrap font-display text-meta font-bold">
            <span class="text-muted">{{ project.kind ?? 'Proyecto' }}</span>
          </p>
        </div>
      </div>

      <div class="col-span-4 flex flex-col gap-2 sm:col-span-6 lg:col-span-3 lg:col-start-10">
        <p v-if="project.highlight" class="font-display text-lg font-bold text-signal">{{ project.highlight }}</p>
        <p class="text-lead">{{ project.summary }}.</p>
        <p v-if="project.problem" class="text-meta text-muted">{{ project.problem }}</p>
        <TechStack :stack="project.stack" :kind="project.kind" />

        <div v-if="project.live || project.repo" class="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-display text-base font-bold">
          <AppLink v-if="project.live" :href="project.live" external class="link-arrow">
            Ver sitio <ArrowIcon direction="up-right" />
          </AppLink>
          <AppLink v-if="project.repo" :href="project.repo" external class="link-arrow">
            <SocialIcon name="github" /> GitHub <ArrowIcon direction="up-right" />
          </AppLink>
        </div>
      </div>

      <!-- Móvil y tablet: las capturas van al final de la fila, plegadas. Sin capturas, un marco con el título. -->
      <ProjectCarousel v-if="images.length" :images="images" :title="project.title" />
      <div
        v-else
        class="col-span-full flex aspect-[16/10] items-end bg-plate p-5 lg:hidden"
        role="img"
        :aria-label="`Captura de ${project.title} pendiente`"
      >
        <span class="font-display text-title font-black">{{ project.title }}</span>
      </div>
    </div>
  </li>
</template>
