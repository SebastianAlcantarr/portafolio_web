import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { Ref } from 'vue'

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

export const DESKTOP = '(min-width: 1024px)'
export const MOBILE = '(max-width: 1023.98px)'
