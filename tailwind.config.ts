import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default <Partial<Config>>{
  darkMode: 'class',
  content: ['./components/**/*.vue', './pages/**/*.vue', './app.vue', './data/**/*.ts'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        ink: token('ink'),
        muted: token('muted'),
        rule: token('rule'),
        signal: token('signal'),
        plate: token('plate'),
      },
      fontFamily: {
        display: ['"Schibsted Grotesk"', 'ui-sans-serif', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala: meta → cuerpo → lead → título de proyecto → título de sección → nombre
        meta: ['0.875rem', { lineHeight: '1.4' }],
        body: ['1.0625rem', { lineHeight: '1.6' }],
        lead: ['clamp(1.1875rem, 1rem + 0.9vw, 1.5rem)', { lineHeight: '1.3' }],
        title: ['clamp(1.75rem, 1.1rem + 2.5vw, 3.25rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        section: ['clamp(2.5rem, 1rem + 6.5vw, 7rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
        poster: ['clamp(2.8rem, 0.6rem + 9.5vw, 10.5rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
}
