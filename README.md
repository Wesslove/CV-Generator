# CV Generator — &lt;W/&gt;

Générateur de CV en React (Vite) avec aperçu en direct, 9 templates, export PDF et sauvegarde locale.

## Démarrage

```bash
npm install
npm run dev
```

Build production + PWA :

```bash
npm run build
npm run preview
```

Déploiement GitHub Pages :

```bash
npm run deploy
```

## Fonctionnalités

- **9 templates** : Classique, Moderne, Minimal, Executive, Créatif, Timeline, Impact, Académique, Startup
- **Formulaire complet** : expériences, formations, certifications, projets, compétences, langues, loisirs, sections personnalisées
- **Drag & drop** pour réordonner les sections
- **Sauvegarde automatique** dans `localStorage`
- **Import / Export JSON**
- **Undo / Redo** (`Ctrl+Z` / `Ctrl+Shift+Z`)
- **Validation** : nom, titre et email obligatoires
- **Recadrage photo** (max 2 Mo)
- **Thème clair / sombre** pour l'aperçu du CV
- **Export PDF** : impression navigateur ou téléchargement direct (`html2canvas` + `jsPDF`)
- **i18n** : français / anglais
- **PWA** installable

## Architecture

```
src/
├── App.jsx                 # Orchestration principale
├── constants.js            # Templates, i18n, données initiales
├── reducer.js              # Mutations d'état du CV
├── components/
│   ├── CVForm.jsx          # Formulaire d'édition
│   ├── CVPreview.jsx       # Re-export du module cvPreview
│   ├── cvPreview/          # Templates d'aperçu (un fichier par template)
│   ├── appShell/           # TopBar, PreviewToolbar, MobileNav
│   └── hooks/              # undo/redo, validation, CSS vars, completion
└── utils/exportPdf.js      # Export PDF natif
```

## Utilisation

1. Remplissez les champs **Nom**, **Titre** et **Email** (obligatoires).
2. Choisissez un template, une couleur, une police et un thème clair/sombre.
3. L'aperçu se met à jour en temps réel.
4. Exportez via **Télécharger PDF** (impression) ou **PDF direct** (fichier `.pdf`).
5. Utilisez **Nouveau CV** pour tout réinitialiser.

## Scripts utilitaires

```bash
node scripts/generate-pwa-icons.mjs   # Régénère les icônes PWA
node scripts/split-cv-preview.mjs     # Regénère les modules cvPreview (si besoin)
```

## Configuration

- `vite.config.js` : `base: '/CV-Generator/'` pour GitHub Pages
- Modifier le `base` si vous déployez ailleurs
