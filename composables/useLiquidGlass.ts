import type { Ref } from 'vue'
import { motion } from '~/data/motion'

let uid = 0

/** Solo los navegadores Chromium aplican filtros SVG en backdrop-filter; los demás se quedan con desenfoque. */
const supportsSvgBackdrop = () =>
  typeof navigator !== 'undefined' && /Chrome\//.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent)

/**
 * Mapa de desplazamiento de un rectángulo redondeado: en el borde (bisel) el fondo se toma
 * de un punto más hacia el centro, como una lente convexa. Rojo = x, verde = y, 128 = sin movimiento.
 */
function displacementMap(w: number, h: number, radius: number, bezel: number) {
  const scale = 0.5 // el mapa se dibuja a la mitad y el filtro lo estira
  const cw = Math.max(2, Math.round(w * scale))
  const ch = Math.max(2, Math.round(h * scale))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(cw, ch)
  const r = Math.min(radius, w / 2, h / 2)

  const sdf = (x: number, y: number) => {
    const qx = Math.abs(x) - (w / 2 - r)
    const qy = Math.abs(y) - (h / 2 - r)
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
  }

  for (let j = 0; j < ch; j++) {
    for (let i = 0; i < cw; i++) {
      const x = (i + 0.5) / scale - w / 2
      const y = (j + 0.5) / scale - h / 2
      const d = -sdf(x, y) // distancia hacia adentro desde el borde
      let dx = 0
      let dy = 0
      if (d > 0 && d < bezel) {
        const nx = sdf(x + 1, y) - sdf(x - 1, y)
        const ny = sdf(x, y + 1) - sdf(x, y - 1)
        const len = Math.hypot(nx, ny) || 1
        const t = 1 - d / bezel
        const mag = t * t * (3 - 2 * t) // suave hacia el centro, fuerte en la orilla
        dx = (-nx / len) * mag
        dy = (-ny / len) * mag
      }
      const k = (j * cw + i) * 4
      img.data[k] = 128 + dx * 127
      img.data[k + 1] = 128 + dy * 127
      img.data[k + 2] = 128
      img.data[k + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

/**
 * Convierte un elemento en vidrio líquido: refracta lo que pasa por debajo en su bisel.
 * El aspecto (tinte, brillo del borde) vive en la clase `.glass` de main.css.
 */
export function useLiquidGlass(el: Ref<HTMLElement | null>, opts: { radius?: number } = {}) {
  const id = `liquid-glass-${++uid}`
  let svg: SVGSVGElement | null = null
  let ro: ResizeObserver | null = null

  const build = () => {
    const node = el.value
    if (!node || !svg) return
    const { width, height } = node.getBoundingClientRect()
    if (width < 4 || height < 4) return
    const radius = opts.radius ?? (parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0)
    const { refraction, bezel, blur } = motion.glass
    const map = displacementMap(width, height, radius, bezel)
    svg.innerHTML = `
      <filter id="${id}" x="0" y="0" width="${width}" height="${height}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${blur / 2}" result="soft" />
        <feImage href="${map}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="soft" in2="map" scale="${refraction}" xChannelSelector="R" yChannelSelector="G" result="bent" />
        <feColorMatrix in="bent" type="saturate" values="1.5" />
      </filter>`
    // La clase .glass lee esta variable; sin ella usa solo desenfoque.
    node.style.setProperty('--glass-filter', `url(#${id})`)
  }

  onMounted(() => {
    if (!supportsSvgBackdrop() || !el.value) return
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.position = 'absolute'
    document.body.appendChild(svg)
    ro = new ResizeObserver(build)
    ro.observe(el.value)
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    svg?.remove()
  })
}
