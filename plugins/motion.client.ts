import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { motion } from '~/data/motion'

// Conecta el scroll suave (Lenis) con GSAP: un solo reloj mueve el scroll y las animaciones,
// así ScrollTrigger lee la posición exacta en cada cuadro.
export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduced && motion.scroll.enabled) {
    lenis = new Lenis({
      duration: motion.scroll.duration,
      wheelMultiplier: motion.scroll.wheelMultiplier,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      autoRaf: false,
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('lenis-on')
  }

  // Las fuentes cambian las alturas: recalcula los disparadores cuando terminan de cargar.
  // Lo mismo cuando la página terminó de montarse y todas las secciones crearon sus disparadores.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  nuxtApp.hook('app:suspense:resolve', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return { provide: { lenis, reducedMotion: reduced } }
})
