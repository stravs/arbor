// Runs in front of the static site. Fills malice and opening hours from KV into the
// prerendered pages, and serves the editing API behind Cloudflare Access.
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {
  addDays,
  defaultHours,
  exceptionLines,
  localNow,
  lunchWeek,
  shortDate,
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
// Every day of malice ever saved, kept for the editor's dish suggestions. Never read by the public pages.
const HISTORY = 'history';
const pages = { '/': 'sl', '/en/': 'en', '/it/': 'it', '/de/': 'de' } as const;
type Lang = (typeof pages)[keyof typeof pages];

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (!(await authorized(request, env))) return new Response('Forbidden', { status: 403 });
      return pathname === '/admin/api/content' ? api(request, env) : env.ASSETS.fetch(request);
    }
    const lang = pages[pathname as keyof typeof pages];
    if (lang && (request.method === 'GET' || request.method === 'HEAD')) return page(request, env, lang);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

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

  const filled = fill(await load(env), lang).transform(asset);
  const out = new Response(filled.body, filled);
  out.headers.delete('etag');
  out.headers.delete('last-modified');
  out.headers.set('cache-control', 'no-cache');
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fill({ malice, hours }: Content, lang: Lang) {
  const today = localNow().date;
  const week = lunchWeek(today);
  // Index 0 = Monday, matching data-day 1.
  const days = week.map((date) => malice[date] ?? []);
  const any = days.some((items) => items.length);
  const index = (el: Element, attr: string) => Number(el.getAttribute(attr)) - 1;

  return new HTMLRewriter()
    .on('[data-lunch]', {
      element(el) {
        if (any) el.removeAttribute('hidden');
        else el.remove();
      },
    })
    .on('[data-day]', {
      element(el) {
        const i = index(el, 'data-day');
        if (days[i]?.length) el.setAttribute('data-date-panel', week[i]);
        else el.remove();
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
        const openOnly = el.getAttribute('data-hours-lines') === 'open';
        const lines = openOnly
          ? weekLines(hours, lang, true)
          : [...weekLines(hours, lang), ...exceptionLines(hours, lang, today)];
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

// Cloudflare Access already blocks /admin at the edge; verifying its token here keeps
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
  const today = localNow().date;
  if (request.method === 'GET') {
    // No cacheTtl here: the editor should see what was last saved.
    const [stored, history] = await Promise.all([
      env.CONTENT.get<Partial<Content>>(KEY, 'json'),
      env.CONTENT.get<Malice>(HISTORY, 'json'),
    ]);
    return Response.json({
      today,
      malice: stored?.malice ?? {},
      hours: stored?.hours ?? defaultHours,
      dishes: dishes(history ?? {}),
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
  // The saved malice are the whole truth from this Monday on; older days in the history stay as they were.
  const monday = workWeek(today)[0];
  const past = Object.entries((await env.CONTENT.get<Malice>(HISTORY, 'json')) ?? {}).filter(([date]) => date < monday);
  const history: Malice = { ...Object.fromEntries(past), ...content.malice };
  await Promise.all([
    env.CONTENT.put(KEY, JSON.stringify(content)),
    env.CONTENT.put(HISTORY, JSON.stringify(history)),
  ]);
  return Response.json({ today, ...content, dishes: dishes(history) });
}

// Distinct dishes from the history, most often served first. Spelling follows the latest use.
function dishes(history: Malice) {
  const seen = new Map<string, { text: string; count: number }>();
  for (const date of Object.keys(history).sort()) {
    for (const text of history[date]) {
      const key = text.toLocaleLowerCase('sl');
      seen.set(key, { text, count: (seen.get(key)?.count ?? 0) + 1 });
    }
  }
  return [...seen.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, 'sl')).map((d) => d.text);
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

// Validates what the editor sent and drops what is over: past weeks of malice and past exceptions.
function parse(body: unknown, today: string): Content {
  const input = (body ?? {}) as { malice?: unknown; hours?: { week?: unknown; exceptions?: unknown } };

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
  const exceptions = input.hours?.exceptions ?? [];
  if (!Array.isArray(exceptions) || exceptions.length > 50) throw new Error('Invalid exceptions');
  const hours: Hours = {
    week: week.map(span),
    exceptions: exceptions
      .map((e: { from?: unknown; to?: unknown; hours?: unknown }) => {
        if (!isDate(e?.from) || !isDate(e?.to) || e.from > e.to) throw new Error('Invalid exception dates');
        return { from: e.from, to: e.to, hours: span(e.hours ?? null) };
      })
      .filter((e) => e.to >= today)
      .sort((a, b) => a.from.localeCompare(b.from)),
  };

  return { malice, hours };
}
