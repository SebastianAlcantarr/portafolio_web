<script setup lang="ts">
import { isPlaceholder, profile } from '~/data/profile'

const mailto = isPlaceholder(profile.email) ? profile.email : `mailto:${profile.email}`

const links = [
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#contacto', label: 'Contacto' },
]
</script>

<template>
  <header class="grid-page items-start gap-y-4 pb-10 pt-5 text-meta sm:pt-7 lg:pb-14">
    <a
      href="#inicio"
      class="col-span-2 font-display text-base font-extrabold leading-tight tracking-tight sm:col-span-3"
    >
      {{ profile.name }}
    </a>

    <nav
      aria-label="Secciones"
      class="order-last col-span-4 sm:order-none sm:col-span-3 sm:col-start-4 lg:col-span-3 lg:col-start-6"
    >
      <ul class="flex gap-5 sm:flex-col sm:gap-0.5">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="font-medium transition-colors duration-300 hover:text-signal"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>

    <div
      class="col-span-2 flex flex-col items-end gap-1 text-right sm:col-span-2 sm:col-start-7 lg:col-span-3 lg:col-start-10"
    >
      <AppLink :href="mailto" class="hidden font-medium transition-colors hover:text-signal lg:inline-flex">
        <template v-if="!isPlaceholder(profile.email)">{{ profile.email }}</template>
      </AppLink>
      <ThemeToggle />
    </div>
  </header>
</template>
