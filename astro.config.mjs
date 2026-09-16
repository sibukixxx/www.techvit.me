// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.techvit.me',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Post-payment landing pages are noindex and must not be discoverable via the sitemap.
      filter: (page) => !page.includes('/grave-care/payment-complete/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
