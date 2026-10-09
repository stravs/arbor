// How saved malice show on the public page: the week's section and today's card in the hero.
import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { dayNames, defaultHours, localNow, openingSpec, shortDate, type Hours } from '../src/lib/content';
import { bledTime, lunchDay, nextWeek, sample, save, thisWeek } from './helpers';

// A visitor's own timezone must not matter: everything goes by the clock in Bled.
test.use({ timezoneId: 'America/New_York' });

// Opens the page as if it were the given time in Bled on the week's lunch day.
const open = async (page: Page, time = '12:00', path = '/') => {
  await page.clock.setFixedTime(bledTime(lunchDay(), time));
  await page.goto(path);
};
const dayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

const section = (page: Page) => page.locator('#malice');
const navLink = (page: Page) => page.locator('nav a[href="#malice"]');
const card = (page: Page) => page.locator('[data-lunch-today]');

test.describe('with malice for the whole week', () => {
  const malice = () => sample(thisWeek());
  test.beforeEach(({ request }) => save(request, malice()));

  test('the section lists each day with its date and dishes', async ({ page }) => {
    await open(page);
    await expect(navLink(page)).toBeVisible();
    await expect(section(page)).toBeVisible();

    const days = section(page).locator('[data-day]');
    await expect(days).toHaveCount(5);
    for (const [i, date] of thisWeek().entries()) {
      await expect(days.nth(i).locator('.day')).toHaveText(`${dayNames.sl[i + 1]} ${shortDate(date)}`);
      await expect(days.nth(i).locator('ol li')).toHaveText(malice()[date]);
    }
  });

  test('the section marks today', async ({ page }) => {
    await open(page);
    const marked = section(page).locator('[data-day]').filter({ has: page.locator('.today:visible') });
    await expect(marked).toHaveCount(1);
    await expect(marked.locator('.day')).toContainText(dayNames.sl[dayOf(lunchDay())]);
  });

  test("the hero shows today's dishes until lunch ends", async ({ page }) => {
    await open(page, '13:59');
    await expect(card(page)).toBeVisible();
    const panels = card(page).locator('.panel:visible');
    await expect(panels).toHaveCount(1);
    await expect(panels.locator('.eyebrow')).toContainText(`${dayNames.sl[dayOf(lunchDay())]} ${shortDate(lunchDay())}`);
    await expect(panels.locator('ol li')).toHaveText(malice()[lunchDay()]);
  });

  test('the hero card goes at 14:00, the section stays', async ({ page }) => {
    await open(page, '14:00');
    await expect(card(page)).toBeHidden();
    await expect(section(page).locator('[data-day]')).toHaveCount(5);
  });

  test('the hero card is there in the morning too', async ({ page }) => {
    await open(page, '07:30');
    await expect(card(page)).toBeVisible();
  });

  test('the card is already decided in the HTML, before any script runs', async ({ browser, baseURL }) => {
    // No clock to set without scripts: this goes by the real time in Bled.
    const { date, mins } = localNow();
    const lunchNow = thisWeek().includes(date) && mins < 14 * 60;
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(card(page)).toBeVisible({ visible: lunchNow });
    if (lunchNow) await expect(card(page).locator('.panel:visible ol li')).toHaveText(malice()[date]);
    await context.close();
  });

});

// Malice are written in Slovenian only, so no other language may carry any part of them.
test.describe('only the Slovenian page has malice', () => {
  const malice = () => sample(thisWeek());
  test.beforeEach(({ request }) => save(request, malice()));

  // Every language the site links to from its head, so one added later is covered too.
  const languages = async (page: Page) => {
    await page.goto('/');
    const links = page.locator('link[rel="alternate"][hreflang]:not([hreflang="x-default"])');
    return links.evaluateAll((els) =>
      els.map((el) => ({ lang: el.getAttribute('hreflang')!, path: new URL((el as HTMLLinkElement).href).pathname })),
    );
  };
  // Anything that belongs to the section, the menu link, the hero card or their filling.
  const traces = /id="malice"|href="#malice"|data-lunch|data-day|data-date-panel|class="(week|today-card)"/;

  test('the Slovenian page has the section, its menu link and the card', async ({ page, request }) => {
    await open(page);
    await expect(section(page)).toHaveCount(1);
    await expect(navLink(page)).toHaveCount(1);
    await expect(card(page)).toHaveCount(1);
    expect(await (await request.get('/')).text()).toMatch(traces);
  });

  test('no other language has any of it, shown or hidden', async ({ page, request }) => {
    const others = (await languages(page)).filter(({ lang }) => lang !== 'sl');
    expect(others.map(({ lang }) => lang).sort()).toEqual(['de', 'en', 'it']);

    for (const { lang, path } of others) {
      await test.step(lang, async () => {
        await open(page, '12:00', path);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('h1')).toBeVisible();
        await expect(section(page)).toHaveCount(0);
        await expect(navLink(page)).toHaveCount(0);
        await expect(card(page)).toHaveCount(0);

        // Nor in the HTML as sent: no hooks for the Worker to fill and none of the dishes.
        const html = await (await request.get(path)).text();
        expect(html).not.toMatch(traces);
        for (const dish of Object.values(malice()).flat()) expect(html).not.toContain(dish);
      });
    }
  });
});

// Where the menu's lunch link lands: the top of whatever it scrolled to sits at the top of the screen.
const followLunchLink = async (page: Page) => {
  const burger = page.locator('.burger');
  if (await burger.isVisible()) await burger.click();
  await navLink(page).click();
};
const atTop = (page: Page, target: string) =>
  expect.poll(() => page.locator(target).evaluate((el) => Math.abs(Math.round(el.getBoundingClientRect().top)))).toBe(0);

test.describe("the menu's lunch link", () => {
  // Monday's lunch would sit right under the heading, so today is a later day here.
  const friday = () => thisWeek()[4];
  const visit = async (page: Page) => {
    const noon = bledTime(friday(), '12:00');
    await page.clock.setFixedTime(noon);
    await page.setExtraHTTPHeaders({ 'x-now': noon.toISOString() });
    await page.goto('/');
  };

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("goes to today's lunch", async ({ page, request }) => {
      await save(request, sample(thisWeek()));
      await visit(page);
      await followLunchLink(page);
      await atTop(page, '#malice [data-today]');
    });

    test('goes to the top of the section when today has no lunch', async ({ page, request }) => {
      await save(request, sample(thisWeek().slice(0, 4)));
      await visit(page);
      await followLunchLink(page);
      await atTop(page, '#malice');
    });
  });

  test('goes to the top of the section on a wide screen', async ({ page, request }) => {
    await save(request, sample(thisWeek()));
    await visit(page);
    await followLunchLink(page);
    await atTop(page, '#malice');
  });
});

test.describe('with a day left empty', () => {
  const malice = () => sample(thisWeek().filter((date) => date !== lunchDay()));
  test.beforeEach(({ request }) => save(request, malice()));

  test('the section leaves that day out', async ({ page }) => {
    await open(page);
    const days = section(page).locator('[data-day]');
    await expect(days).toHaveCount(4);
    await expect(days.locator('.day')).not.toContainText([shortDate(lunchDay())]);
  });

  test('the hero has no card on that day', async ({ page }) => {
    await open(page);
    await expect(card(page)).toBeHidden();
  });
});

test.describe('with no malice', () => {
  test.beforeEach(({ request }) => save(request, {}));

  test('the section, its menu link and the card are gone', async ({ page }) => {
    await open(page);
    await expect(page.locator('h1')).toBeVisible();
    await expect(section(page)).toHaveCount(0);
    await expect(navLink(page)).toHaveCount(0);
    await expect(card(page)).toBeHidden();
  });

  test('malice entered only for the week after are not shown yet', async ({ page, request }) => {
    await save(request, sample(nextWeek()));
    await open(page);
    await expect(page.locator('h1')).toBeVisible();
    await expect(section(page)).toHaveCount(0);
    await expect(card(page)).toBeHidden();
  });
});

test('a dish is shown as typed, never as markup', async ({ page, request }) => {
  const dish = '<b>Golaž</b> & "žganci" <script>document.title = "x"</script>';
  await save(request, { ...sample(thisWeek()), [lunchDay()]: [dish] });
  await open(page);
  await expect(card(page).locator('.panel:visible ol li')).toHaveText([dish]);
  await expect(section(page).locator('[data-day][data-today] ol li')).toHaveText([dish]);
  await expect(section(page).locator('b')).toHaveCount(0);
  await expect(page).not.toHaveTitle('x');
});

test.describe('opening hours for search engines', () => {
  const spec = async (request: APIRequestContext, path: string) => {
    const html = await (await request.get(path)).text();
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? '';
    return JSON.parse(json).openingHoursSpecification;
  };

  test('follow the hours saved in the editor, in every language', async ({ request }) => {
    // Closed on Monday, a shorter Sunday, the other days as usual.
    const week: Hours['week'] = [[720, 1200], null, ...defaultHours.week.slice(2)];
    await save(request, {}, { week });
    for (const path of ['/', '/en/', '/it/', '/de/']) {
      expect(await spec(request, path), path).toEqual([
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '12:00', closes: '20:00' },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '22:00',
        },
      ]);
    }
  });

  test('are the regular ones again once those are saved', async ({ request }) => {
    await save(request, {});
    expect(await spec(request, '/')).toEqual(openingSpec(defaultHours));
  });
});
