import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',              // indique la racine du projet
  publicDir: 'public',    // dossier où se trouvent les fichiers statiques
  build: {
    outDir: 'dist',       // dossier de sortie du build
  },
  server: {
    port: 5173,           // pour le test local
  },
})
