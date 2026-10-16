<script setup lang="ts">
import gsap from 'gsap'
import { isPlaceholder, profile } from '~/data/profile'

const section = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)

// El contenido sube más lento que el fondo negro mientras la sección entra: parece que estaba detrás.
useMotion(section, (mm, el) => {
  const heading = el.querySelector<HTMLElement>('#contacto-title')
  mm.add('all', () => {
    if (heading) revealChars(heading, { start: 'top 95%' })
    el.querySelectorAll<HTMLElement>('[data-type]').forEach(typeIn)
    // Las redes entran desde la izquierda, una tras otra.
    gsap.from(el.querySelectorAll('[data-network]'), {
      x: -40,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    })
  })
  mm.add(DESKTOP, () => {
    gsap.fromTo(
      inner.value,
      { yPercent: -30 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } },
    )
  })
})

const mailto = isPlaceholder(profile.email) ? profile.email : `mailto:${profile.email}`
const year = new Date().getFullYear()

const networks = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
]
</script>

<template>
  <section
    id="contacto"
    ref="section"
    aria-labelledby="contacto-title"
    class="overflow-clip bg-ink text-paper selection:bg-paper selection:text-ink"
  >
    <div ref="inner" class="grid-page gap-y-10 pb-10 pt-16 lg:gap-y-16 lg:pt-24">
      <CodeLabel index="03" text="contacto" class="col-span-full -mb-6 text-paper/60 lg:-mb-12" />
      <h2 id="contacto-title" class="col-span-full font-display text-section font-black">Contactos</h2>
      <div class="col-span-full">
        <p data-type class="mb-3 font-mono text-meta tracking-normal text-paper/60" aria-hidden="true">
          <span class="text-signal">{</span> "accion": <span class="text-paper">"enviarCorreo"</span>, "mensaje": <span class="text-paper">"hola"</span> <span class="text-signal">}</span>
        </p>
        <AppLink
          :href="mailto"
          class="inline-block max-w-full font-display text-[clamp(1.625rem,0.9rem+3.8vw,4.5rem)] font-black leading-none tracking-[-0.035em] underline decoration-2 underline-offset-[0.12em] [overflow-wrap:anywhere] hover:decoration-[0.08em]"
        >
          <template v-if="!isPlaceholder(profile.email)">{{ profile.email }}</template>
          <template v-else>Correo</template>
        </AppLink>
      </div>

      <ul class="col-span-4 sm:col-span-8 lg:col-span-6">
        <li v-for="network in networks" :key="network.label" data-network class="border-t border-paper/25">
          <AppLink
            :href="network.href"
            external
            class="flex items-center justify-between py-4 font-display text-title font-black transition-[padding] duration-500 ease-out-expo hover:pl-3"
          >
            {{ network.label }}
            <ArrowIcon direction="up-right" />
          </AppLink>
        </li>
      </ul>

      <footer
        class="col-span-full mt-10 flex flex-col gap-3 border-t border-paper/25 pt-5 text-meta sm:flex-row sm:justify-between lg:mt-20"
      >
        <p>© {{ year }} {{ profile.name }}</p>
        <p class="font-mono tracking-normal opacity-75"><span class="text-signal">{</span> "hecho_con": "Nuxt + Tailwind CSS" <span class="text-signal">}</span></p>
        <a href="#inicio" class="inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
          Volver arriba <ArrowIcon direction="up" />
        </a>
      </footer>
    </div>
  </section>
</template>
