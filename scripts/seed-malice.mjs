// Loads the malice from src/data/malice.dev.json into KV as the current week's lunches,
// keeping stored opening hours and other weeks. Refresh the file first with `npm run sync:malice`.
// Run: npm run seed:malice -- --local   (the `wrangler dev` store)
//      npm run seed:malice -- --remote  (the deployed site)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defaultHours, localNow, lunchWeek, mergeDishes } from '../src/lib/content.ts';

const target = process.argv[2];
if (target !== '--local' && target !== '--remote') {
  console.error('Usage: npm run seed:malice -- --local | --remote');
  process.exit(1);
}

const kv = (...args) =>
  execFileSync('npx', ['wrangler', 'kv', 'key', ...args, '--binding', 'CONTENT', target], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const get = (key) => {
  try {
    return JSON.parse(kv('get', key));
  } catch {
    return null;
  }
};

const dir = mkdtempSync(join(tmpdir(), 'arbor-seed-'));
const put = (key, value) => {
  const file = join(dir, `${key}.json`);
  writeFileSync(file, JSON.stringify(value));
  kv('put', key, '--path', file);
};

const days = JSON.parse(readFileSync(new URL('../src/data/malice.dev.json', import.meta.url), 'utf8'));
const week = lunchWeek(localNow().date);
const malice = Object.fromEntries(week.map((date, i) => [date, days[i] ?? []]).filter(([, items]) => items.length));

const content = get('content');
put('content', { malice: { ...content?.malice, ...malice }, hours: content?.hours ?? defaultHours });
put('dishes', mergeDishes(get('dishes') ?? [], malice));
console.log(`Seeded malice for ${Object.keys(malice).join(', ')} (${target.slice(2)})`);
