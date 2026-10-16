// Datos personales. Todo lo que está entre [CORCHETES] es un placeholder por reemplazar.

export const profile = {
  name: 'Sebastián Alcantar Vicencio',
  role: 'Desarrollador web · Vue, Nuxt, FastAPI',
  // Titular del hero: una línea por elemento (2 líneas en escritorio ≥1280 px; en pantallas angostas se parte).
  // Opciones consideradas:
  //  1. ["Construyo aplicaciones web full-stack con Vue/Nuxt, FastAPI y PostgreSQL", "y analizo datos con Power BI y pandas."]
  //  2. ["Full-stack: Vue/Nuxt, FastAPI y PostgreSQL.", "Análisis de datos con Power BI y pandas."]  ← elegida: directa y cabe en 2 líneas
  //  3. ["De la interfaz en Nuxt a la API en FastAPI y PostgreSQL;", "de los datos en pandas al dashboard en Power BI."]
  headline: ['Full-stack: Vue/Nuxt, FastAPI y PostgreSQL.', 'Análisis de datos con Power BI y pandas.'],
  intro:
    'Desarrollo web full-stack con Vue/Nuxt, FastAPI y PostgreSQL, y análisis de datos con Power BI y pandas.',

  email: 'sebastianalcantar323@gmail.com',
  github: 'https://github.com/SebastianAlcantarr',
  /** CV descargable: el archivo va en public/cv.pdf. */
  cv: '/cv.pdf',
  // TODO: reemplaza el placeholder por tu URL de perfil (https://www.linkedin.com/in/tu-usuario). Mientras tenga corchetes se muestra marcado y sin enlace.
  linkedin: '[https://www.linkedin.com/in/TU-USUARIO]',

  about:
    'Soy estudiante de 7º semestre de Ciencias de la Computación en la UNISON y hago desarrollo full-stack freelance con Vue/Nuxt, FastAPI y PostgreSQL. Trabajo con análisis de datos en Power BI y pandas, e integro LLMs en reportes y productos web; en Datdata conecté Power BI con LLMs.',

  education: {
    degree: 'Licenciatura en Ciencias de la Computación 7mo Semestre',
    school: 'Universidad de Sonora (UNISON)',
  },

  stack: ['Vue','Tailwind CSS', 'FastAPI', 'Power BI','Python','SQL', 'IA / LLMs'],
}

export const isPlaceholder = (value?: string) => !value || /^\[.*\]$/.test(value.trim())
