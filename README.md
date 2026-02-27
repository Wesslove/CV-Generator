# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Application CV Generator

Ce repo est devenu un petit générateur de CV en React. L'interface se compose de deux parties : un formulaire de saisie à gauche et un aperçu imprimable du CV à droite.

### Utilisation
1. Remplissez les champs du formulaire. Les champs **Nom**, **Titre professionnel** et **Email** sont requis.
1.5 Ajoutez une ou plusieurs photos (portrait, logo, etc.) via le champ "Photos".
2. L'aperçu se met à jour automatiquement, y compris les vignettes d'images.
3. Pour obtenir un PDF, cliquez sur **Télécharger en PDF** dans la prévisualisation ou utilisez la fonction d'impression du navigateur (Ctrl+P). Le formulaire est masqué lors de l'impression.

### Prolongements possibles
- Ajouter des sections « Expérience » / « Éducation » dynamiques.
- Exporter en PDF côté client avec une bibliothèque (`jsPDF`, `html2canvas`).
- Valider et stocker les données.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
