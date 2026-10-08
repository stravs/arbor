// Entering malice in the editor at /pero/.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { dayNames, defaultHours, shortDate } from '../src/lib/content';
import { API, bledTime, load, lunchDay, nextWeek, sample, save, thisWeek, today } from './helpers';

const tabs = (page: Page) => page.locator('[data-week]');
// The fields of one day: week 0 is the one on show, 1 the week after; day 0 is Monday.
const fields = (page: Page, day: number, week = 0) =>
  page.locator(`[data-week-panel="${week}"] [data-malice]`).nth(day).locator('input');
// What the fields of a day hold, in order.
const expectValues = (inputs: Locator, values: string[]) =>
  expect.poll(() => inputs.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value))).toEqual(values);
const bar = (page: Page) => page.locator('.bar');
const saveButton = (page: Page) => page.getByRole('button', { name: 'Shrani' });
const message = (page: Page) => page.locator('#saved');

const open = async (page: Page) => {
  await page.goto('/pero/');
  await expect(page.locator('#form')).toBeVisible();
};
const saveForm = async (page: Page) => {
  await saveButton(page).click();
  await expect(message(page)).toContainText('Shranjeno');
};
const range = (week: string[]) => `${shortDate(week[0])}–${shortDate(week[4])}`;

test.beforeEach(({ request }) => save(request, {}));

test.describe('layout', () => {
  test('offers the week on show and the one after', async ({ page }) => {
    await open(page);
    await expect(tabs(page)).toHaveText([range(thisWeek()), range(nextWeek())]);
    await expect(tabs(page).nth(0)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-week-panel="0"]')).toBeVisible();
    await expect(page.locator('[data-week-panel="1"]')).toBeHidden();

    await tabs(page).nth(1).click();
    await expect(tabs(page).nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-week-panel="0"]')).toBeHidden();
    await expect(page.locator('[data-week-panel="1"]')).toBeVisible();
  });

  test('names each day with its date', async ({ page }) => {
    await open(page);
    const legends = page.locator('[data-week-panel="0"] legend');
    await expect(legends).toHaveText(thisWeek().map((date, i) => `${dayNames.sl[i + 1]} ${shortDate(date)}`));
    await tabs(page).nth(1).click();
    await expect(page.locator('[data-week-panel="1"] legend').first()).toHaveText(`Ponedeljek ${shortDate(nextWeek()[0])}`);
  });

  test('an empty day has three fields', async ({ page }) => {
    await open(page);
    for (let day = 0; day < 5; day++) await expectValues(fields(page, day), ['', '', '']);
  });

  test('a filled day shows its dishes and one spare field', async ({ page, request }) => {
    const malice = sample(thisWeek());
    await save(request, malice);
    await open(page);
    for (const [day, date] of thisWeek().entries()) await expectValues(fields(page, day), [...malice[date], '']);
  });

  test('typing into the last field adds another', async ({ page }) => {
    await open(page);
    await fields(page, 0).nth(2).fill('Golaž');
    await expect(fields(page, 0)).toHaveCount(4);
    await fields(page, 0).nth(3).fill('Rižota');
    await expect(fields(page, 0)).toHaveCount(5);
    // Not when an earlier one is filled.
    await fields(page, 1).nth(0).fill('Juha');
    await expect(fields(page, 1)).toHaveCount(3);
  });
});

test.describe('save button', () => {
  test('is hidden until something changes', async ({ page }) => {
    await open(page);
    await expect(bar(page)).toBeHidden();
    await fields(page, 0).first().fill('Golaž');
    await expect(saveButton(page)).toBeVisible();
  });

  test('hides again when the change is undone', async ({ page, request }) => {
    await save(request, { [thisWeek()[0]]: ['Golaž'] });
    await open(page);
    await fields(page, 0).first().fill('Golaž z žganci');
    await expect(saveButton(page)).toBeVisible();
    await fields(page, 0).first().fill('Golaž');
    await expect(bar(page)).toBeHidden();
  });

  test('ignores spaces and empty fields', async ({ page }) => {
    await open(page);
    await fields(page, 0).first().fill('   ');
    await expect(bar(page)).toBeHidden();
  });

  test('goes after saving and leaves a confirmation', async ({ page }) => {
    await open(page);
    await fields(page, 0).first().fill('Golaž');
    await saveForm(page);
    await expect(saveButton(page)).toBeHidden();
    await expect(message(page)).toBeVisible();
    // The confirmation clears on the next edit, and the button is back.
    await fields(page, 0).first().fill('Golaž s polento');
    await expect(message(page)).toHaveText('');
    await expect(saveButton(page)).toBeVisible();
  });

  test('stays with an explanation when saving fails', async ({ page }) => {
    await open(page);
    await page.route(`**${API}`, (route) => route.abort());
    await fields(page, 0).first().fill('Golaž');
    await saveButton(page).click();
    await expect(message(page)).toContainText('Povezava ni uspela');
    await expect(saveButton(page)).toBeEnabled();
    await expect(fields(page, 0).first()).toHaveValue('Golaž');
  });
});

test.describe('saving', () => {
  test('stores the dishes under the right day', async ({ page, request }) => {
    await open(page);
    await fields(page, 0).nth(0).fill('Goveja juha');
    await fields(page, 0).nth(1).fill('Dunajski zrezek');
    await fields(page, 4).nth(0).fill('Postrv');
    await saveForm(page);
    expect((await load(request)).malice).toEqual({
      [thisWeek()[0]]: ['Goveja juha', 'Dunajski zrezek'],
      [thisWeek()[4]]: ['Postrv'],
    });
  });

  test('the second tab stores under the week after', async ({ page, request }) => {
    await open(page);
    await fields(page, 2).nth(0).fill('Ta teden');
    await tabs(page).nth(1).click();
    await fields(page, 2, 1).nth(0).fill('Naslednji teden');
    await saveForm(page);
    expect((await load(request)).malice).toEqual({ [thisWeek()[2]]: ['Ta teden'], [nextWeek()[2]]: ['Naslednji teden'] });
  });

  test('shows the tidied dishes afterwards and after a reload', async ({ page }) => {
    await open(page);
    await fields(page, 0).nth(0).fill('  Goveja   juha ');
    await fields(page, 0).nth(2).fill('Rižota');
    await saveForm(page);
    // The gap closes up and a spare field follows.
    await expectValues(fields(page, 0), ['Goveja juha', 'Rižota', '']);
    await page.reload();
    await expectValues(fields(page, 0), ['Goveja juha', 'Rižota', '']);
    await expect(bar(page)).toBeHidden();
  });

  test('changing and removing dishes', async ({ page, request }) => {
    const malice = sample(thisWeek());
    await save(request, malice);
    await open(page);
    await fields(page, 0).nth(1).fill('Nova jed');
    for (const field of await fields(page, 1).all()) await field.fill('');
    await saveForm(page);

    const stored = (await load(request)).malice;
    const [monday, tuesday, wednesday] = thisWeek();
    expect(stored[monday]).toEqual([malice[monday][0], 'Nova jed', malice[monday][2]]);
    expect(stored[tuesday]).toBeUndefined();
    expect(stored[wednesday]).toEqual(malice[wednesday]);
    await expectValues(fields(page, 1), ['', '', '']);
  });

  test('saved dishes are suggested from then on', async ({ page }) => {
    await open(page);
    await expect(fields(page, 0).first()).toHaveAttribute('list', 'dishes');
    await fields(page, 0).first().fill('Jota s klobaso');
    await saveForm(page);
    await page.reload();
    await expect(page.locator('#dishes option[value="Jota s klobaso"]')).toHaveCount(1);
  });

  test('what is saved shows on the public page', async ({ page }) => {
    const day = thisWeek().indexOf(lunchDay());
    await open(page);
    await fields(page, day).nth(0).fill('Ričet');
    await fields(page, day).nth(1).fill('Ajdovi žganci');
    await saveForm(page);

    await page.clock.setFixedTime(bledTime(lunchDay(), '12:00'));
    await page.goto('/');
    await expect(page.locator('[data-lunch-today] .panel:visible ol li')).toHaveText(['Ričet', 'Ajdovi žganci']);
    await expect(page.locator('#malice [data-day]')).toHaveCount(1);
    await expect(page.locator('#malice [data-day] ol li')).toHaveText(['Ričet', 'Ajdovi žganci']);
  });
});

test.describe('a reload that gets an older version', () => {
  // Cloudflare KV can keep answering with the previous version for about a minute.
  const stale = (page: Page) =>
    page.route(`**${API}`, (route) =>
      route.request().method() === 'GET'
        ? route.fulfill({ json: { today: today(), malice: {}, hours: defaultHours, dishes: [], saved: 0 } })
        : route.continue(),
    );

  test('shows what this browser just saved instead', async ({ page }) => {
    await open(page);
    await fields(page, 0).first().fill('Golaž');
    await saveForm(page);
    await stale(page);
    await page.reload();
    await expect(fields(page, 0).first()).toHaveValue('Golaž');
    await expect(bar(page)).toBeHidden();
  });

  test('but not a save from long ago', async ({ page }) => {
    await open(page);
    await fields(page, 0).first().fill('Golaž');
    await saveForm(page);
    await stale(page);
    await page.clock.setFixedTime(Date.now() + 6 * 60_000);
    await page.reload();
    await expect(page.locator('#form')).toBeVisible();
    await expectValues(fields(page, 0), ['', '', '']);
  });
});
