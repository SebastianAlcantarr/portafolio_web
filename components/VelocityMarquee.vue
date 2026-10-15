<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'
import { profile } from '~/data/profile'

// Cinta con el stack. Avanza sola, acelera y se inclina con la velocidad del scroll,
// y cambia de sentido cuando subes. Con "reducir movimiento" queda quieta.

const track = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const copies = 4

let cleanup = () => {}
onBeforeUnmount(() => cleanup())

onMounted(() => {
  const { $reducedMotion } = useNuxtApp()
  const el = track.value
  if ($reducedMotion || !el || !root.value) return

  let x = 0
  let dir = 1
  let visible = false
  let lastY = window.scrollY
  let velocity = 0 // px por segundo, suavizada
  const skew = gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'power3.out' })
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(root.value)

  const tick = (_time: number, deltaMs: number) => {
    const y = window.scrollY
    const raw = deltaMs > 0 ? ((y - lastY) * 1000) / deltaMs : 0
    lastY = y
    velocity += (raw - velocity) * 0.2
    if (!visible) return
    if (Math.abs(velocity) > 5) dir = velocity > 0 ? 1 : -1
    const speed = motion.marquee.speed + Math.abs(velocity) * motion.marquee.velocityBoost
    const unit = el.scrollWidth / copies
    x = (x - (speed * dir * deltaMs) / 1000) % unit
    if (x > 0) x -= unit
    gsap.set(el, { x })
    skew(gsap.utils.clamp(-10, 10, -velocity / 220))
  }
  gsap.ticker.add(tick)

  cleanup = () => {
    gsap.ticker.remove(tick)
    io.disconnect()
  }
})
</script>

<template>
  <div ref="root" class="overflow-hidden border-y border-ink py-3 lg:py-5" aria-label="Stack" role="region">
    <ul class="sr-only">
      <li v-for="tech in profile.stack" :key="tech">{{ tech }}</li>
    </ul>
    <div ref="track" class="flex w-max will-change-transform" aria-hidden="true">
      <div v-for="n in copies" :key="n" class="flex shrink-0 items-center">
        <template v-for="tech in profile.stack" :key="tech">
          <span class="px-5 font-display text-title font-black lg:px-8">{{ tech }}</span>
          <span class="h-[0.5em] w-[0.5em] shrink-0 bg-signal text-title" />
        </template>
      </div>
    </div>
  </div>
</template>
