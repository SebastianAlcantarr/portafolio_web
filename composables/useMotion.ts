import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { Ref } from 'vue'
import { motion } from '~/data/motion'

/**
 * Corre animaciones de GSAP dentro de un componente y las limpia al desmontarlo.
 * No hace nada con "reducir movimiento": el contenido queda visible y estático.
 * `setup` recibe un gsap.matchMedia para separar escritorio (≥1024px) y móvil.
 */
export function useMotion(scope: Ref<HTMLElement | null>, setup: (mm: gsap.MatchMedia, el: HTMLElement) => void) {
  let mm: gsap.MatchMedia | null = null

  onMounted(() => {
    const { $reducedMotion } = useNuxtApp()
    if ($reducedMotion || !scope.value) return
    mm = gsap.matchMedia(scope.value)
    setup(mm, scope.value)
  })

  onBeforeUnmount(() => mm?.revert())
}

/**
 * Título que entra letra por letra desde abajo de su propia línea cuando llega a la pantalla.
 * El texto real queda intacto para lectores de pantalla (SplitText agrega aria-label).
 */
export function revealChars(target: HTMLElement, opts: { start?: string; stagger?: number } = {}) {
  return SplitText.create(target, {
    type: 'chars,lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.chars, {
        yPercent: 115,
        rotate: 6,
        duration: 1.1,
        ease: 'expo.out',
        stagger: opts.stagger ?? 0.035,
        scrollTrigger: { trigger: target, start: opts.start ?? 'top 85%', once: true },
      }),
  })
}

/**
 * Texto que se "escribe" letra por letra, como en una terminal, al llegar a la pantalla.
 * Respeta los <span> de colores de adentro (SplitText parte cada uno por separado).
 */
export function typeIn(target: HTMLElement) {
  const split = SplitText.create(target, { type: 'chars' })
  gsap.from(split.chars, {
    autoAlpha: 0,
    duration: 0.01,
    ease: 'none',
    stagger: motion.type.stagger,
    scrollTrigger: { trigger: target, start: 'top 90%', once: true },
  })
  return split
}

/**
 * Elemento magnético: se desplaza hacia el cursor mientras está encima y regresa con rebote elástico.
 * Devuelve la función que quita los eventos (llámala en el cleanup de mm.add).
 */
export function magnetic(el: HTMLElement, strength = motion.magnetic.strength) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true })
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
}

export const DESKTOP = '(min-width: 1024px)'
export const MOBILE = '(max-width: 1023.98px)'
