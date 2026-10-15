// Datos personales. Todo lo que está entre [CORCHETES] es un placeholder por reemplazar.

export const profile = {
  name: '[TU_NOMBRE]',
  role: 'Desarrollador web · Vue, Nuxt, FastAPI',
  intro:
    'Construyo sitios y aplicaciones de principio a fin: interfaces con Vue y Nuxt, APIs con FastAPI.',

  email: '[TU_CORREO]',
  github: '[URL_GITHUB]',
  linkedin: '[URL_LINKEDIN]',

  about:
    'Soy desarrollador web. He hecho una tienda en línea headless para un cliente real, una invitación de boda con confirmación de asistencia, proyectos académicos y de hackatón, y gané el primer lugar del Datatón Sonora 2026.',

  education: {
    degree: 'Licenciatura en Ciencias de la Computación',
    school: 'Universidad de Sonora (UNISON)',
  },

  // Agrega aquí las tecnologías que quieras mostrar.
  stack: ['Vue', 'Nuxt', 'Tailwind CSS', 'FastAPI', 'Power BI'],
}

/** Un valor que todavía es un placeholder, como "[TU_CORREO]". */
export const isPlaceholder = (value?: string) => !value || /^\[.*\]$/.test(value.trim())
