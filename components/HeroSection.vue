<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'

// El proyecto de portada es el primero que tenga imagen.
const cover = projects.find((p) => p.image)
const nameLines = profile.name.split(' ')

const section = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)

// Escritorio: el hero se fija y la captura de portada crece hasta cubrir toda la pantalla,
// mientras el resto se desvanece y el nombre (en modo diferencia) queda encima.
useMotion(section, (mm, el) => {
  const plate = el.querySelector<HTMLElement>('[data-plate]')
  const fades = el.querySelectorAll<HTMLElement>('[data-hero-fade]')
  if (!plate) return

  mm.add(DESKTOP, () => {
    // Geometría en coordenadas del documento, sin transformaciones (offsetTop/Left).
    // Una vez fijado, GSAP envuelve la sección en un .pin-spacer: su posición es la que no se mueve.
    const docTop = () => {
      const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      return host.getBoundingClientRect().top + window.scrollY
    }
    const pinStart = () => Math.max(0, docTop() + el.offsetHeight - window.innerHeight)
    const fit = () => {
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const w = plate.offsetWidth
      const h = plate.offsetHeight
      const s = Math.max(vw / w, vh / h)
      const sectionTopOnScreen = docTop() - pinStart()
      return {
        s,
        x: (vw - w * s) / 2 - plate.offsetLeft,
        y: (vh - h * s) / 2 - sectionTopOnScreen - plate.offsetTop,
      }
    }

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: pinStart,
          end: () => `+=${window.innerHeight * motion.hero.pinLength}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      .to(plate, { x: () => fit().x, y: () => fit().y, scale: () => fit().s, transformOrigin: '0 0' }, 0)
      // fromTo y no to: si GSAP leyera el estado inicial durante la animación de entrada (CSS), lo guardaría invisible.
      .fromTo(fades, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -48, duration: 0.35, immediateRender: false }, 0)
      .to(title.value, { y: () => -window.innerHeight * 0.18 }, 0)
  })

  // Móvil: sin fijar; la captura se desplaza un poco más lento que la página.
  mm.add(MOBILE, () => {
    gsap.to(plate.querySelector('img'), {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: plate, start: 'top top', end: 'bottom top', scrub: true },
    })
  })
})
</script>

<template>
  <!-- bg-paper: al fijarse, GSAP aísla la sección; sin fondo propio el nombre (modo diferencia) no tendría contra qué invertirse. -->
  <section ref="section" aria-labelledby="hero-title" class="relative bg-paper">
    <div class="grid-page pb-20 lg:pb-16">
      <p
        data-hero-fade
        class="enter-fade col-span-4 max-w-[24ch] text-lead font-medium sm:col-span-6 lg:col-span-5"
      >
        {{ profile.intro }}
      </p>

      <figure
        v-if="cover?.image"
        class="col-span-4 mt-10 flex flex-col-reverse gap-3 sm:col-span-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:mt-0"
      >
        <a
          data-plate
          :href="`#proyecto-${cover.slug}`"
          class="enter-plate group relative z-[5] block overflow-hidden bg-plate"
          :aria-label="`Ver el proyecto ${cover.title}`"
        >
          <img
            :src="cover.image.src"
            :alt="cover.image.alt"
            width="1440"
            height="900"
            fetchpriority="high"
            class="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03] max-lg:motion-safe:transition-none"
          />
        </a>
        <figcaption data-hero-fade class="flex flex-wrap justify-between gap-x-4 text-meta text-muted">
          <span>En portada: {{ cover.title }}, {{ cover.summary.toLowerCase() }}</span>
        </figcaption>
      </figure>

      <nav
        data-hero-fade
        aria-label="Proyectos"
        class="enter-fade col-span-4 mt-12 hidden self-start border-t border-rule pt-3 text-meta lg:col-span-4 lg:block"
        style="animation-delay: 0.35s"
      >
        <ul>
          <li v-for="project in projects" :key="project.slug" class="flex justify-between gap-4 py-0.5">
            <a :href="`#proyecto-${project.slug}`" class="font-medium transition-colors hover:text-signal">
              {{ project.title }}
            </a>
            <span v-if="project.highlight" class="text-signal">{{ project.highlight }}</span>
          </li>
        </ul>
      </nav>

      <h1
        id="hero-title"
        ref="title"
        class="relative z-10 col-span-full -mt-[0.38em] font-display text-poster font-black text-white mix-blend-difference lg:-mt-[0.5em]"
      >
        <span v-for="(line, i) in nameLines" :key="i" class="block overflow-hidden pb-[0.04em]">
          <span data-ink-line class="enter-line block" :style="{ animationDelay: `${0.25 + i * 0.1}s` }">{{ line }}</span>
        </span>
      </h1>

      <div
        data-hero-fade
        class="enter-fade col-span-full mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between"
        style="animation-delay: 0.5s"
      >
        <p class="font-display text-lead font-bold tracking-tight">{{ profile.role }}</p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            href="#proyectos"
            class="inline-flex items-center justify-between gap-6 bg-ink px-6 py-4 font-display text-lg font-bold text-paper transition-colors duration-300 hover:bg-signal sm:justify-start"
          >
            Ver proyectos
            <ArrowIcon direction="down" />
          </a>
          <a
            href="#contacto"
            class="inline-flex items-center justify-between gap-6 border-2 border-ink px-6 py-[0.875rem] font-display text-lg font-bold transition-colors duration-300 hover:border-signal hover:text-signal sm:justify-start"
          >
            Contacto
            <ArrowIcon direction="down" />
          </a>
        </div>
      </div>
    </div>

    <!-- Tinta WebGL: encima de todo el hero, no recibe clics -->
    <InkCanvas :text-root="title" class="absolute inset-0 z-20 h-full w-full" />
  </section>
</template>
