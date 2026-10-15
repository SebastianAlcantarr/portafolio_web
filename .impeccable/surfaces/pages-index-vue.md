---
version: 1
slug: "pages-index-vue"
primary_target: "pages/index.vue"
related_targets: []
---

# Surface: portfolio home (single page)

Scope: the whole one-page portfolio (Hero, Proyectos, Sobre mí, Contacto). Visitor mode: Experience — the work leads from the first viewport.
Audience: employer / technical recruiter skimming for minutes. Action: open a live project, then reach contact.
Proof: two live sites captured as plates (RayForce, boda), three projects without imagery yet, one first-place result.
Constraints: Nuxt 3 + Tailwind, official Nuxt modules only, Spanish, light + dark, no runtime external calls, no invented facts.

## Direction contract

THESIS: The page is one printed Swiss poster sheet extended down the scroll: strict 12-column grid, one enormous black grotesque, one dominant photographic plate per project, red used only as signal. It refuses the developer-portfolio default (greeting + avatar + gradient + equal card grid).

OWN-WORLD: Paper #FAFAF8 and ink #0A0A0A (dark: ink-black ground, paper text), a single signal red for links, focus and the active state. Schibsted Grotesk Black for display at poster scale with tight negative tracking, Hanken Grotesk for text. Hairline rules on the grid, flush-left ragged-right, no rounded cards, no shadows, no icons except drawn arrows.

STORY: The visitor reads the name and role at poster scale, sees a real shipped site immediately, scrolls an index of projects each with its ficha (stack, links) beside the plate, gets the short about + education, and ends on a giant email.

FIRST VIEWPORT: Top grid nav: name cols 1–3, section links stacked cols 6–8, email + theme toggle cols 11–12. Intro sentence large in cols 1–5. RayForce plate cols 6–12 from just below the nav to about 70% height. The name set ~200px bottom-left, crossing the plate in difference blend. Role line under it bottom-left; "Ver proyectos" (red underline) and "Contacto" bottom-right.

FORM: Swiss International Typographic Style poster (impeccable's pick, rank 1 on the ordered list). seed: none (unavailable)
Signature interaction: the hero assembles once on load (plate unmasks with clip-path, name slides up line by line); project plates track hover with a slow scale. Reduced motion: everything static and visible.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
