# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Application CV Generator

Ce repo est devenu un petit générateur de CV en React. L'interface se compose de deux parties : un formulaire de saisie à gauche et un aperçu imprimable du CV à droite.

## Documentation globale (développeur)

### Architecture (où regarder)

- `src/components/CVForm.jsx`
  - Formulaire principal (édition des données)
  - Utilise des briques dans `src/components/cvForm/`
- `src/components/cvForm/`
  - UI réutilisable + drag & drop + éditeur de puces + constantes
  - Doc détaillée: `src/components/cvForm/README.md`
- `src/components/CVDocument.jsx`
  - (Aperçu / rendu du CV) — c’est l’endroit à compléter si tu veux un composant séparé pour l’aperçu

### Flux de données (le “contrat” à comprendre)

Le formulaire est **contrôlé**: il reçoit `cvData` depuis le parent et n’a pas la “source of truth”.
Quand l’utilisateur modifie une valeur, `CVForm` appelle des callbacks fournis par le parent.

Callbacks principaux (utilisés dans `CVForm.jsx`) :

- `onChange({ target: { name, value } })`
  - Pour les champs simples directement sur `cvData` (ex: `name`, `email`, `settings`…)
- `onAdd(sectionKey, initialItem)`
  - Ajoute un item à une liste (ex: `experiences`, `skills`…)
- `onUpdate(sectionKey, itemId, field, value)`
  - Met à jour un champ d’un item (ex: rôle d’une expérience)
- `onRemove(sectionKey, itemId)`
  - Supprime un item d’une liste
- `onReorder(sectionKey, fromIndex, toIndex)`
  - Réordonne une liste après drag & drop
- `commitToHistory()`
  - Valide une modification (utile pour undo/redo), en général appelé sur `onBlur`

### Par où commencer pour modifier quelque chose ?

- Modifier un **champ simple** (ex: téléphone) → `CVForm.jsx` + composant `Field` (`src/components/cvForm/ui/Field.jsx`)
- Modifier une **liste** (expériences, compétences...) → `CVForm.jsx` + DnD (`src/components/cvForm/dnd/*`)
- Modifier les **descriptions en puces** → `src/components/cvForm/BulletsEditor.jsx`
- Ajouter un **template** / options → `src/constants.js`

### Utilisation
1. Remplissez les champs du formulaire. Les champs **Nom**, **Titre professionnel** et **Email** sont requis.
1.5 Ajoutez une ou plusieurs photos (portrait, logo, etc.) via le champ "Photos".
1.6 complétez vos **loisirs / centres d'intérêt** dans la section dédiée (ou laissez-les vides si vous n'en avez pas).
2. Réorganisez les sections dynamiques (expériences, formations, compétences, langues, loisirs) à l'aide des flèches ▲▼.
2. Au-dessus du formulaire vous trouverez des **paramètres globaux :**
   - un **sélecteur de couleur d'accent** qui colore les bordures, boutons et éléments du CV.
   - un **switch thème (clair / sombre)** : l'aperçu bascule en mode sombre, y compris les en‑têtes et colonnes internes.
   - un **choix de langue** (français/anglais) pour les labels de l'interface.
2.5 Les champs obligatoires (Nom, Titre, Email) sont validés en temps réel : ils sont encadrés en rouge et un message apparaît si manquant. Le bouton PDF est désactivé tant que des erreurs subsistent.
3. L'aperçu se met à jour automatiquement, y compris les vignettes d'images, la liste des loisirs et les couleurs/thème choisis.
4. Pour obtenir un PDF, cliquez sur **Télécharger en PDF** dans la prévisualisation ou utilisez la fonction d'impression du navigateur (Ctrl+P). Le formulaire est masqué lors de l'impression.

### Prolongements possibles
- Ajouter des sections « Expérience » / « Éducation » dynamiques.
- Exporter en PDF côté client avec une bibliothèque (`jsPDF`, `html2canvas`).
- Valider et stocker les données.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
