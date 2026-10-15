<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '~/data/profile'

// Barra flotante de vidrio líquido. Aparece cuando el encabezado original ya salió de la pantalla
// y marca en rojo la sección en la que estás.

const links = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
]

const bar = ref<HTMLElement | null>(null)
const shown = ref(false)
const active = ref('')

useLiquidGlass(bar)

let triggers: ScrollTrigger[] = []

onMounted(() => {
  triggers = [
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.35,
      onEnter: () => (shown.value = true),
      onLeaveBack: () => (shown.value = false),
      onRefresh: (self) => (shown.value = self.scroll() > self.start),
    }),
    ...links.map((link) =>
      ScrollTrigger.create({
        trigger: `#${link.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) active.value = link.id
          else if (active.value === link.id) active.value = ''
        },
      }),
    ),
  ]
})

onBeforeUnmount(() => triggers.forEach((t) => t.kill()))
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 transition-[transform,opacity] duration-700 ease-out-expo sm:top-5"
    :class="shown ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'"
    :inert="!shown"
  >
    <nav
      ref="bar"
      aria-label="Secciones (barra flotante)"
      class="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5 text-meta font-medium"
    >
      <a
        href="#inicio"
        class="hidden rounded-full px-4 py-2 font-display font-extrabold tracking-tight sm:block"
      >
        {{ profile.name }}
      </a>
      <span class="hidden h-5 w-px bg-current opacity-20 sm:block" aria-hidden="true" />
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="relative rounded-full px-3 py-2 transition-colors duration-300 hover:text-signal sm:px-4"
        :class="active === link.id ? 'text-signal' : ''"
        :aria-current="active === link.id ? 'true' : undefined"
      >
        {{ link.label }}
        <span
          class="absolute inset-x-3 bottom-1 h-px origin-left bg-current transition-transform duration-500 ease-out-expo sm:inset-x-4"
          :class="active === link.id ? 'scale-x-100' : 'scale-x-0'"
          aria-hidden="true"
        />
      </a>
      <span class="h-5 w-px bg-current opacity-20" aria-hidden="true" />
      <ThemeToggle compact class="rounded-full px-3 py-2" />
    </nav>
  </div>
</template>
