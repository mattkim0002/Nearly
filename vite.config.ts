import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Chrome extension multi-entry build
// Outputs: dist/background.js, dist/content.js, dist/sidepanel/index.html
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Service worker — no React, plain TS
        background: resolve(__dirname, 'src/background/service-worker.ts'),
        // Content script — plain TS, no React
        content: resolve(__dirname, 'src/content/index.ts'),
        // Side panel React app
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
      },
      output: {
        // Keep entry chunks named predictably so manifest.json can reference them
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background.js'
          if (chunk.name === 'content') return 'content.js'
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
