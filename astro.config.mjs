import { Readable } from 'node:stream';
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

// `astro dev` runs without the Worker, so the editor at /pero/ gets its API from the real
// one (worker/index.ts) over the local KV store that `wrangler dev` and `seed:malice -- --local` use.
const devEditor = {
  name: 'dev-editor',
  enforce: 'post',
  apply: 'serve',
  configureServer(server) {
    let proxy;
    server.httpServer?.once('close', () => proxy?.then((p) => p.dispose()));
    const handle = async (req, res, next) => {
      try {
        const { env } = await (proxy ??= import('wrangler').then((w) => w.getPlatformProxy()));
        const { default: worker } = await server.ssrLoadModule('/worker/index.ts');
        const request = new Request(new URL(req.originalUrl, `http://${req.headers.host}`), {
          method: req.method,
          headers: req.headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Readable.toWeb(req),
          duplex: 'half',
        });
        const response = await worker.fetch(request, { ...env, DEV_NO_AUTH: '1' });
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (e) {
        next(e);
      }
    };
    // In front of Astro's own middlewares, which would answer the slashless path with a 404.
    return () => server.middlewares.stack.unshift({ route: '/pero/api/content', handle });
  },
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
  vite: { plugins: [devEditor] },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/pero'),
      i18n: {
        defaultLocale: 'sl',
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
  ],
});
