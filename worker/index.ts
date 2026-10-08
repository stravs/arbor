// Runs in front of the static site. Fills malice and opening hours from KV into the
// prerendered pages, and serves the editing API behind Cloudflare Access.
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  addDays,
  defaultHours,
  localNow,
  mergeDishes,
  shortDate,
  shownWeek,
  weekLines,
  workWeek,
  type Content,
  type Hours,
  type Malice,
  type Span,
} from '../src/lib/content';

interface Env {
  ASSETS: Fetcher;
  CONTENT: KVNamespace;
  // Cloudflare Access team domain ("name.cloudflareaccess.com") and the application's audience tag.
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  // Local development only (.dev.vars): skips the Access check.
  DEV_NO_AUTH?: string;
}

const KEY = 'content';
// Every distinct dish ever saved, kept for the editor's suggestions. Never read by the public pages.
const DISHES = 'dishes';
const pages = { '/': 'sl', '/en/': 'en', '/it/': 'it', '/de/': 'de' } as const;
type Lang = (typeof pages)[keyof typeof pages];

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/pero' || pathname.startsWith('/pero/')) {
      if (!(await authorized(request, env))) return new Response('Forbidden', { status: 403 });
      return pathname === '/pero/api/content' ? api(request, env) : env.ASSETS.fetch(request);
    }
    const lang = pages[pathname as keyof typeof pages];
    if (lang && (request.method === 'GET' || request.method === 'HEAD')) return page(request, env, lang);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

// Local development and the tests (never with Access on) may say what time it is.
const clock = (request: Request, env: Env) => {
  const at = env.DEV_NO_AUTH ? request.headers.get('x-now') : null;
  return localNow(at ? new Date(at) : undefined);
};

// Public pages

async function load(env: Env): Promise<Content> {
  // A KV outage must not take the site down: fall back to no malice and the regular hours.
  const stored = await env.CONTENT.get<Partial<Content>>(KEY, { type: 'json', cacheTtl: 60 }).catch(() => null);
  return { malice: stored?.malice ?? {}, hours: stored?.hours ?? defaultHours };
}

async function page(request: Request, env: Env, lang: Lang) {
  // The asset's validators describe the unfilled HTML, so never let it answer 304.
  const headers = new Headers(request.headers);
  headers.delete('if-none-match');
  headers.delete('if-modified-since');
  const asset = await env.ASSETS.fetch(new Request(request, { headers }));
  if (!asset.ok || !asset.headers.get('content-type')?.includes('text/html')) return asset;

  const filled = fill(await load(env), lang, clock(request, env)).transform(asset);
  const out = new Response(filled.body, filled);
  out.headers.delete('etag');
  out.headers.delete('last-modified');
  out.headers.set('cache-control', 'no-cache');
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fill({ malice, hours }: Content, lang: Lang, { date: today, mins }: ReturnType<typeof localNow>) {
  const week = shownWeek(today, malice);
  // Index 0 = Monday, matching data-day 1.
  const days = week.map((date) => malice[date] ?? []);
  const any = days.some((items) => items.length);
  // Lunch ends at 14:00. src/scripts/today.ts applies the same rule in the browser; deciding
  // it here as well means today's card is already in place when the page first paints.
  const lunchNow = !!malice[today]?.length && mins < 14 * 60;
  const index = (el: Element, attr: string) => Number(el.getAttribute(attr)) - 1;

  return new HTMLRewriter()
    .on('[data-lunch]', {
      element(el) {
        if (any) el.removeAttribute('hidden');
        else el.remove();
      },
    })
    .on('[data-lunch-today]', {
      element(el) {
        if (lunchNow) el.removeAttribute('hidden');
      },
    })
    .on('[data-day]', {
      element(el) {
        const i = index(el, 'data-day');
        if (!days[i]?.length) return el.remove();
        el.setAttribute('data-date-panel', week[i]);
        if (week[i] === today) {
          el.setAttribute('data-today', '');
          el.setAttribute('data-active', '');
        }
      },
    })
    .on('[data-lunch-date]', {
      element(el) {
        el.setInnerContent(shortDate(week[index(el, 'data-lunch-date')] ?? null));
      },
    })
    .on('[data-lunch-items]', {
      element(el) {
        // Carry over Astro's scoped-style attribute so the inserted items are styled.
        const scope = [...el.attributes].find(([name]) => name.startsWith('data-astro-cid-'))?.[0] ?? '';
        const items = days[index(el, 'data-lunch-items')] ?? [];
        el.setInnerContent(items.map((item) => `<li ${scope}>${esc(item)}</li>`).join(''), { html: true });
      },
    })
    .on('[data-hours-lines]', {
      element(el) {
        const lines = weekLines(hours, lang, el.getAttribute('data-hours-lines') === 'open');
        el.setInnerContent(lines.map(esc).join('<br />'), { html: true });
      },
    })
    .on('[data-open-status]', {
      element(el) {
        el.setAttribute('data-hours', JSON.stringify(hours));
      },
    });
}

// Editing

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

// Cloudflare Access already blocks /pero at the edge; verifying its token here keeps
// the editor closed even if the Access application is missing or misconfigured.
async function authorized(request: Request, env: Env) {
  if (env.DEV_NO_AUTH) return true;
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;
  const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`;
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  try {
    await jwtVerify(token, jwks, { issuer, audience: env.ACCESS_AUD });
    return true;
  } catch {
    return false;
  }
}

async function api(request: Request, env: Env) {
  const today = clock(request, env).date;
  if (request.method === 'GET') {
    // KV may still answer with the previous version for up to a minute after a save, so each
    // save is stamped and the editor prefers its own newer copy (src/pages/pero.astro).
    const [stored, known] = await Promise.all([
      env.CONTENT.get<Partial<Content> & { saved?: number }>(KEY, 'json'),
      env.CONTENT.get<string[]>(DISHES, 'json'),
    ]);
    return Response.json({
      today,
      malice: stored?.malice ?? {},
      hours: stored?.hours ?? defaultHours,
      dishes: mergeDishes(known ?? [], stored?.malice ?? {}),
      saved: stored?.saved ?? 0,
    });
  }
  if (request.method !== 'PUT') return new Response('Method not allowed', { status: 405 });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return new Response('Forbidden', { status: 403 });

  let content: Content;
  try {
    content = parse(await request.json(), today);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Invalid content' }, { status: 400 });
  }
  const dishes = mergeDishes((await env.CONTENT.get<string[]>(DISHES, 'json')) ?? [], content.malice);
  const saved = Date.now();
  await Promise.all([
    env.CONTENT.put(KEY, JSON.stringify({ ...content, saved })),
    env.CONTENT.put(DISHES, JSON.stringify(dishes)),
  ]);
  return Response.json({ today, ...content, dishes, saved });
}

const isDate = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

function span(v: unknown): Span | null {
  if (v === null) return null;
  const ok =
    Array.isArray(v) && v.length === 2 && v.every((n) => Number.isInteger(n) && n >= 0 && n <= 24 * 60) && v[0] < v[1];
  if (!ok) throw new Error('Invalid opening hours');
  return [v[0], v[1]];
}

// Validates what the editor sent and drops past weeks of malice.
function parse(body: unknown, today: string): Content {
  const input = (body ?? {}) as { malice?: unknown; hours?: { week?: unknown } };

  const malice: Malice = {};
  const monday = workWeek(today)[0];
  for (const [date, items] of Object.entries(input.malice ?? {}).sort()) {
    if (!isDate(date) || !Array.isArray(items)) throw new Error('Invalid malice');
    const dishes = items
      .map((item) => String(item).replace(/\s+/g, ' ').trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 10);
    if (date >= monday && date <= addDays(monday, 60) && dishes.length) malice[date] = dishes;
  }

  const week = input.hours?.week;
  if (!Array.isArray(week) || week.length !== 7) throw new Error('Invalid opening hours');
  const hours: Hours = { week: week.map(span) };

  return { malice, hours };
}
