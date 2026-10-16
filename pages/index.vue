<script setup lang="ts">
import { profile } from '~/data/profile'

const title = `${profile.name} — Desarrollador web full-stack`
const description = `Portafolio de ${profile.name}. ${profile.intro}`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: 'es_MX',
  ogSiteName: profile.name,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})
</script>

<template>
  <div id="inicio" class="overflow-x-clip">
    <SiteHeader />
    <main>
      <HeroSection />
      <VelocityMarquee />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
    </main>
    <!-- Al final a propósito: sus disparadores se crean después del resto de las secciones y miden bien. -->
    <GlassNav />
    <ScrollProgress />
  </div>
</template>
