import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  root: '.', // indique que index.html est à la racine
  build: {
    outDir: 'dist',
  },
})
