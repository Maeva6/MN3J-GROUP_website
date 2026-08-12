import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Compresse automatiquement toutes les images (src/assets ET public/) à
// chaque `npm run build`, quel que soit leur format d'origine (jpg, png…).
// Objectif : ne pas dépendre d'une conversion manuelle en .webp par les
// équipes terrain — une photo prise au téléphone et déposée telle quelle
// dans le projet est optimisée automatiquement au moment du build, sans
// action supplémentaire ni changement de format.
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 70 },
      jpeg: { quality: 70 },
      png: { quality: 70 },
      webp: { quality: 70 },
    }),
  ],
})
