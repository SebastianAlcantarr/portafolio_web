// Perillas de movimiento. Cambia estos valores para ajustar las animaciones sin tocar los componentes.
// Todo se desactiva solo si el visitante tiene activado "reducir movimiento" en su sistema.
// Guía completa: ANIMACIONES.md

export const motion = {
  /** Scroll suave con inercia (Lenis). */
  scroll: {
    enabled: true,
    /** Cuánto tarda en frenar el scroll, en segundos. Más alto = más "flotante". */
    duration: 1.15,
    /** Multiplicador de la rueda del mouse. */
    wheelMultiplier: 1,
  },

  /** Tarjeta con la captura que sigue al cursor en la lista de proyectos (solo escritorio con mouse). */
  preview: {
    /** Retraso con el que sigue al cursor, en segundos. Más alto = más "flota". */
    lag: 0.55,
    /** Inclinación máxima según la velocidad del cursor, en grados. */
    tilt: 6,
    /** Cuánto se desplaza en horizontal con el cursor, en px (la tarjeta vive en su propio carril). */
    drift: 32,
  },

  /** Cinta de texto que se mueve con la velocidad del scroll. */
  marquee: {
    /** Velocidad base en px por segundo. */
    speed: 60,
    /** Cuánto acelera con la velocidad del scroll. */
    velocityBoost: 0.18,
  },

  /** Etiquetas JSON ({ "seccion": … }) que se escriben letra por letra al aparecer. */
  type: {
    /** Segundos entre letra y letra. Más bajo = escribe más rápido. */
    stagger: 0.018,
  },

  /** Botones magnéticos del hero: se acercan al cursor y regresan con rebote. */
  magnetic: {
    /** Cuánto siguen al cursor (0 = nada, 1 = lo alcanzan). */
    strength: 0.35,
  },

  /** Barra de progreso de lectura arriba de la página. */
  progress: {
    /** Suavizado del avance, en segundos (0 = pegado al scroll). */
    scrub: 0.3,
  },

  /** Vidrio líquido (barra flotante). */
  glass: {
    /** Fuerza de la refracción en el borde, en px. Solo en navegadores Chromium; los demás usan desenfoque. */
    refraction: 38,
    /** Ancho del bisel que refracta, en px. */
    bezel: 22,
    /** Desenfoque del fondo detrás del vidrio, en px. */
    blur: 6,
  },
}
