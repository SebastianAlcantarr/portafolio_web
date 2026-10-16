<script setup lang="ts">
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { profile } from '~/data/profile'

const section = ref<HTMLElement | null>(null)
const about = ref<HTMLElement | null>(null)

// El título entra letra por letra y el resumen se "enciende" palabra por palabra al leerlo.
useMotion(section, (mm, el) => {
  const heading = el.querySelector<HTMLElement>('#sobre-mi-title')
  mm.add('all', () => {
    if (heading) revealChars(heading)

    // El objeto { "stack": { … } } se arma en orden: se abre, entra cada tecnología y se cierra.
    const open = el.querySelector('[data-stack-open]')
    const items = el.querySelectorAll('[data-stack-item]')
    const close = el.querySelector('[data-stack-close]')
    if (open && close && items.length) {
      gsap
        .timeline({ scrollTrigger: { trigger: open, start: 'top 85%', once: true } })
        .from(open, { autoAlpha: 0, x: -12, duration: 0.4, ease: 'power3.out' })
        .from(items, { autoAlpha: 0, x: -24, duration: 0.6, ease: 'expo.out', stagger: 0.07 }, '-=0.1')
        .from(close, { autoAlpha: 0, x: -12, duration: 0.4, ease: 'power3.out' }, '-=0.3')
    }
    if (!about.value) return
    const target = about.value
    SplitText.create(target, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: target, start: 'top 80%', end: 'bottom 55%', scrub: true },
          },
        ),
    })
  })
})
</script>

<template>
  <section id="sobre-mi" ref="section" aria-labelledby="sobre-mi-title" class="pb-24 lg:pb-40">
    <div class="grid-page gap-y-10 lg:gap-y-16">
      <div class="col-span-full border-t border-ink pt-4 lg:pt-5" aria-hidden="true" />

      <CodeLabel index="02" text="sobre-mi" class="col-span-full -mb-6 lg:-mb-12" />
      <h2 id="sobre-mi-title" class="col-span-full font-display text-section font-black lg:col-span-4">
        Sobre mí
      </h2>

      <div class="col-span-4 flex flex-col gap-12 sm:col-span-8 lg:col-span-8 lg:col-start-5 lg:gap-16">
        <p ref="about" class="max-w-[34ch] font-display text-[clamp(1.5rem,1rem+1.8vw,2.625rem)] font-medium leading-[1.15] tracking-[-0.02em]">
          {{ profile.about }}
        </p>

        <div class="grid gap-10 sm:grid-cols-2 sm:gap-6">
          <div class="border-t border-rule pt-4">
            <h3 class="font-display text-lg font-bold">Formación</h3>
            <p class="mt-3 text-lead">{{ profile.education.degree }}</p>
            <p class="mt-1 text-muted">{{ profile.education.school }}</p>
          </div>

          <div class="border-t border-rule pt-4">
            <h3 class="font-display text-lg font-bold">Stack</h3>
            <p data-stack-open class="mt-3 font-mono text-meta tracking-normal text-muted" aria-hidden="true">
              <span class="text-signal">{</span> "stack": <span class="text-signal">{</span>
            </p>
            <ul class="mt-1 pl-5 text-lead">
              <li v-for="tech in profile.stack" :key="tech" data-stack-item class="flex items-center gap-2">
                <TechIcon :name="tech" />
                {{ tech }}
              </li>
            </ul>
            <p data-stack-close class="mt-1 font-mono text-meta tracking-normal text-signal" aria-hidden="true">} }</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
