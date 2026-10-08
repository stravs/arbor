// When the public page moves on to a new week of malice. They are mostly entered on Sunday:
// last week's stay up over the weekend until then, and from Monday only the new week counts.
import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { shortDate, type Malice } from '../src/lib/content';
import { API, bledTime, load, sample } from './helpers';

const ending = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
const [FRIDAY, SATURDAY, SUNDAY, MONDAY] = ['2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12'];
const coming = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16'];
const after = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23'];

// The Worker takes the time from this header when its Access check is off, as it is in tests.
const clock = (date: string, time = '10:00') => ({ 'x-now': bledTime(date, time).toISOString() });
// Runs a group of tests on the given day, for the Worker and the browser alike.
const on = (date: string) => {
  test.use({ extraHTTPHeaders: clock(date) });
  test.beforeEach(({ page }) => page.clock.setFixedTime(bledTime(date, '10:00')));
};
// Saves as if on the given day, since a save drops the weeks before it.
const saveOn = async (request: APIRequestContext, date: string, malice: Malice) => {
  const stored = await load(request);
  const res = await request.put(API, { data: { malice, hours: stored.hours }, headers: clock(date) });
  expect(res.status()).toBe(200);
};

const section = (page: Page) => page.locator('#malice');
const navLink = (page: Page) => page.locator('nav a[href="#malice"]');
const card = (page: Page) => page.locator('[data-lunch-today]');
const dates = (page: Page) => section(page).locator('[data-day] .day span');
const short = (week: string[]) => week.map((date) => shortDate(date));

test.beforeEach(({ request }) => saveOn(request, FRIDAY, {}));

test.describe('on Friday', () => {
  on(FRIDAY);

  test('this week is on show, even with the next one entered', async ({ page, request }) => {
    await saveOn(request, FRIDAY, { ...sample(ending), ...sample(coming) });
    await page.goto('/');
    await expect(dates(page)).toHaveText(short(ending));
    await expect(card(page)).toBeVisible();
  });
});

for (const [name, day] of [['Saturday', SATURDAY], ['Sunday', SUNDAY]]) {
  test.describe(`on ${name}`, () => {
    on(day);

    test("last week's malice stay until the new ones are entered", async ({ page, request }) => {
      const malice = sample(ending);
      await saveOn(request, FRIDAY, malice);
      await page.goto('/');
      await expect(navLink(page)).toBeVisible();
      await expect(dates(page)).toHaveText(short(ending));
      await expect(section(page).locator('[data-day]').last().locator('ol li')).toHaveText(malice[FRIDAY]);
      // No day of it is today.
      await expect(section(page).locator('.today:visible')).toHaveCount(0);
      await expect(card(page)).toBeHidden();
    });

    test('malice for the week after next do not replace them', async ({ page, request }) => {
      await saveOn(request, FRIDAY, { ...sample(ending), ...sample(after) });
      await page.goto('/');
      await expect(dates(page)).toHaveText(short(ending));
    });

    test('the new week takes over as soon as it is entered', async ({ page, request }) => {
      const malice = { ...sample(ending), ...sample(coming) };
      await saveOn(request, day, malice);
      await page.goto('/');
      await expect(dates(page)).toHaveText(short(coming));
      await expect(section(page).locator('[data-day]').first().locator('ol li')).toHaveText(malice[MONDAY]);
      await expect(card(page)).toBeHidden();
    });

    test('one entered day of the new week is enough', async ({ page, request }) => {
      await saveOn(request, day, { ...sample(ending), ...sample([coming[2]]) });
      await page.goto('/');
      await expect(dates(page)).toHaveText(short([coming[2]]));
    });

    test('with neither week entered there is no section', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(section(page)).toHaveCount(0);
      await expect(navLink(page)).toHaveCount(0);
    });
  });
}

test.describe('on Monday', () => {
  on(MONDAY);

  test("with no new malice the section is gone, though last week's are still stored", async ({ page, request }) => {
    await saveOn(request, SUNDAY, sample(ending));
    expect(Object.keys((await load(request)).malice)).toEqual(ending);
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(section(page)).toHaveCount(0);
    await expect(navLink(page)).toHaveCount(0);
    await expect(card(page)).toBeHidden();
  });

  test('it comes back when the new week is entered', async ({ page, request }) => {
    const malice = sample(coming);
    await saveOn(request, SUNDAY, sample(ending));
    await saveOn(request, MONDAY, malice);
    await page.goto('/');
    await expect(dates(page)).toHaveText(short(coming));
    await expect(card(page).locator('.panel:visible ol li')).toHaveText(malice[MONDAY]);
  });

  test("the first save clears last week's malice from the store", async ({ request }) => {
    await saveOn(request, SUNDAY, sample(ending));
    await saveOn(request, MONDAY, { ...sample(ending), ...sample([coming[0]]) });
    expect(Object.keys((await load(request)).malice)).toEqual([coming[0]]);
  });
});

test.describe('the editor at the weekend', () => {
  on(SUNDAY);

  const fields = (page: Page, day: number, week = 0) =>
    page.locator(`[data-week-panel="${week}"] [data-malice]`).nth(day).locator('input');
  const saveForm = async (page: Page) => {
    await page.getByRole('button', { name: 'Shrani' }).click();
    await expect(page.locator('#saved')).toContainText('Shranjeno');
  };
  const range = (week: string[]) => `${shortDate(week[0])}–${shortDate(week[4])}`;

  test.beforeEach(async ({ page, request }) => {
    await saveOn(request, FRIDAY, sample(ending));
    await page.goto('/pero/');
    await expect(page.locator('#form')).toBeVisible();
  });

  test('opens on the coming week', async ({ page }) => {
    await expect(page.locator('[data-week]')).toHaveText([range(coming), range(after)]);
    await expect(fields(page, 0).first()).toHaveValue('');
  });

  test('entering the coming week puts it on the public page', async ({ page }) => {
    await fields(page, 0).first().fill('Ričet');
    await saveForm(page);
    await page.goto('/');
    await expect(dates(page)).toHaveText(short([MONDAY]));
    await expect(section(page).locator('ol li')).toHaveText(['Ričet']);
  });

  test("a save that leaves the coming week empty keeps last week's malice up", async ({ page, request }) => {
    await page.locator('[data-week]').nth(1).click();
    await fields(page, 0, 1).first().fill('Jota');
    await saveForm(page);
    expect(Object.keys((await load(request)).malice)).toEqual([...ending, after[0]]);
    await page.goto('/');
    await expect(dates(page)).toHaveText(short(ending));
  });
});
