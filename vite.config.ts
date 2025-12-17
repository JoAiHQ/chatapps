import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: (ctx) => {
      if (ctx.file?.includes('node_modules') && ctx.file?.includes('.module.css')) {
        return {
          plugins: [],
        }
      }
      return {
        plugins: {
          '@tailwindcss/postcss': {},
          autoprefixer: {},
        },
      }
    },
  },
})
