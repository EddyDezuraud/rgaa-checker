# Ajouter une règle RGAA

1. **Choisir le type** : placez la règle dans `auto`, `assisted` ou `manual` selon l’effort humain nécessaire.
2. **Créer le fichier** : nommez-le `rgaa-<theme>-<criterion>.ts` et exportez un objet `RgaaRule`.
3. **Compléter les métadonnées** : `label`, `theme`, `wcag`, `description`, `remediation`.
4. **Définir `isApplicable`** : retourne `true` si la règle doit s’exécuter pour la page.
5. **Implémenter `run`** : renvoie un `RuleResult` avec `status`, `evidence`, `description`, `remediation`.
6. **Ajouter la règle à l’index** : importez-la dans `index.ts` du dossier correspondant.
7. **Tester** : créez un test Vitest dans `app/tests/rules/<criterion>.spec.ts`.

Les preuves (`evidence`) peuvent être de type `screenshot`, `dom` ou `note`. Utilisez des descriptions précises et des remédiations actionnables.
