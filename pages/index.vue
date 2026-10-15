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
    </main>
  </div>
</template>
