// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],

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