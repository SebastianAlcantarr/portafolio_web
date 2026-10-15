<script setup lang="ts">
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'

// El proyecto de portada es el primero que tenga imagen.
const cover = projects.find((p) => p.image)
const nameLines = profile.name.split(' ')
</script>

<template>
  <section aria-labelledby="hero-title" class="grid-page pb-20 lg:pb-28">
    <p
      class="enter-fade col-span-4 max-w-[24ch] text-lead font-medium sm:col-span-6 lg:col-span-5"
    >
      {{ profile.intro }}
    </p>

    <figure
      v-if="cover?.image"
      class="col-span-4 mt-10 flex flex-col-reverse gap-3 sm:col-span-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:mt-0"
    >
      <a
        :href="`#proyecto-${cover.slug}`"
        class="enter-plate group block overflow-hidden bg-plate"
        :aria-label="`Ver el proyecto ${cover.title}`"
      >
        <img
          :src="cover.image.src"
          :alt="cover.image.alt"
          width="1440"
          height="900"
          fetchpriority="high"
          class="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
        />
      </a>
      <figcaption class="flex flex-wrap justify-between gap-x-4 text-meta text-muted">
        <span>En portada: {{ cover.title }}, {{ cover.summary.toLowerCase() }}</span>
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
      class="relative z-10 col-span-full -mt-[0.38em] font-display text-poster font-black text-white mix-blend-difference lg:-mt-[0.5em]"
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
  </section>
</template>
