// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Absolute URLs for the sitemap, RSS and og:image. Set SITE_URL at build time (see Dockerfile); no domain is hardcoded.
  site: process.env.SITE_URL || 'http://localhost:4321',
  integrations: [svelte(), mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      // Dual themes emit CSS variables; global.css picks one per [data-theme].
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});