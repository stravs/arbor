// Pulls the weekly lunch menu ("malice") from the current WordPress site
// and writes it to src/data/malice.json. Run: npm run sync:malice
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
    const title = decode(p.title.rendered);
    const [, d, m, y] = title.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/) ?? [];
    const items = decode(p.content.rendered)
      .split(/<\/(?:li|p)>/)
      .map((chunk) => tidy(chunk.replace(/<[^>]+>/g, ' ')))
      .filter(Boolean);
    return {
      day: Number(p.slug[0]),
      date: y ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : null,
      items,
    };
  })
  .sort((a, b) => a.day - b.day);

await writeFile(new URL('../src/data/malice.json', import.meta.url), JSON.stringify(days, null, 2) + '\n');
console.log(`Wrote ${days.length} days`);
