# AccessScope RGAA – SaaS d'audit d'accessibilité

Ce dépôt contient une application **Nuxt 4** complète qui orchestre un audit RGAA v4.1.2 de bout en bout : collecte via Playwright, calcul du taux de conformité, génération de grilles et d'attestations accessibles. L'architecture respecte les contraintes SaaS (multi-tenant, file de jobs BullMQ, stockage S3-compatible) et propose une interface ultra moderne inspirée de Linear/Vercel tout en restant 100 % accessible.

## ✨ Fonctionnalités clés

- Lancement d'audits RGAA avec options (viewport, zoom, CSS off, thèmes)
- Rendu Playwright multi-états, calcul APCA/WCAG, consolidation par critère
- Grille RGAA exhaustive exportable (JSON / XLSX / HTML accessible)
- Attestation conforme au modèle officiel (HTML + PDF balisé)
- Workflow de contrôles assistés (captures, preuves, validations humaines)
- API REST Nitro + documentation OpenAPI générée automatiquement
- Queue BullMQ et workers isolés pour les audits lourds
- UI Tailwind + Shadcn + Framer Motion avec dark mode et micro-interactions

## 🧱 Structure

```
/app
  /assets
  /components
  /composables
  /layouts
  /pages
  /plugins
  /server
    /api
    /jobs
    /services
      /audit
      /rgaa
        /rules
    /utils
  /tests
nuxt.config.ts
prisma/schema.prisma
```

Chaque dossier est documenté via des commentaires JSDoc et du typage Zod/TypeScript pour favoriser l'auto-complétion.

## 🚀 Démarrage

```bash
pnpm install
docker-compose up -d
pnpm prisma migrate dev
pnpm dev
```

Les variables sensibles se configurent via `runtimeConfig` (voir `nuxt.config.ts`). Pensez à créer le bucket MinIO (`rgaa-audits`) et à configurer l'URL publique pour la génération des captures.

## 🧪 Tests & CI

- `pnpm test` lance les tests unitaires (Vitest)
- `pnpm lint` assure la qualité du code
- `pnpm typecheck` vérifie le typage Nuxt

La configuration GitHub Actions (non fournie ici) doit lancer ces commandes ainsi que `pnpm build`.

## 🛠️ Ajouter une règle RGAA

1. Créez un fichier dans `app/server/services/rgaa/rules/<type>/<slug>.ts`.
2. Exportez un objet `RgaaRule` avec `isApplicable` et `run`.
3. Utilisez le contexte `RgaaRuleContext` pour accéder au DOM, aux styles calculés, aux helpers APCA et aux snapshots.
4. Fournissez `evidence` et `remediation` détaillées.
5. Déclarez la règle dans `app/server/services/rgaa/rules/index.ts`.

Un guide complet est disponible dans `app/server/services/rgaa/README_RULES.md`.

## 📦 Exports & Attestation

Les templates accessibles sont situés dans `app/server/services/templates`. Utilisez `pnpm dev:seed` pour générer des exemples et consultez `/demo` pour un aperçu UI.

## 🔐 Sécurité

- JWT (HS512) pour l'authentification côté API
- Rate limit (Nitro route rules) et CSP strictes
- Floutage PII sur les captures via Playwright + Canvas
- Rétention configurable via env `AUDIT_RETENTION_DAYS`

## 🤝 Contribuer

- Respectez la convention de commit Conventional Commits
- Ajoutez tests et documentation pour toute règle ou service ajouté
- Vérifiez l'accessibilité (aria, focus, contrastes) avant toute PR

---

Créé avec passion pour offrir une plateforme d'audit RGAA moderne, fiable et inclusive.
