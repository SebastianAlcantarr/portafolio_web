<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section id="sobre-mi" aria-labelledby="sobre-mi-title" class="pb-24 lg:pb-40">
    <div class="grid-page gap-y-10 lg:gap-y-16">
      <div class="col-span-full border-t border-ink pt-4 lg:pt-5" aria-hidden="true" />

      <h2 id="sobre-mi-title" class="col-span-full font-display text-section font-black lg:col-span-4">
        Sobre mí
      </h2>

      <div class="col-span-4 flex flex-col gap-12 sm:col-span-8 lg:col-span-8 lg:col-start-5 lg:gap-16">
        <p class="max-w-[34ch] font-display text-[clamp(1.5rem,1rem+1.8vw,2.625rem)] font-medium leading-[1.15] tracking-[-0.02em]">
          {{ profile.about }}
        </p>

        <div class="grid gap-10 sm:grid-cols-2 sm:gap-6">
          <div class="border-t border-rule pt-4">
            <h3 class="font-display text-lg font-bold">Formación</h3>
            <p class="mt-3 text-lead">{{ profile.education.degree }}</p>
            <p class="mt-1 text-muted">{{ profile.education.school }}</p>
          </div>

          <div class="border-t border-rule pt-4">
            <h3 class="font-display text-lg font-bold">Stack</h3>
            <ul class="mt-3 text-lead">
              <li v-for="tech in profile.stack" :key="tech">{{ tech }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
