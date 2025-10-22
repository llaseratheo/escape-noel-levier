
# Escape Noël — Le Trésor de Levier

Projet React (Vite) pour l'escape game personnalisé.

## Pré-requis
- Node.js (version LTS recommandée)
- npm

## Installation & test local
```bash
# depuis le dossier du projet
npm install
npm run dev
# ouvrir http://localhost:5173
```

## Build & déploiement (Vercel)
1. Crée un dépôt GitHub et pousse les fichiers.
2. Sur https://vercel.com, clique "New Project" → Import Git Repository.
3. Vercel détecte Vite/React automatiquement. Build command: `npm run build`, Output directory: `dist`.
4. Déploye. L'URL finale sera du type https://escape-noel-levier.vercel.app.

## Admin
- Mot de passe admin: **Thégoat**
- Depuis le panneau Admin tu peux uploader les images (gymnase/mairie/cabane), saisir les réponses de la mairie (questions historiques), et saisir les coordonnées GPS + code final.

## Notes
- Les images initiales (gymnase, mairie, cabane) sont incluses dans `public/assets/`.
- Le site est en français.
