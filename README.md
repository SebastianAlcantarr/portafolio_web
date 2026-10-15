# Portafolio

Sitio de una sola página hecho con Nuxt 3 + Tailwind CSS.

```bash
npm install
npm run dev       # desarrollo en http://localhost:3000
npm run build     # build de producción
npm run preview   # sirve el build
```

## Dónde editar el contenido

- `data/profile.ts`: nombre, rol, frase, correo, GitHub, LinkedIn, resumen, formación y stack.
- `data/projects.ts`: proyectos (título, descripción, tipo, logro, stack, enlaces, imagen).
- `public/projects/`: imágenes de los proyectos.

Lo que está entre `[CORCHETES]` es un placeholder. El sitio lo muestra con un recuadro punteado y sin enlace hasta que lo reemplaces.

## Colores y tipografía

- Los tokens de color están en `assets/css/main.css` (`:root` para el modo claro, `.dark` para el oscuro).
- La escala tipográfica está en `tailwind.config.ts` (`meta`, `body`, `lead`, `title`, `section`, `poster`).
- Fuentes: Schibsted Grotesk (títulos) y Hanken Grotesk (texto), servidas desde el propio sitio con `@nuxt/fonts`.

## Animaciones

Scroll suave, hero fijado, proyectos apilados, tinta WebGL y vidrio líquido. Los valores se ajustan en `data/motion.ts`. Cómo funciona cada efecto, cómo cambiarlo y cómo apagarlo: [ANIMACIONES.md](ANIMACIONES.md).
