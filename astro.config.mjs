import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Keep in sync with `langs` in src/i18n/index.ts.
const locales = ['sl', 'en', 'it', 'de'];
const subsets = ['latin', 'latin-ext'];
const fraunces = {
  provider: fontProviders.npm({ remote: false }),
  name: 'Fraunces Variable',
  cssVariable: '--font-fraunces',
  weights: ['100 900'],
  subsets,
  fallbacks: ['Georgia', 'serif'],
};

export default defineConfig({
  site: 'https://www.arborbled.si',
  trailingSlash: 'always',
  i18n: {
    locales,
    defaultLocale: 'sl',
    routing: { prefixDefaultLocale: false },
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  // Served from the installed @fontsource-variable packages, so builds need no network.
  fonts: [
    {
      ...fraunces,
      styles: ['normal'],
      options: { package: '@fontsource-variable/fraunces', file: 'wght.css' },
    },
    {
      ...fraunces,
      styles: ['italic'],
      options: { package: '@fontsource-variable/fraunces', file: 'wght-italic.css' },
    },
    {
      provider: fontProviders.npm({ remote: false }),
      name: 'Instrument Sans Variable',
      cssVariable: '--font-instrument-sans',
      weights: ['400 700'],
      styles: ['normal'],
      subsets,
      fallbacks: ['system-ui', 'sans-serif'],
      options: { package: '@fontsource-variable/instrument-sans', file: 'wght.css' },
    },
  ],
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'sl',
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
  ],
});
