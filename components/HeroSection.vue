<script setup lang="ts">
import gsap from 'gsap'
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'

// El proyecto de portada es el primero que tenga imagen.
const cover = projects.find((p) => p.images?.length)
const coverImage = cover?.images?.[0]
const nameLines = profile.name.split(' ')

const section = ref<HTMLElement | null>(null)

// La portada vive en su columna, encima del nombre y sin solaparse con él ni con la barra flotante.
// (Antes el hero se fijaba y la portada crecía hasta tapar el nombre y quedar detrás de la barra.)
useMotion(section, (mm, el) => {
  const plate = el.querySelector<HTMLElement>('[data-plate]')
  if (!plate) return

  // Escritorio con mouse: los botones se acercan al cursor y regresan con rebote.
  mm.add(`${DESKTOP} and (hover: hover) and (pointer: fine)`, () => {
    const offs = Array.from(el.querySelectorAll<HTMLElement>('[data-magnetic]')).map((b) => magnetic(b))
    return () => offs.forEach((off) => off())
  })

  // Móvil: la captura se desplaza un poco más lento que la página.
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
  <section ref="section" aria-labelledby="hero-title" class="relative bg-paper">
    <div class="grid-page pb-20 lg:pb-16">
      <p
        class="enter-fade col-span-4 text-lead font-medium sm:col-span-6 lg:col-span-5"
      >
        <span v-for="line in profile.headline" :key="line" class="block">{{ line }}</span>
      </p>

      <figure
        v-if="cover && coverImage"
        class="col-span-4 mt-10 flex flex-col-reverse gap-3 sm:col-span-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:mt-0"
      >
        <a
          data-plate
          :href="`#proyecto-${cover.slug}`"
          class="enter-plate group relative block overflow-hidden bg-plate"
          :aria-label="`Ver el proyecto ${cover.title}`"
        >
          <img
            :src="coverImage.src"
            :alt="coverImage.alt"
            width="1440"
            height="900"
            fetchpriority="high"
            class="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03] max-lg:motion-safe:transition-none"
          />
        </a>
        <figcaption class="flex flex-wrap justify-between gap-x-4 text-meta text-muted">
          <span>En portada: {{ cover.title }}</span>
        </figcaption>
      </figure>

      <nav
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
        class="col-span-full mt-8 font-display text-poster font-black lg:mt-10"
      >
        <span v-for="(line, i) in nameLines" :key="i" class="block overflow-hidden pb-[0.04em]">
          <span class="enter-line block" :style="{ animationDelay: `${0.25 + i * 0.1}s` }">{{ line }}</span>
        </span>
      </h1>

      <div
        class="enter-fade col-span-full mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between"
        style="animation-delay: 0.5s"
      >
        <p class="font-display text-lead font-bold tracking-tight">{{ profile.role }}</p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            data-magnetic
            href="#proyectos"
            class="inline-flex items-center justify-between gap-6 bg-ink px-6 py-4 font-display text-lg font-bold text-paper transition-colors duration-300 hover:bg-signal sm:justify-start"
          >
            Ver proyectos
            <ArrowIcon direction="down" />
          </a>
          <a
            data-magnetic
            href="#contacto"
            class="inline-flex items-center justify-between gap-6 border-2 border-ink px-6 py-[0.875rem] font-display text-lg font-bold transition-colors duration-300 hover:border-signal hover:text-signal sm:justify-start"
          >
            Contacto
            <ArrowIcon direction="down" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
