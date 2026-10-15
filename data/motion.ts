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

  /** Tinta WebGL que sigue al cursor en el hero y revela el nombre en negativo. */
  ink: {
    enabled: true,
    /** Grosor del trazo en px de pantalla (se suma al que da la velocidad del cursor). */
    radius: 46,
    /** Cuánto engorda el trazo con la velocidad del cursor. */
    speedRadius: 0.35,
    /** Qué tan rápido se seca la tinta (0.9 = desaparece rápido, 0.99 = dura mucho). */
    dissipation: 0.965,
    /** Fuerza del remolino que deforma la tinta. */
    swirl: 0.0016,
    /** Resolución de la simulación respecto a la pantalla (0.5 = la mitad). Más bajo = más ligero. */
    resolution: 0.4,
    /** Trazo automático al cargar la página (lo que ven también los celulares). */
    introStroke: true,
  },

  /** Hero fijado: la captura de portada crece hasta llenar la pantalla al bajar. */
  hero: {
    /** Cuánto scroll (en alturas de pantalla) dura la expansión. */
    pinLength: 1.1,
  },

  /** Proyectos apilados: cada proyecto se queda fijo y el siguiente lo cubre. */
  stack: {
    /** Escala a la que se encoge el proyecto que queda debajo. */
    shrinkTo: 0.9,
    /** Qué tanto se oscurece el proyecto de abajo (0 a 1). */
    dimTo: 0.55,
    /** Desplazamiento parallax de la captura dentro de su marco, en %. */
    parallax: 12,
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
