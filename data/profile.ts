// Datos personales. Todo lo que está entre [CORCHETES] es un placeholder por reemplazar.

export const profile = {
  name: '[ Sebastián Alcantar Vicencio]',
  role: 'Desarrollador web · Vue, Nuxt, FastAPI',
  intro:
    'Construyo sitios y aplicaciones en su mayoria con  Vue y Nuxt y APIs con FastAPI.',

  email: 'sebastianalcantar323@gmail.com',
  github: 'https://github.com/SebastianAlcantarr',
  linkedin: '[URL_LINKEDIN]',

  about:
    'Soy un estudiante de la Licenciatura en Ciencas de la Computacion en la Universidad de Sonora, me apasiona el desarollo web , la Ingenieria de Software ya la Ciencia de Datos   ',

  education: {
    degree: 'Licenciatura en Ciencias de la Computación 7mo Semestre',
    school: 'Universidad de Sonora (UNISON)',
  },

  // Agrega aquí las tecnologías que quieras mostrar.
  stack: ['Vue','Tailwind CSS', 'FastAPI', 'Power BI','Python','SQL'],
}

/** Un valor que todavía es un placeholder, como "[TU_CORREO]". */
export const isPlaceholder = (value?: string) => !value || /^\[.*\]$/.test(value.trim())
