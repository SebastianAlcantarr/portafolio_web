// Datos personales. Todo lo que está entre [CORCHETES] es un placeholder por reemplazar.

export const profile = {
  name: 'Sebastián Alcantar Vicencio ',
  role: 'Desarrollador web · Vue, Nuxt, FastAPI ',
  intro:
    'Interesado en la Ingenieria de Software y en la Ciencia de Datos.',

  email: 'sebastianalcantar323@gmail.com',
  github: 'https://github.com/SebastianAlcantarr',
  linkedin: 'https://www.linkedin.com/messaging/thread/2-ZDc0MDdlODAtYWRkYy00YmM0LWIxMzItOGVkMTdmYTkzMTQwXzEwMA==/',

  about:
    'Soy un estudiante de la Licenciatura en Ciencas de la Computacion en la Universidad de Sonora, me apasiona el desarollo web , la Ingenieria de Software ya la Ciencia de Datos   ',

  education: {
    degree: 'Licenciatura en Ciencias de la Computación 7mo Semestre',
    school: 'Universidad de Sonora (UNISON)',
  },

  stack: ['Vue','Tailwind CSS', 'FastAPI', 'Power BI','Python','SQL'],
}

export const isPlaceholder = (value?: string) => !value || /^\[.*\]$/.test(value.trim())
