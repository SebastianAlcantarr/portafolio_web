<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'

// Línea roja arriba de la página que se llena conforme bajas (de 0 a 100 % del documento).
const bar = ref<HTMLElement | null>(null)

useMotion(bar, (mm, el) => {
  mm.add('all', () => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: motion.progress.scrub },
      },
    )
  })
})
</script>

<template>
  <div
    ref="bar"
    class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-signal"
    aria-hidden="true"
  />
</template>
