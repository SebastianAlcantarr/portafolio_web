# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Nuxt 3 + Tailwind CSS, pinned by the user. Allowed additions: official Nuxt modules only (e.g. @nuxtjs/color-mode, @nuxtjs/tailwindcss, @nuxt/fonts). Any other dependency requires asking first. No AI and no external API calls at runtime.

## Users

A prospective employer or technical recruiter evaluating a web developer: skims the page in a few minutes, wants to see real shipped work, the stack, education, and a way to get in touch.

## Product Purpose

Single-page personal portfolio that introduces the developer to an employer. Success: the visitor understands who this is and what they build within the first viewport, opens at least one live project, and finds contact details without searching.

## Positioning

A developer who ships real things end to end across front (Vue, Nuxt) and back (FastAPI): a headless store for a real client, a live wedding invitation with RSVP, academic and hackathon work, and a first-place data competition result.

## Capabilities and Constraints

- Sections: Hero, Proyectos, Sobre mí, Contacto. One page.
- Light and dark mode with a toggle (@nuxtjs/color-mode), colors as tokens.
- Project data lives in `data/projects.ts` so the user can edit it.
- Responsive, no horizontal scroll on mobile; motion respects prefers-reduced-motion.
- Language: Spanish.
- Small commits per section.

## Brand Commitments

- Name: placeholder `[TU_NOMBRE]` (user will fill it).
- Role line, verbatim: "Desarrollador web · Vue, Nuxt, FastAPI".
- Visual references given by the user (Behance: Newol Creative Agency; Padmabala fashion portfolio) as style guidance only: large high-contrast type, clean whitespace, large imagery, editorial, modern, sober. Do not copy their layout, copy, or assets.
- One heading font + one body font from Google Fonts; sober palette with at most two or three accents.

## Evidence on Hand

Only these projects/achievements exist; nothing else may be invented (no dates, clients, metrics, or claims beyond these):

- RayForce — tienda en línea headless para un cliente real. https://rayforce.com.mx
- Invitación de boda — Nuxt 3, confirmación de asistencia. https://bodagabrielyrenee.com
- Portal de derivadas — Vue, Tailwind, FastAPI, académico. Link: `[ENLACE]`
- GeoInvest — MVP con IA, FastAPI + Vue, hackatón. Link: `[ENLACE]`
- Datatón Sonora 2026 — 1er lugar, dashboard de Power BI sobre eficiencia del agua.
- Education: Licenciatura en Ciencias de la Computación, UNISON.

Imagery: screenshots of the two live sites captured locally and shipped as static files. Other projects have no images yet. Missing: email, GitHub, LinkedIn URLs, GitHub repo links per project.

## Product Principles

1. Real work first: every claim is a live link or a stated fact.
2. Scannable in under a minute by a busy recruiter.
3. Editable: content lives in data files, not scattered in markup.
4. Quiet confidence: sober, no gimmicks.

## Accessibility & Inclusion

WCAG AA contrast in both modes, keyboard navigable, reduced-motion respected.
