<script setup lang="ts">
import type { ProjectImage } from '~/data/projects'

const props = defineProps<{ images: ProjectImage[]; title: string }>()

const frame = ref(0)
// Cerrado por defecto: en móvil las capturas ocupan mucho; se abren con el botón.
const open = ref(false)
const regionId = useId()
const go = (to: number) => {
  const n = props.images.length
  frame.value = (to + n) % n
}
</script>

<template>
  <!-- Móvil y tablet: botón que despliega el carrusel dentro de la fila. En escritorio la captura la muestra la tarjeta flotante. -->
  <div class="col-span-full lg:hidden">
  <button
    type="button"
    class="inline-flex items-center gap-2 font-display text-base font-bold transition-colors hover:text-signal"
    :aria-expanded="open"
    :aria-controls="regionId"
    @click="open = !open"
  >
    {{ open ? 'Ocultar capturas' : `Ver capturas (${images.length})` }}
    <ArrowIcon :direction="open ? 'up' : 'down'" />
  </button>

  <div class="grid transition-[grid-template-rows] duration-500 ease-out-expo" :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
  <div class="min-h-0 overflow-hidden">
  <div
    :id="regionId"
    class="relative mt-4 overflow-hidden bg-plate"
    role="region"
    aria-roledescription="carrusel"
    :aria-label="`Capturas de ${title}`"
    :inert="!open"
  >
    <div class="relative aspect-[16/10]">
      <img
        v-for="(image, j) in images"
        :key="image.src"
        :src="asset(image.src)"
        :alt="frame === j ? image.alt : ''"
        :aria-hidden="frame !== j"
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500"
        :class="frame === j ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <template v-if="images.length > 1">
      <button
        type="button"
        class="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center bg-ink/70 font-display text-xl font-bold text-white"
        aria-label="Siguiente captura"
        @click="go(frame + 1)"
      >
        &gt;
      </button>

      <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        <button
          v-for="(image, j) in images"
          :key="image.src"
          type="button"
          class="h-1 w-6 transition-colors"
          :class="frame === j ? 'bg-signal' : 'bg-white/40'"
          :aria-label="`Ver captura ${j + 1}`"
          :aria-current="frame === j"
          @click="go(j)"
        />
      </div>
    </template>
  </div>
  </div>
  </div>
  </div>
</template>
