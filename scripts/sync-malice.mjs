// Pulls the weekly lunch menu ("malice") from the old WordPress site and writes it
// to src/data/malice.dev.json, the sample that `npm run seed:malice` loads into KV.
// The site reads malice from KV (see worker/index.ts). Run: npm run sync:malice
import { writeFile } from 'node:fs/promises';

const API = 'https://www.arborbled.si/wp-json/wp/v2/posts?per_page=20&_fields=slug,title,content';

const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

const tidy = (s) => {
  const t = s
    .replace(/^\s*\d+\s*\.\s*/, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('sl');
  return t.charAt(0).toLocaleUpperCase('sl') + t.slice(1);
};

const posts = await (await fetch(API, { headers: { 'User-Agent': 'Mozilla/5.0' } })).json();

const days = posts
  .filter((p) => /^[1-5]-/.test(p.slug))
  .map((p) => {
    const items = decode(p.content.rendered)
      .split(/<\/(?:li|p)>/)
      .map((chunk) => tidy(chunk.replace(/<[^>]+>/g, ' ')))
      .filter(Boolean);
    return { day: Number(p.slug[0]), items };
  })
  .sort((a, b) => a.day - b.day)
  .map((d) => d.items);

await writeFile(new URL('../src/data/malice.dev.json', import.meta.url), JSON.stringify(days, null, 2) + '\n');
console.log(`Wrote ${days.length} days`);
