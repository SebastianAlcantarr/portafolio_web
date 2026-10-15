// Proyectos del portafolio. Edita, reordena o agrega entradas aquí.
// - Lo que está entre [CORCHETES] es un placeholder: el sitio lo muestra marcado y sin enlace.
// - Si un proyecto no tiene sitio en vivo o repositorio, borra ese campo y el enlace desaparece.
// - Para agregar imagen, pon el archivo en /public/projects y llena `image`.

export interface Project {
  slug: string
  title: string
  summary: string
  stack: string[]
  /** Tipo de proyecto: cliente, académico, hackatón, concurso… */
  kind?: string
  /** Logro destacado, se muestra en el color de acento. */
  highlight?: string
  live?: string
  repo?: string
  image?: { src: string; alt: string }
}

export const projects: Project[] = [
  {
    slug: 'rayforce',
    title: 'RayForce',
    summary: 'Tienda en línea headless',
    kind: 'Cliente real',
    stack: ['[STACK_RAYFORCE]'],
    live: 'https://rayforce.com.mx',
    image: {
      src: '/projects/rayforce.webp',
      alt: 'Página de inicio de la tienda en línea RayForce',
    },
  },
  {
    slug: 'dataton-sonora-2026',
    title: 'Datatón Sonora 2026',
    summary: 'Dashboard de Power BI sobre eficiencia del agua',
    kind: 'Concurso',
    highlight: '1er lugar',
    stack: ['Power BI'],
  },
  {
    slug: 'portal-de-derivadas',
    title: 'Portal de derivadas',
    summary: 'Portal académico sobre derivadas',
    kind: 'Académico',
    stack: ['Vue', 'Tailwind CSS', 'FastAPI'],
    live: 'https://sebastianalcantarr.github.io/PROYECTO_INGENIERIA_SOFTWARE_II',
  },
  {
    slug: 'invitacion-de-boda',
    title: 'Invitación de boda',
    summary: 'Invitación web con confirmación de asistencia',
    stack: ['Nuxt 3'],
    live: 'https://bodagabrielyrenee.com',
    image: {
      src: '/projects/boda.webp',
      alt: 'Invitación de boda en línea con fotografía de la pareja y botón para confirmar asistencia',
    },
  }
]
