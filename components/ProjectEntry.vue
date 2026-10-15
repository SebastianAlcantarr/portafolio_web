<script setup lang="ts">
import { isPlaceholder } from '~/data/profile'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project }>()

const plateHref = computed(() => (isPlaceholder(props.project.live) ? undefined : props.project.live))
</script>

<template>
  <li :id="`proyecto-${project.slug}`" class="scroll-mt-6">
    <article class="grid-page gap-y-6 pb-16 lg:pb-24" :aria-labelledby="`titulo-${project.slug}`">
      <div class="col-span-full border-t border-ink pt-4 lg:pt-5" aria-hidden="true" />

      <!-- Placa: la captura del proyecto o, si no hay imagen, el título a escala de cartel -->
      <component
        :is="plateHref ? 'a' : 'div'"
        v-if="project.image"
        v-bind="plateHref ? { href: plateHref, target: '_blank', rel: 'noopener noreferrer', tabindex: -1, 'aria-hidden': 'true' } : {}"
        class="group col-span-4 block overflow-hidden bg-plate sm:col-span-8 lg:col-span-8"
      >
        <img
          :src="project.image.src"
          :alt="project.image.alt"
          width="1440"
          height="900"
          loading="lazy"
          decoding="async"
          class="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
        />
      </component>
      <h3
        v-else
        :id="`titulo-${project.slug}`"
        class="col-span-4 font-display text-section font-black sm:col-span-8 lg:col-span-8"
      >
        {{ project.title }}
        <span v-if="project.highlight" class="block text-signal">{{ project.highlight }}</span>
      </h3>

      <!-- Ficha -->
      <div
        class="col-span-4 flex flex-col gap-5 sm:col-span-6 lg:sticky lg:top-6 lg:col-span-4 lg:col-start-9 lg:self-start"
      >
        <h3 v-if="project.image" :id="`titulo-${project.slug}`" class="font-display text-title font-black">
          {{ project.title }}
        </h3>
        <p class="max-w-[30ch] text-lead">{{ project.summary }}.</p>

        <dl class="grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-rule pt-4 text-meta">
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
    </article>
  </li>
</template>
