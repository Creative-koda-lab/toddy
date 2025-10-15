// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import aws from 'astro-sst';

// https://astro.build/config
export default defineConfig({
  // Configure for SSR deployment with SST
  output: 'server',
  adapter: aws(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});
