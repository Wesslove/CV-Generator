# cvForm (documentation)

## À quoi sert ce dossier ?

`CVForm.jsx` est le **gros formulaire** qui modifie l’objet `cvData` (données du CV).
Le dossier `cvForm/` contient des **briques réutilisables** utilisées par `CVForm.jsx` :

- UI simple (champs, accordéon, bouton supprimer, barre de complétion)
- éditeur de puces (bullets)
- drag & drop (réordonner les items)
- constantes/options (templates, niveaux, etc.)

L’objectif : pouvoir modifier une partie (ex: DnD, UI d’un champ) **sans relire 400 lignes**.

## Le flux de données (le plus important)

Le formulaire est “contrôlé” : il **affiche** `cvData` et, quand l’utilisateur change quelque chose, il appelle des callbacks fournis par le parent.

### Callbacks principaux

- `onChange(eventLike)`
  - Utilisé pour les champs “simples” qui existent directement sur `cvData` (ex: `name`, `email`…)
  - Convention : on envoie un objet qui ressemble à un event React :
    - `{ target: { name: "name", value: "..." } }`
- `onAdd(sectionKey, initialItem)`
  - Ajoute un item à une liste (ex: `experiences`, `educations`…)
- `onUpdate(sectionKey, itemId, field, value)`
  - Met à jour un champ dans un item (ex: rôle d’une expérience)
- `onRemove(sectionKey, itemId)`
  - Supprime un item d’une liste
- `onReorder(sectionKey, fromIndex, toIndex)`
  - Réordonne une liste après drag & drop
- `commitToHistory()`
  - “Valide” une modification (utile pour undo/redo). En général appelé sur `onBlur`.

### Où modifier quoi ?

#### 1) Changer l’UI de base (input/textarea, accordéon…)

Va dans `cvForm/ui/` :

- `Field.jsx` : input/textarea + erreurs
- `Accordion.jsx` : sections repliables
- `RemoveBtn.jsx` : bouton supprimer (croix)
- `CompletionBar.jsx` : barre de complétion en haut

#### 2) Changer l’éditeur de description (puces)

- `BulletsEditor.jsx`
  - Gère `Enter` (ajoute une ligne) et `Backspace` (supprime une ligne vide)

#### 3) Changer le drag & drop (réorganisation)

Va dans `cvForm/dnd/` :

- `DraggableSection.jsx` : gère le contexte DnD et calcule `(fromIndex, toIndex)`
- `SortableCard.jsx` : carte draggable + poignée (handle)

#### 4) Ajouter/retirer un template, options, niveaux

- `src/constants.js`
  - `TEMPLATES`
  - `getFontOptions(t)`, `getDensityOptions(t)`, `getLangLevels(t)`, `getSkillLevels(t)`

## “Par où commencer” pour modifier le formulaire ?

1. Ouvre `CVForm.jsx` et repère la section qui t’intéresse (commentaires `/* ── ... ── */`).
2. Si c’est un **champ simple** (ex: téléphone) → c’est un `Field` + `onChange`.
3. Si c’est une **liste** (expériences, skills...) → c’est un `DraggableSection` + `onAdd/onUpdate/onRemove/onReorder`.
4. Si tu changes le comportement des puces → `BulletsEditor.jsx`.
5. Si tu changes le drag & drop → `cvForm/dnd/*`.

