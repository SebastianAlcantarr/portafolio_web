<script setup lang="ts">
import gsap from 'gsap'
import { motion } from '~/data/motion'

// Tinta que sigue al cursor sobre el hero. Una simulación barata en la GPU (WebGL 1):
// cada cuadro la tinta anterior se arrastra con un remolino, se diluye y se le suma el trazo nuevo.
// Donde hay tinta, el nombre aparece en negativo, en rojo.
//
// `textRoot` es el elemento cuyos hijos con [data-ink-line] se dibujan como "segunda capa".

const props = defineProps<{ textRoot: HTMLElement | null }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const colorMode = useColorMode()

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`

// Paso de simulación: arrastra, diluye y agrega el trazo del cursor (un segmento de a a b).
const SIM = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uTime;
uniform float uDiss;
uniform float uSwirl;
uniform vec2 uA;
uniform vec2 uB;
uniform float uRadius;
uniform float uStrength;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
vec2 curl(vec2 p) {
  float e = 0.01;
  float n1 = noise(p + vec2(0, e)); float n2 = noise(p - vec2(0, e));
  float n3 = noise(p + vec2(e, 0)); float n4 = noise(p - vec2(e, 0));
  return vec2(n1 - n2, -(n3 - n4)) / (2.0 * e);
}
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 p = vUv * vec2(uAspect, 1.0);
  vec2 flow = curl(p * 2.2 + uTime * 0.06) * uSwirl;
  vec2 uv = vUv - flow;
  float v = texture2D(uPrev, uv).r * 0.6
    + (texture2D(uPrev, uv + vec2(uTexel.x, 0.0)).r + texture2D(uPrev, uv - vec2(uTexel.x, 0.0)).r
     + texture2D(uPrev, uv + vec2(0.0, uTexel.y)).r + texture2D(uPrev, uv - vec2(0.0, uTexel.y)).r) * 0.1;
  v = max(v * uDiss - 0.0035, 0.0);
  float d = segment(p, uA * vec2(uAspect, 1.0), uB * vec2(uAspect, 1.0));
  v = max(v, smoothstep(uRadius, uRadius * 0.15, d) * uStrength);
  gl_FragColor = vec4(v, v, v, 1.0);
}`

// Paso final: umbral con grano para que el borde parezca tinta, y el nombre recortado adentro.
const SHOW = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uInk;
uniform sampler2D uText;
uniform vec2 uTextOffset;
uniform float uAspect;
uniform vec3 uInkColor;
uniform vec3 uTextColor;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  float m = texture2D(uInk, vUv).r;
  vec2 q = vUv * vec2(uAspect, 1.0);
  float grain = vnoise(q * 14.0) * 0.6 + vnoise(q * 60.0) * 0.4;
  float a = smoothstep(0.3, 0.42, m + (grain - 0.5) * 0.28);
  float t = texture2D(uText, vUv - uTextOffset).a;
  vec3 col = mix(uInkColor, uTextColor, t);
  gl_FragColor = vec4(col * a, a);
}`

let cleanup = () => {}
onBeforeUnmount(() => cleanup())

onMounted(() => {
  const { $reducedMotion } = useNuxtApp()
  const el = canvas.value
  if ($reducedMotion || !motion.ink.enabled || !el) return
  const gl = el.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const program = (frag: string) => {
    const p = gl.createProgram()!
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag))
    gl.bindAttribLocation(p, 0, 'aPos')
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'ink shader')
    const uniforms: Record<string, WebGLUniformLocation | null> = {}
    const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(p, i)!.name
      uniforms[name] = gl.getUniformLocation(p, name)
    }
    return { p, u: uniforms }
  }

  let sim: ReturnType<typeof program>
  let show: ReturnType<typeof program>
  try {
    sim = program(SIM)
    show = program(SHOW)
  } catch {
    return
  }

  // Un triángulo que cubre toda la pantalla.
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const texture = () => {
    const t = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }
  const target = (w: number, h: number) => {
    const tex = texture()
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    const fb = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return { tex, fb }
  }

  const textCanvas = document.createElement('canvas')
  const textTex = texture()
  let read = target(2, 2)
  let write = target(2, 2)
  let simW = 2
  let simH = 2
  let width = 1
  let height = 1
  let dpr = 1
  // Posición del contenedor del texto, relativa al canvas, cuando se dibujó.
  // Si después el nombre se mueve (scroll, animaciones), el shader corre el texto esa diferencia.
  let textOrigin = { x: 0, y: 0 }

  const inkColor = [0, 0, 0]
  const textColor = [1, 0, 0]
  const readColors = () => {
    const css = getComputedStyle(document.documentElement)
    const rgb = (name: string) => css.getPropertyValue(name).trim().split(/\s+/).map((n) => Number(n) / 255)
    inkColor.splice(0, 3, ...rgb('--ink'))
    textColor.splice(0, 3, ...rgb('--signal'))
  }

  // Dibuja cada línea del nombre en un canvas 2D, en la misma posición que el texto real.
  const drawText = () => {
    const root = props.textRoot
    textCanvas.width = el.width
    textCanvas.height = el.height
    const ctx = textCanvas.getContext('2d')!
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)
    if (root) {
      const rootRect = root.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      textOrigin = { x: rootRect.left - box.left, y: rootRect.top - box.top }
      ctx.scale(dpr, dpr)
      root.querySelectorAll<HTMLElement>('[data-ink-line]').forEach((line) => {
        const style = getComputedStyle(line)
        const rect = (line.parentElement ?? line).getBoundingClientRect()
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing
        ctx.textBaseline = 'alphabetic'
        const m = ctx.measureText(line.textContent ?? '')
        const ascent = m.fontBoundingBoxAscent
        const descent = m.fontBoundingBoxDescent
        const baseline = rect.top + (line.offsetHeight - (ascent + descent)) / 2 + ascent
        ctx.fillText(line.textContent ?? '', rect.left - box.left, baseline - box.top)
      })
    }
    gl.bindTexture(gl.TEXTURE_2D, textTex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  }

  const resize = () => {
    const rect = el.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    el.width = Math.round(width * dpr)
    el.height = Math.round(height * dpr)
    simW = Math.max(2, Math.round(width * motion.ink.resolution))
    simH = Math.max(2, Math.round(height * motion.ink.resolution))
    read = target(simW, simH)
    write = target(simW, simH)
    drawText()
    wake()
  }

  // Trazo pendiente, en coordenadas uv del canvas (0..1, y hacia arriba).
  const pointer = { x: -1, y: -1, px: -1, py: -1, radius: 0, fresh: false }
  const move = (clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = 1 - (clientY - rect.top) / rect.height
    if (pointer.x < 0) {
      pointer.px = x
      pointer.py = y
    } else if (!pointer.fresh) {
      pointer.px = pointer.x
      pointer.py = pointer.y
    }
    const speed = Math.hypot((x - pointer.px) * rect.width, (y - pointer.py) * rect.height)
    pointer.radius = (motion.ink.radius + Math.min(speed * motion.ink.speedRadius, 60)) / rect.height
    pointer.x = x
    pointer.y = y
    pointer.fresh = true
    wake()
  }
  const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY)

  let raf = 0
  let visible = true
  let lastInput = 0
  let last = performance.now()

  const frame = (now: number) => {
    raf = 0
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now

    // Simulación
    gl.useProgram(sim.p)
    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb)
    gl.viewport(0, 0, simW, simH)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, read.tex)
    gl.uniform1i(sim.u.uPrev, 0)
    gl.uniform2f(sim.u.uTexel, 1 / simW, 1 / simH)
    gl.uniform1f(sim.u.uAspect, width / height)
    gl.uniform1f(sim.u.uTime, now / 1000)
    gl.uniform1f(sim.u.uDiss, Math.pow(motion.ink.dissipation, dt * 60))
    gl.uniform1f(sim.u.uSwirl, motion.ink.swirl * dt * 60)
    gl.uniform2f(sim.u.uA, pointer.px, pointer.py)
    gl.uniform2f(sim.u.uB, pointer.x, pointer.y)
    gl.uniform1f(sim.u.uRadius, pointer.radius)
    gl.uniform1f(sim.u.uStrength, pointer.fresh ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    ;[read, write] = [write, read]
    if (pointer.fresh) lastInput = now
    pointer.px = pointer.x
    pointer.py = pointer.y
    pointer.fresh = false

    // Composición
    const box = el.getBoundingClientRect()
    const root = props.textRoot?.getBoundingClientRect()
    gl.useProgram(show.p)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, el.width, el.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, read.tex)
    gl.uniform1i(show.u.uInk, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textTex)
    gl.uniform1i(show.u.uText, 1)
    gl.uniform1f(show.u.uAspect, width / height)
    gl.uniform2f(
      show.u.uTextOffset,
      root ? (root.left - box.left - textOrigin.x) / box.width : 0,
      root ? -(root.top - box.top - textOrigin.y) / box.height : 0,
    )
    gl.uniform3fv(show.u.uInkColor, inkColor)
    gl.uniform3fv(show.u.uTextColor, textColor)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    // Se duerme cuando la tinta ya se secó, para no gastar batería.
    if (visible && now - lastInput < 4000) raf = requestAnimationFrame(frame)
  }

  function wake() {
    if (!raf && visible) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) wake()
  })
  io.observe(el)

  const ro = new ResizeObserver(() => resize())
  ro.observe(el)

  readColors()
  resize()
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.fonts?.ready.then(() => resize())

  // Al cargar: un trazo que cruza el nombre (lo único que ven en pantallas táctiles sin arrastrar).
  let intro: gsap.core.Tween | null = null
  if (motion.ink.introStroke && props.textRoot) {
    const path = { t: 0 }
    intro = gsap.to(path, {
      t: 1,
      delay: 1.25,
      duration: 1.6,
      ease: 'power2.inOut',
      onStart: drawText,
      onUpdate: () => {
        const r = props.textRoot!.getBoundingClientRect()
        const x = r.left + r.width * (0.02 + path.t * 0.9)
        const y = r.top + r.height * (0.55 + Math.sin(path.t * Math.PI * 2.2) * 0.28)
        move(x, y)
      },
    })
  }

  const stopTheme = watch(
    () => colorMode.value,
    () => nextTick(() => {
      readColors()
      wake()
    }),
  )

  cleanup = () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    intro?.kill()
    stopTheme()
    window.removeEventListener('pointermove', onPointer)
  }
})
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none" aria-hidden="true" />
</template>
