# Animaciones y vidrio líquido

Esta guía explica qué efectos tiene el sitio, con qué herramientas están hechos, en qué archivo vive cada uno y cómo cambiarlos o apagarlos.

**Regla de oro:** casi todo se ajusta desde `data/motion.ts`, sin tocar los componentes. Cada valor tiene un comentario que dice qué hace.

## Herramientas

| Herramienta | Para qué se usa | Dónde se conecta |
|---|---|---|
| [GSAP](https://gsap.com) 3 | Motor de animación. Mueve, escala y desvanece elementos. | Lo importa cada componente (`import gsap from 'gsap'`). |
| [Núcleo de GSAP](https://gsap.com/core/) | `gsap.to/from/fromTo`, líneas de tiempo (`gsap.timeline`), `stagger`, eases (`expo.out`, `back.out`, `elastic.out`), `gsap.quickTo` para seguir al cursor sin crear un tween por evento, y `gsap.matchMedia` para separar escritorio y móvil. | Cada componente, a través de `useMotion`. |
| ScrollTrigger (plugin de GSAP) | Ata una animación al scroll: empieza, avanza y termina según la posición de la página. Con `scrub` la animación avanza exactamente con la rueda; con `pin` fija un elemento mientras dura. | Se registra en `plugins/motion.client.ts`. |
| SplitText (plugin de GSAP) | Parte un texto en letras, palabras o líneas para animarlas por separado. Deja el texto original disponible para lectores de pantalla. | Se registra en `plugins/motion.client.ts`; se usa con `revealChars` y en Sobre mí. |
| [Lenis](https://lenis.darkroom.engineering) | Scroll suave con inercia. Lo mueve el mismo reloj de GSAP (`gsap.ticker`), así ScrollTrigger lee la posición exacta en cada cuadro. | `plugins/motion.client.ts`. |
| Filtro SVG + `backdrop-filter` | El vidrio líquido: deforma lo que pasa por debajo del panel, como una lente. | `composables/useLiquidGlass.ts` y la clase `.glass` en `assets/css/main.css`. |

GSAP y sus plugins (incluido SplitText) son gratuitos desde la versión 3.13.

## Piezas compartidas

- **`plugins/motion.client.ts`**: arranca todo en el navegador. Registra los plugins, crea Lenis, recalcula los disparadores cuando cargan las fuentes y cuando la página termina de montarse. Expone `$lenis` y `$reducedMotion` (con `useNuxtApp()`).
- **`composables/useMotion.ts`**:
  - `useMotion(refDeLaSeccion, (mm, el) => { ... })`: corre las animaciones de un componente y las borra al desmontarlo. `mm` es un `gsap.matchMedia`, para separar escritorio y móvil con las constantes `DESKTOP` (≥1024 px) y `MOBILE`. `mm.add('all', ...)` aplica en todos los tamaños. Si el visitante pidió "reducir movimiento", no corre nada.
  - `revealChars(elemento)`: el título entra letra por letra desde abajo de su línea, una sola vez, al llegar a la pantalla.
  - `typeIn(elemento)`: el texto se "escribe" letra por letra, como en una terminal (SplitText + `stagger`). Lo usan las etiquetas JSON.
  - `magnetic(elemento)`: el elemento se acerca al cursor (`quickTo`) y regresa con rebote (`elastic.out`). Devuelve la función que quita los eventos.

## Efectos, uno por uno

### 1. Scroll suave (Lenis)
- **Archivo:** `plugins/motion.client.ts`.
- **Perillas:** `motion.scroll.duration` (más alto = más flotante), `motion.scroll.wheelMultiplier`.
- **Apagar:** `motion.scroll.enabled = false`. El sitio vuelve al scroll nativo.
- Los enlaces `#seccion` también se desplazan con Lenis (`anchors: true`).

### 2. Hero (sin fijar)
- **Archivo:** `components/HeroSection.vue`.
- **Cómo funciona:** el hero ya no se fija ni hace crecer la portada: la expansión la hacía pasar por encima del nombre y quedar detrás de la barra flotante. La portada se queda en su columna, arriba del nombre. En móvil la imagen tiene un parallax suave dentro de su marco.

### 3. Cinta de stack que reacciona al scroll
- **Archivo:** `components/VelocityMarquee.vue` (entre el hero y Proyectos en `pages/index.vue`).
- **Cómo funciona:** avanza sola; con la velocidad del scroll acelera, se inclina (`skewX`) y cambia de sentido cuando subes. El texto sale de `profile.stack` en `data/profile.ts`. Hay una lista oculta para lectores de pantalla.
- **Perillas (`motion.marquee`):** `speed` (velocidad base), `velocityBoost` (cuánto acelera).
- **Apagar:** quita `<VelocityMarquee />` de `pages/index.vue`.

### 4. Proyectos: índice con tarjeta que sigue al cursor
- **Archivos:** `components/ProjectEntry.vue` (cada fila con su propia tarjeta), `components/ProjectsSection.vue` (título y entrada de las filas), `components/ProjectCarousel.vue` (capturas en móvil) y `components/TechStack.vue` (iconos del stack).
- **Cómo funciona:** cada fila tiene el nombre a gran escala a la izquierda y la descripción, el stack y los enlaces a la derecha. Las columnas 7 a 9 son el carril de la tarjeta con las capturas del proyecto. **Cada fila tiene su propia tarjeta** y la fila la recorta (`lg:overflow-hidden`), así que una captura nunca puede verse sobre otro proyecto. La tarjeta aparece al entrar el cursor en la fila, lo sigue en vertical con retraso (`gsap.quickTo`) sin salir de los bordes de la fila, se inclina según la velocidad del cursor y se oculta al salir. Las flechas cambian de captura.
- Solo en escritorio con mouse (`(hover: hover) and (pointer: fine)`). En celular y tablet las capturas están plegadas al final de la fila: el botón "Ver capturas (n)" despliega el carrusel (transición de `grid-template-rows`).
- Las filas entran una tras otra al llegar a la pantalla y el título "Proyectos" entra letra por letra.
- **Perillas (`motion.preview`):** `lag` (retraso con el que sigue al cursor), `tilt` (inclinación máxima en grados), `drift` (cuánto se mueve en horizontal).
- **Apagar la tarjeta:** borra el bloque `mm.add(`${DESKTOP} and …`)` de `ProjectEntry.vue`.

### 5. Vidrio líquido (barra flotante)
- **Archivos:** `composables/useLiquidGlass.ts` y `.glass` en `assets/css/main.css`.
- **Cómo funciona:** `useLiquidGlass(ref)` dibuja en un canvas un "mapa de desplazamiento" con la forma del panel (un rectángulo redondeado). En el borde (bisel), el mapa empuja el fondo hacia el centro, como una lente convexa. Ese mapa se usa en un filtro SVG (`feDisplacementMap`) y el filtro se aplica al fondo con `backdrop-filter`. El tinte, el brillo del borde y la sombra viven en la clase `.glass`.
- **Soporte por navegador:** la refracción del borde solo funciona en Chrome, Edge y otros basados en Chromium, porque son los únicos que aceptan filtros SVG en `backdrop-filter`. En Safari y Firefox el panel queda como vidrio desenfocado (`blur(14px) saturate(1.6)`), que también se ve bien.
- **Perillas (`motion.glass`):** `refraction` (fuerza de la deformación en px), `bezel` (ancho del borde que refracta), `blur` (desenfoque).
- **Opacidad del tinte:** en `.glass` (claro, `0.72`) y `.dark .glass` (oscuro, `0.30`), dentro de `background: rgb(var(--paper) / …)`. Si lo bajas, se ve más el fondo pero el texto pierde contraste.
- Solo lo usa la barra flotante. Para ponérselo a otro elemento: clase `glass` y `useLiquidGlass(ref)` en el componente.

### 6. Barra flotante
- **Archivo:** `components/GlassNav.vue` (al final de `pages/index.vue`, a propósito: así sus disparadores se crean después del resto de las secciones y miden bien).
- **Cómo funciona:** aparece después de bajar el 35 % de la pantalla y marca en rojo la sección que cruza la mitad de la pantalla. Incluye el botón de tema.
- **Apagar:** quita `<GlassNav />` de `pages/index.vue`.

### 7. Sobre mí: el resumen se "enciende" al leerlo
- **Archivo:** `components/AboutSection.vue`.
- **Cómo funciona:** el título entra letra por letra; el párrafo se parte en palabras que van de opacidad 0.15 a 1 conforme bajas (`scrub`), como si se leyera en voz alta.
- **Ajustar:** cambia `start: 'top 80%'` y `end: 'bottom 55%'` para que empiece o termine antes o después.

### 8. Contacto: aparece desde detrás
- **Archivo:** `components/ContactSection.vue`.
- **Cómo funciona:** mientras la sección negra entra, su contenido sube más lento que el fondo (`yPercent` de -30 a 0), y la sección recorta lo que sobra (`overflow-clip`). El título entra letra por letra.
- **Ajustar:** cambia el `-30` (más negativo = más profundidad). Solo en escritorio.

### 9. Etiquetas JSON que se escriben solas
- **Archivos:** `components/CodeLabel.vue` (`{ "seccion": "01", "nombre": "proyectos" }` encima de cada título), la etiqueta `{ "id", "slug" }` de cada proyecto en `ProjectEntry.vue` y `{ "accion": "enviarCorreo" … }` en `ContactSection.vue`.
- **Cómo funciona:** `typeIn` parte el texto en letras con SplitText y las muestra una por una (`autoAlpha` con `stagger`, `ease: 'none'`), como si se tecleara. Corre una sola vez, al llegar al 90 % de la pantalla. Respeta los colores de las llaves y las claves.
- **Para usarlo en otro texto:** ponle `data-type` y, dentro del `useMotion` de su sección, `el.querySelectorAll('[data-type]').forEach(typeIn)`.
- **Perilla (`motion.type`):** `stagger` (segundos entre letra y letra).

### 10. Iconos del stack que saltan
- **Archivos:** `components/ProjectEntry.vue` (la animación) y `components/TechStack.vue` (los `li` con `data-tech`).
- **Cómo funciona:** cuando la fila llega al 75 % de la pantalla, los iconos suben uno tras otro con un pequeño rebote (`back.out(2.5)`, `stagger: 0.05`).

### 11. Sobre mí: el objeto `{ "stack": { … } }` se arma en orden
- **Archivo:** `components/AboutSection.vue`.
- **Cómo funciona:** una línea de tiempo (`gsap.timeline`) con tres pasos encadenados: aparece la llave que abre, entran las tecnologías una tras otra desde la izquierda y aparece la llave que cierra. Los pasos se enciman un poco (`'-=0.1'`, `'-=0.3'`) para que se sienta continuo.
- **Ajustar:** cambia los `duration`, el `stagger` o las posiciones `'-=…'` de la línea de tiempo.

### 12. Botones magnéticos del hero
- **Archivos:** `components/HeroSection.vue` (botones con `data-magnetic`) y `magnetic()` en `composables/useMotion.ts`.
- **Cómo funciona:** con el cursor encima, "Ver proyectos" y "Contacto" se desplazan hacia él (`quickTo`, `power3.out`). Al salir regresan a su lugar con un rebote elástico (`elastic.out(1, 0.35)`). Solo en escritorio con mouse.
- **Perilla (`motion.magnetic`):** `strength` (0 = no se mueven, 1 = alcanzan al cursor).
- **Para hacer magnético otro elemento:** agrégale `data-magnetic` dentro del hero, o llama `magnetic(elemento)` en el `mm.add` de su sección y devuelve la función de limpieza.

### 13. Contacto: las redes entran desde la izquierda
- **Archivo:** `components/ContactSection.vue` (los `li` con `data-network`).
- **Cómo funciona:** GitHub y LinkedIn entran uno tras otro desde la izquierda (`x: -40`, `expo.out`, `stagger: 0.1`) cuando la sección llega al 70 % de la pantalla.

### 14. Barra de progreso de lectura
- **Archivo:** `components/ScrollProgress.vue` (en `pages/index.vue`, después de `GlassNav`).
- **Cómo funciona:** una línea roja de 3 px arriba de la página escala en horizontal (`scaleX` de 0 a 1) desde el inicio hasta el final del documento (`start: 0`, `end: 'max'`, `scrub`).
- **Perilla (`motion.progress`):** `scrub` (0 = pegada al scroll; más alto = más suave).
- **Apagar:** quita `<ScrollProgress />` de `pages/index.vue`.

### Animaciones de entrada (CSS)
Al cargar, la captura de portada se destapa y el nombre sube línea por línea. Esto es CSS puro (`.enter-plate`, `.enter-line`, `.enter-fade` en `main.css`) y ya existía antes de GSAP. Usan `animation-fill-mode: backwards` para no pisar los estilos que GSAP pone después.

## Reducir movimiento

Si el sistema del visitante tiene activado "reducir movimiento" (`prefers-reduced-motion: reduce`):
- No se crea Lenis (scroll nativo).
- `useMotion` no corre ninguna animación de GSAP; todo queda visible y quieto.
- La cinta no arranca y la tarjeta de proyectos no aparece.
- Las etiquetas JSON se ven completas desde el inicio, los botones no son magnéticos y la barra de progreso no aparece.
- Las animaciones de entrada CSS se desactivan en `main.css`.
- Lo que no es movimiento se queda: el vidrio y la barra flotante.

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
