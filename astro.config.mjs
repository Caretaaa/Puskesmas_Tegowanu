import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` is the canonical origin. Keep it in sync with `SITE.url` in lib/site.ts
// and the sitemap/robots references before going live.
const site = 'https://www.puskesmastegowanu.go.id';

export default defineConfig({
  site,
  output: 'static',
  viewTransitions: true,
  compressHTML: true,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // three.module is a lazy (dynamic-imported) hero-canvas chunk;
      // 800KB keeps builds quiet while it stays off the critical path.
      chunkSizeWarningLimit: 800,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});