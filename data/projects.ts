// Proyectos del portafolio. Edita, reordena o agrega entradas aquí.
// - Lo que está entre [CORCHETES] es un placeholder: el sitio lo muestra marcado y sin enlace.
// - Si un proyecto no tiene sitio en vivo o repositorio, borra ese campo y el enlace desaparece.
// - Para agregar capturas, pon los archivos en /public/projects y llena `images` (la primera es la principal).
//   Sin `images`, el proyecto muestra un marco con su título como vista previa.
// - Cada proyecto: vista previa (images), descripción (summary), stack y un enlace (live y/o repo).

export interface Project {
  slug: string
  title: string
  summary: string
  /** Línea corta "problema → solución" (máx. 2 líneas). */
  problem?: string
  stack: string[]
  /** Tipo de proyecto (p. ej. "Cliente", "Académico"); se muestra en la tarjeta flotante. Opcional. */
  kind?: string
  /** Logro destacado, se muestra en el color de acento. */
  highlight?: string
  live?: string
  repo?: string
  /** Capturas del proyecto. La primera se muestra primero; el visitante puede cambiar entre ellas. */
  images?: ProjectImage[]
  tiempo?:string
}

export interface ProjectImage {
  src: string
  alt: string
}

export const projects: Project[] = [
  {
    slug: 'rayforce',
    title: 'RayForce',
    summary: 'E-commerce en línea headless para industria Ferretera',
    problem: 'Una ferretería necesitaba vender en línea → e-commerce headless con pagos Stripe.',
    stack: ['Nuxt, FastAPI, TailwindCSS, TypeScript, SQL, Stripe'],
    live: 'https://rayforce.com.mx',
    images: [
      {
        src: '/projects/rayforce-1.webp',
        alt: 'Página de inicio de la tienda en línea RayForce',
      },
      {
        src: '/projects/rayforce-2.webp',
        alt: 'Catálogo de herramientas y equipo eléctrico en la tienda RayForce',
      },
      {
        src: '/projects/rayforce-3.webp',
        alt: 'Ficha de producto con precio y botón para agregar al carrito en RayForce',
      },
      {
        src: '/projects/rayforce-4.webp',
        alt: 'Página de servicios de RayForce',
      },
    ],
    tiempo:'Marzo 2026 - Junio 2026'
  },
  {
    slug: 'dataton-sonora-2026',
    title: 'Datatón Sonora 2026',
    summary: 'Dashboard de Power BI sobre eficiencia del agua',
    problem: 'Datos del agua dispersos y difíciles de leer → dashboard en Power BI con datos limpios en pandas.',
    highlight: '1er lugar',
    stack: ['Power BI, Python (Pandas, NumPy)'],
    live: 'https://www.sonora.gob.mx/datos/equipo10dataton2',
    images: [
      { src: '/projects/dataton.jpg', alt: 'Foto con amigos en la Datatón Sonora 2026' },
      { src: '/projects/dataton-1.webp', alt: 'Portada de la Dataton Sonora 2026 en la página de Oficialía Mayor' },
      { src: '/projects/dataton-ofm-2.webp', alt: 'Información del evento y fechas de la Dataton Sonora 2026' },
      { src: '/projects/dataton-ofm-3.webp', alt: 'Sección de la Dataton Sonora 2026 en la página de Oficialía Mayor' },
    ],
    tiempo:'Abril 2026'
  },
  {
    slug: 'DatData',
    title: 'Creación de Reportes y Análisis de Datos',
    summary: 'Creación de reportes con Power BI, preprocesamiento de datos e implementación de metodologías para conectar Power BI con LLMs',
    problem: 'Reportes que requerían interpretación manual → Power BI conectado a LLMs para explicarlos.',
    stack: ['Power BI, Python, SQL, Pandas, IA / LLMs'],
    live: 'https://ricardo050427.github.io/datdata/',
    images: [
      {
        src: '/projects/datdata-1.webp',
        alt: 'first_datdata',
      },
      {
        src: '/projects/datdata-2.webp',
        alt:'second_datdata'
      },
      {
        src: '/projects/datdata-3.webp',
        alt:'third_datdata'
      },
      {
        src: '/projects/datdata-4.webp',
        alt:'4_datadta'
      }
    ],
    tiempo:'Mayo 2026 - Agosto 2026'
  },
  {
    slug: 'portal-de-derivadas',
    title: 'Portal de derivadas',
    summary: 'Portal para la materia de Cálculo I para la Universidad de Sonora',
    problem: 'Estudiantes de Cálculo I sin un espacio interactivo de práctica → portal web con actividades, lecturas y foro.',
    stack: ['Vue', 'Tailwind CSS', 'FastAPI'],
    live: 'https://sebastianalcantarr.github.io/PROYECTO_INGENIERIA_SOFTWARE_II',
    images: [
      { src: '/projects/derivadas-1.webp', alt: 'Pantalla de bienvenida del Portal de Derivadas' },
      { src: '/projects/derivadas-2.webp', alt: 'Panel de la actividad 1 del Portal de Derivadas' },
      { src: '/projects/derivadas-3.webp', alt: 'Material de lectura de la actividad 1 del Portal de Derivadas' },
      { src: '/projects/derivadas-4.webp', alt: 'Contenido del foro en el Portal de Derivadas' },
    ],
  },
  {
    slug: 'invitacion-de-boda',
    title: 'Invitación de boda',
    summary: 'Invitación web con confirmación de asistencia, generación de invitación en PDF por correo electrónico e integración con la API de WhatsApp',
    problem: 'Confirmar invitados a mano era lento → RSVP en línea con PDF por correo y aviso por WhatsApp.',
    stack: ['Nuxt 3 , Meta API , Resend '],
    live: 'https://bodagabrielyrenee.com',
    images: [
      {
        src: '/projects/boda.webp',
        alt: 'Invitación de boda en línea con fotografía de la pareja y botón para confirmar asistencia',
      },
    ],
  }
]
