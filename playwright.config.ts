import { defineConfig } from '@playwright/test';

const port = 8788;
// Tests run against the production build served by the real Worker (as `npm run preview` does),
// with the Access check off and a store of their own, wiped on every run, so the
// `wrangler dev` / `astro dev` store is never touched.
const store = '.wrangler/test';

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.test.ts',
  // Every test shares the one store, so they run one after another.
  workers: 1,
  reporter: 'list',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: `rm -rf ${store} && npx astro build && npx wrangler dev --port ${port} --inspector-port 0 --var DEV_NO_AUTH:1 --persist-to ${store}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
