import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // le point de départ du projet
  publicDir: 'public', // les fichiers statiques
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
})
