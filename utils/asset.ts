import { joinURL } from 'ufo'

/** Antepone el baseURL de la app a rutas de public/ (p. ej. '/projects/x.webp'), para que funcionen en GitHub Pages bajo /portafolio_web/. */
export function asset(path: string) {
  return path.startsWith('/') ? joinURL(useRuntimeConfig().app.baseURL, path) : path
}
