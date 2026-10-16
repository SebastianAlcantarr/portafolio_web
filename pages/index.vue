<script setup lang="ts">
import { profile } from '~/data/profile'

useSeoMeta({
  title: `${profile.name} — Desarrollador web`,
  description: profile.intro,
  ogTitle: `${profile.name} — Desarrollador web`,
  ogDescription: profile.intro,
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
