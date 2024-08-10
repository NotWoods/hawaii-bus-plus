import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  plugins: [preact(), tailwind()],
  srcDir: 'astro',
});
