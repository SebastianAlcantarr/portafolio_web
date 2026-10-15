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

  /** Hero fijado: la captura de portada crece al bajar, con el nombre y el rol encima. */
  hero: {
    /** Cuánto scroll (en alturas de pantalla) dura la expansión. */
    pinLength: 0.9,
    /** Hasta qué fracción del ancho de la pantalla crece la captura (1 = toda la pantalla). */
    growTo: 0.8,
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

  /** Vidrio líquido (barra flotante y fichas de proyecto). */
  glass: {
    /** Fuerza de la refracción en el borde, en px. Solo en navegadores Chromium; los demás usan desenfoque. */
    refraction: 38,
    /** Ancho del bisel que refracta, en px. */
    bezel: 22,
    /** Desenfoque del fondo detrás del vidrio, en px. */
    blur: 6,
  },
}
