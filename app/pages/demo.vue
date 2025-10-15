<template>
  <section class="space-y-10">
    <div class="glass-card p-10">
      <h1 class="text-3xl font-semibold text-slate-900 dark:text-white">Rapports d'exemple</h1>
      <p class="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        Découvrez un aperçu des audits générés par AccessScope. Ces exemples contiennent des captures, des extraits DOM et des remédiations prêtes à l'emploi.
      </p>
    </div>
    <div class="grid gap-6 md:grid-cols-2">
      <article class="glass-card p-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Site e-commerce</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Score 82,3 % – Points clés : gestion des contrastes, labels de formulaires dynamiques.</p>
        <NuxtLink to="/audits/demo-ecommerce" class="pill mt-4 inline-flex">Voir la synthèse</NuxtLink>
      </article>
      <article class="glass-card p-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Portail administratif</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Score 64,5 % – Points clés : navigation clavier, hiérarchie des titres.</p>
        <NuxtLink to="/audits/demo-portail" class="pill mt-4 inline-flex">Voir la synthèse</NuxtLink>
      </article>
    </div>
  </section>
</template>

<style scoped>
.pill {
  @apply rounded-full border border-white/30 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-200;
}
</style>
