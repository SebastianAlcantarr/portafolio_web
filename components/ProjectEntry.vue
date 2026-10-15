<script setup lang="ts">
import { isPlaceholder } from '~/data/profile'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project }>()

const plateHref = computed(() => (isPlaceholder(props.project.live) ? undefined : props.project.live))

// En escritorio la ficha es un panel de vidrio líquido sobre la placa.
const ficha = ref<HTMLElement | null>(null)
useLiquidGlass(ficha)
</script>

<template>
  <!-- En escritorio cada proyecto ocupa la pantalla, se queda fijo y el siguiente lo cubre (ver ProjectsSection). -->
  <li :id="`proyecto-${project.slug}`" data-stack-item class="scroll-mt-6 lg:sticky lg:top-0 lg:h-[100svh] lg:scroll-mt-0">
    <article
      data-stack-card
      class="relative h-full origin-top bg-paper"
      :aria-labelledby="`titulo-${project.slug}`"
    >
      <div class="grid-page h-full gap-y-6 pb-16 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-y-4 lg:pb-6 lg:pt-20">
        <div class="col-span-full border-t border-ink" aria-hidden="true" />

        <div class="relative col-span-full flex flex-col gap-6 lg:block lg:min-h-0">
          <!-- Placa: la captura del proyecto o, si no hay imagen, el título a escala de cartel -->
          <component
            :is="plateHref ? 'a' : 'div'"
            v-if="project.image"
            v-bind="plateHref ? { href: plateHref, target: '_blank', rel: 'noopener noreferrer', tabindex: -1 } : {}"
            class="group block overflow-hidden bg-plate lg:h-full"
          >
            <img
              data-stack-img
              :src="project.image.src"
              :alt="project.image.alt"
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
              class="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03] lg:aspect-auto lg:h-full lg:motion-safe:transition-none"
            />
          </component>
          <div v-else class="bg-plate p-4 sm:p-6 lg:flex lg:h-full lg:items-end lg:overflow-hidden lg:p-10">
            <h3
              :id="`titulo-${project.slug}`"
              data-stack-title
              class="font-display text-section font-black lg:max-w-[60%] lg:text-[clamp(4rem,1rem+7vw,9.5rem)]"
            >
              {{ project.title }}
              <span v-if="project.highlight" class="block text-signal">{{ project.highlight }}</span>
            </h3>
          </div>

          <!-- Ficha: en escritorio, panel de vidrio sobre la placa -->
          <div
            ref="ficha"
            data-stack-ficha
            class="flex flex-col gap-5 sm:max-w-[34rem] lg:glass lg:absolute lg:bottom-6 lg:right-6 lg:w-[min(30rem,38%)] lg:max-w-none lg:rounded-[28px] lg:p-7"
          >
            <h3 v-if="project.image" :id="`titulo-${project.slug}`" class="font-display text-title font-black">
              {{ project.title }}
            </h3>
            <p class="max-w-[30ch] text-lead">{{ project.summary }}.</p>

            <dl class="grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-rule pt-4 text-meta lg:border-ink/20">
              <template v-if="project.kind">
                <dt class="text-muted">Tipo</dt>
                <dd class="font-medium">{{ project.kind }}</dd>
              </template>
              <template v-if="project.highlight">
                <dt class="text-muted">Resultado</dt>
                <dd class="font-medium text-signal">{{ project.highlight }}</dd>
              </template>
              <dt class="text-muted">Stack</dt>
              <dd>
                <ul class="flex flex-wrap gap-x-3 gap-y-1 font-medium">
                  <li v-for="tech in project.stack" :key="tech">
                    <span v-if="isPlaceholder(tech)" class="border border-dashed border-current px-1 text-muted">{{ tech }}</span>
                    <template v-else>{{ tech }}</template>
                  </li>
                </ul>
              </dd>
            </dl>

            <div v-if="project.live || project.repo" class="flex flex-wrap gap-x-6 gap-y-3 font-display text-lg font-bold">
              <AppLink v-if="project.live" :href="project.live" external class="link-arrow">
                Sitio en vivo <ArrowIcon direction="up-right" />
              </AppLink>
              <AppLink v-if="project.repo" :href="project.repo" external class="link-arrow">
                GitHub <ArrowIcon direction="up-right" />
              </AppLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Sombra que oscurece este proyecto cuando el siguiente lo cubre -->
      <div data-stack-dim class="pointer-events-none absolute inset-0 hidden bg-black opacity-0 lg:block" aria-hidden="true" />
    </article>
  </li>
</template>
