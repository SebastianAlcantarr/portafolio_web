# Animaciones, vidrio líquido y tinta

Esta guía explica qué efectos tiene el sitio, con qué herramientas están hechos, en qué archivo vive cada uno y cómo cambiarlos o apagarlos.

**Regla de oro:** casi todo se ajusta desde `data/motion.ts`, sin tocar los componentes. Cada valor tiene un comentario que dice qué hace.

## Herramientas

| Herramienta | Para qué se usa | Dónde se conecta |
|---|---|---|
| [GSAP](https://gsap.com) 3 | Motor de animación. Mueve, escala y desvanece elementos. | Lo importa cada componente (`import gsap from 'gsap'`). |
| ScrollTrigger (plugin de GSAP) | Ata una animación al scroll: empieza, avanza y termina según la posición de la página. Con `scrub` la animación avanza exactamente con la rueda; con `pin` fija un elemento mientras dura. | Se registra en `plugins/motion.client.ts`. |
| SplitText (plugin de GSAP) | Parte un texto en letras, palabras o líneas para animarlas por separado. Deja el texto original disponible para lectores de pantalla. | Se registra en `plugins/motion.client.ts`; se usa con `revealChars` y en Sobre mí. |
| [Lenis](https://lenis.darkroom.engineering) | Scroll suave con inercia. Lo mueve el mismo reloj de GSAP (`gsap.ticker`), así ScrollTrigger lee la posición exacta en cada cuadro. | `plugins/motion.client.ts`. |
| WebGL (sin librería) | La tinta del hero: una simulación pequeña que corre en la tarjeta de video. | `components/InkCanvas.vue`. |
| Filtro SVG + `backdrop-filter` | El vidrio líquido: deforma lo que pasa por debajo del panel, como una lente. | `composables/useLiquidGlass.ts` y la clase `.glass` en `assets/css/main.css`. |

GSAP y sus plugins (incluido SplitText) son gratuitos desde la versión 3.13.

## Piezas compartidas

- **`plugins/motion.client.ts`**: arranca todo en el navegador. Registra los plugins, crea Lenis, recalcula los disparadores cuando cargan las fuentes y cuando la página termina de montarse. Expone `$lenis` y `$reducedMotion` (con `useNuxtApp()`).
- **`composables/useMotion.ts`**:
  - `useMotion(refDeLaSeccion, (mm, el) => { ... })`: corre las animaciones de un componente y las borra al desmontarlo. `mm` es un `gsap.matchMedia`, para separar escritorio y móvil con las constantes `DESKTOP` (≥1024 px) y `MOBILE`. `mm.add('all', ...)` aplica en todos los tamaños. Si el visitante pidió "reducir movimiento", no corre nada.
  - `revealChars(elemento)`: el título entra letra por letra desde abajo de su línea, una sola vez, al llegar a la pantalla.

## Efectos, uno por uno

### 1. Scroll suave (Lenis)
- **Archivo:** `plugins/motion.client.ts`.
- **Perillas:** `motion.scroll.duration` (más alto = más flotante), `motion.scroll.wheelMultiplier`.
- **Apagar:** `motion.scroll.enabled = false`. El sitio vuelve al scroll nativo.
- Los enlaces `#seccion` también se desplazan con Lenis (`anchors: true`).

### 2. Tinta WebGL en el hero
- **Archivo:** `components/InkCanvas.vue` (lo monta `HeroSection.vue`).
- **Cómo funciona:** cada cuadro, la tinta anterior se arrastra con un remolino (ruido "curl"), se diluye un poco y se le suma el trazo del cursor. Esto se guarda en dos texturas que se turnan (ping-pong). En la pasada final, un umbral con grano le da borde de tinta, y donde hay tinta se dibuja el nombre en rojo (`--signal`) sobre el color de la tinta (`--ink`). El nombre se copia del `<h1>` real (los `span[data-ink-line]`) a un canvas 2D, así el rojo queda encima de las letras de verdad.
- Al cargar hace un trazo solo que cruza el nombre (es lo que ven los celulares, que no tienen cursor).
- Se duerme si no está en pantalla o lleva 4 s sin movimiento, para no gastar batería. Relee los colores al cambiar de tema.
- **Perillas (`motion.ink`):** `radius` (grosor), `speedRadius` (cuánto engorda con la velocidad), `dissipation` (cuánto dura), `swirl` (remolino), `resolution` (calidad; más bajo = más ligero), `introStroke` (trazo al cargar).
- **Apagar:** `motion.ink.enabled = false`.
- **Si el rojo no coincide con las letras** (por ejemplo, al cambiar la fuente del nombre): ajusta el cálculo de `baseline` en `drawText()`.

### 3. Hero fijado: la portada crece a pantalla completa (solo escritorio)
- **Archivo:** `components/HeroSection.vue`.
- **Cómo funciona:** cuando el hero llega al final de la pantalla, ScrollTrigger lo fija (`pin`). Mientras sigues bajando, la captura `[data-plate]` se mueve y escala hasta cubrir la pantalla (técnica FLIP: se calcula la escala y el desplazamiento que la llevan del tamaño actual al tamaño de la ventana). Los elementos con `data-hero-fade` se desvanecen y el nombre sube un poco.
- **En móvil:** no se fija; la captura solo se mueve más lento que la página (parallax).
- **Perilla:** `motion.hero.pinLength` (cuánto scroll dura, en alturas de pantalla).
- **Apagar:** borra el bloque `mm.add(DESKTOP, ...)` de `HeroSection.vue`.
- El `<section>` tiene `bg-paper` a propósito: al fijarlo, el nombre (que usa `mix-blend-difference`) necesita un fondo propio contra el cual invertirse. Sin él, en modo claro el nombre se vuelve blanco sobre blanco.

### 4. Cinta de stack que reacciona al scroll
- **Archivo:** `components/VelocityMarquee.vue` (entre el hero y Proyectos en `pages/index.vue`).
- **Cómo funciona:** avanza sola; con la velocidad del scroll acelera, se inclina (`skewX`) y cambia de sentido cuando subes. El texto sale de `profile.stack` en `data/profile.ts`. Hay una lista oculta para lectores de pantalla.
- **Perillas (`motion.marquee`):** `speed` (velocidad base), `velocityBoost` (cuánto acelera).
- **Apagar:** quita `<VelocityMarquee />` de `pages/index.vue`.

### 5. Proyectos apilados (solo escritorio)
- **Archivos:** `components/ProjectEntry.vue` (estructura) y `components/ProjectsSection.vue` (animación).
- **Cómo funciona:** cada proyecto mide una pantalla y es `position: sticky`, así que se queda fijo mientras el siguiente sube y lo cubre. Mientras lo cubre, el de abajo se encoge y se oscurece (capa `[data-stack-dim]`). La captura se mueve dentro de su marco (parallax) y la ficha de vidrio sube desde abajo cuando el proyecto termina de entrar. El título "Proyectos" entra letra por letra.
- Como los proyectos son sticky, su posición en pantalla no sirve para calcular cuándo empieza cada animación; se calcula desde la lista (`top(i)` en `ProjectsSection.vue`).
- **En móvil:** lista normal, sin apilado.
- **Perillas (`motion.stack`):** `shrinkTo` (escala del proyecto de abajo), `dimTo` (cuánto se oscurece), `parallax` (desplazamiento de la captura, en %).
- **Apagar el apilado:** en `ProjectEntry.vue` quita `lg:sticky lg:top-0 lg:h-[100svh]` del `<li>` y borra el bloque `mm.add(DESKTOP, ...)` de `ProjectsSection.vue`.

### 6. Vidrio líquido (barra flotante y fichas)
- **Archivos:** `composables/useLiquidGlass.ts` y `.glass` en `assets/css/main.css`.
- **Cómo funciona:** `useLiquidGlass(ref)` dibuja en un canvas un "mapa de desplazamiento" con la forma del panel (un rectángulo redondeado). En el borde (bisel), el mapa empuja el fondo hacia el centro, como una lente convexa. Ese mapa se usa en un filtro SVG (`feDisplacementMap`) y el filtro se aplica al fondo con `backdrop-filter`. El tinte, el brillo del borde y la sombra viven en la clase `.glass`.
- **Soporte por navegador:** la refracción del borde solo funciona en Chrome, Edge y otros basados en Chromium, porque son los únicos que aceptan filtros SVG en `backdrop-filter`. En Safari y Firefox el panel queda como vidrio desenfocado (`blur(14px) saturate(1.6)`), que también se ve bien.
- **Perillas (`motion.glass`):** `refraction` (fuerza de la deformación en px), `bezel` (ancho del borde que refracta), `blur` (desenfoque).
- **Opacidad del tinte:** en `.glass` (claro, `0.72`) y `.dark .glass` (oscuro, `0.84`), dentro de `background: rgb(var(--paper) / …)`. Si lo bajas, se ve más el fondo pero el texto de la ficha pierde contraste sobre capturas claras u oscuras.
- **Apagar el vidrio en las fichas:** en `ProjectEntry.vue` quita `lg:glass` (y si quieres, `useLiquidGlass(ficha)`).

### 7. Barra flotante
- **Archivo:** `components/GlassNav.vue` (al final de `pages/index.vue`, a propósito: así sus disparadores se crean después del hero fijado y miden bien).
- **Cómo funciona:** aparece después de bajar el 35 % de la pantalla y marca en rojo la sección que cruza la mitad de la pantalla. Incluye el botón de tema.
- **Apagar:** quita `<GlassNav />` de `pages/index.vue`.

### 8. Sobre mí: el resumen se "enciende" al leerlo
- **Archivo:** `components/AboutSection.vue`.
- **Cómo funciona:** el título entra letra por letra; el párrafo se parte en palabras que van de opacidad 0.15 a 1 conforme bajas (`scrub`), como si se leyera en voz alta.
- **Ajustar:** cambia `start: 'top 80%'` y `end: 'bottom 55%'` para que empiece o termine antes o después.

### 9. Contacto: aparece desde detrás
- **Archivo:** `components/ContactSection.vue`.
- **Cómo funciona:** mientras la sección negra entra, su contenido sube más lento que el fondo (`yPercent` de -30 a 0), y la sección recorta lo que sobra (`overflow-clip`). El título entra letra por letra.
- **Ajustar:** cambia el `-30` (más negativo = más profundidad). Solo en escritorio.

### Animaciones de entrada (CSS)
Al cargar, la captura de portada se destapa y el nombre sube línea por línea. Esto es CSS puro (`.enter-plate`, `.enter-line`, `.enter-fade` en `main.css`) y ya existía antes de GSAP. Usan `animation-fill-mode: backwards` para no pisar los estilos que GSAP pone después.

## Reducir movimiento

Si el sistema del visitante tiene activado "reducir movimiento" (`prefers-reduced-motion: reduce`):
- No se crea Lenis (scroll nativo).
- `useMotion` no corre ninguna animación de GSAP; todo queda visible y quieto.
- La tinta y la cinta no arrancan.
- Las animaciones de entrada CSS se desactivan en `main.css`.
- Lo que no es movimiento se queda: el vidrio, la barra flotante y el apilado sticky (es solo posición, sin animación).

Para probarlo en Chrome: DevTools → menú ⋮ → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion".

## Agregar una animación nueva

```vue
<script setup lang="ts">
import gsap from 'gsap'

const section = ref<HTMLElement | null>(null)

useMotion(section, (mm, el) => {
  mm.add('all', () => {
    revealChars(el.querySelector('h2')!) // título letra por letra
  })
  mm.add(DESKTOP, () => {
    gsap.from(el.querySelector('img'), {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
})
</script>

<template>
  <section ref="section">...</section>
</template>
```

Consejos:
- Todo lo que use `window` o `document` va dentro de `useMotion` o de `onMounted`; el sitio se renderiza primero en el servidor.
- Si un elemento tiene una animación CSS de entrada, usa `gsap.fromTo` en vez de `gsap.to`: si GSAP lee el estado inicial mientras corre la animación CSS, lo guarda a medias.
- No pongas `transition` de CSS sobre una propiedad que GSAP mueve con `scrub` (por ejemplo `transition-transform` en una imagen con parallax): la animación se sentirá atrasada.
- Para ver los disparadores en pantalla, agrega `markers: true` dentro de `scrollTrigger`.
