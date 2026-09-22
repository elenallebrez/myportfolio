import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
