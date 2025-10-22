import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ important pour Vercel
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
})
