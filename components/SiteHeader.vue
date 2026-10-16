<template>
  <header class="grid-page items-start gap-y-4 pb-10 pt-5 text-meta sm:pt-7 lg:pb-14">
    <a
      href="#inicio"
      class="col-span-2 font-display text-base font-extrabold leading-tight tracking-tight sm:col-span-3"
    >
      <NameTag />
    </a>

    <nav
      aria-label="Secciones"
      class="order-last col-span-4 sm:order-none sm:col-span-3 sm:col-start-4 lg:col-span-3 lg:col-start-6"
    >
      <ul class="flex gap-5 sm:flex-col sm:gap-0.5">
      </ul>
    </nav>

    <div
      class="col-span-2 flex flex-col items-end gap-1 text-right sm:col-span-2 sm:col-start-7 lg:col-span-3 lg:col-start-10"
    >
      <ThemeToggle />
    </div>
  </header>
</template>
