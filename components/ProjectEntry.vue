<script setup lang="ts">
import { isPlaceholder } from '~/data/profile'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project; index: number }>()

const liveHref = computed(() => (isPlaceholder(props.project.live) ? undefined : props.project.live))
</script>

<template>
  <!-- Fila del índice de proyectos. En escritorio, al pasar el cursor, ProjectsSection muestra la captura flotante. -->
  <li :id="`proyecto-${project.slug}`" :data-project-index="index" data-project-row class="group scroll-mt-24 border-t border-ink">
    <div class="grid-page gap-y-5 py-7 lg:items-baseline lg:py-9">
      <!-- Móvil y tablet: la captura va dentro de la fila -->
      <component
        :is="liveHref ? 'a' : 'div'"
        v-if="project.image"
        v-bind="liveHref ? { href: liveHref, target: '_blank', rel: 'noopener noreferrer', tabindex: -1, 'aria-hidden': true } : {}"
        class="col-span-full block overflow-hidden bg-plate lg:hidden"
      >
        <img
          :src="project.image.src"
          :alt="project.image.alt"
          width="1440"
          height="900"
          loading="lazy"
          decoding="async"
          class="aspect-[16/10] w-full object-cover object-top"
        />
      </component>

      <h3
        :id="`titulo-${project.slug}`"
        class="col-span-full font-display text-[clamp(2rem,1rem+3.8vw,4.75rem)] font-black leading-[0.9] tracking-[-0.04em] lg:col-span-6"
      >
        <component
          :is="liveHref ? 'a' : 'span'"
          v-bind="liveHref ? { href: liveHref, target: '_blank', rel: 'noopener noreferrer' } : {}"
          class="inline-flex items-baseline gap-[0.2em] transition-transform duration-700 ease-out-expo lg:group-hover:translate-x-3"
          :class="liveHref ? 'hover:text-signal' : ''"
        >
          {{ project.title }}
          <span
            v-if="liveHref"
            class="text-[0.5em] text-signal opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowIcon direction="up-right" />
          </span>
        </component>
      </h3>

      <!-- Las columnas 7 a 9 quedan libres en escritorio: por ahí viaja la tarjeta flotante sin tapar texto. -->
      <div class="col-span-4 flex flex-col gap-2 sm:col-span-6 lg:col-span-3 lg:col-start-10">
        <p v-if="project.highlight" class="font-display text-lg font-bold text-signal">{{ project.highlight }}</p>
        <p class="text-lead">{{ project.summary }}.</p>
        <p class="text-meta text-muted">
          <template v-if="project.kind">{{ project.kind }} · </template>
          <template v-for="(tech, i) in project.stack" :key="tech">
            <span v-if="isPlaceholder(tech)" class="border border-dashed border-current px-1">{{ tech }}</span>
            <template v-else>{{ tech }}</template>
            <template v-if="i < project.stack.length - 1">, </template>
          </template>
        </p>

        <div v-if="project.live || project.repo" class="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-display text-base font-bold">
          <AppLink v-if="project.live" :href="project.live" external class="link-arrow">
            Sitio <ArrowIcon direction="up-right" />
          </AppLink>
          <AppLink v-if="project.repo" :href="project.repo" external class="link-arrow">
            GitHub <ArrowIcon direction="up-right" />
          </AppLink>
        </div>
      </div>
    </div>
  </li>
</template>
