// What the editor's API stores when malice are saved.
import { expect, test } from '@playwright/test';
import { addDays, defaultHours } from '../src/lib/content';
import { API, load, nextWeek, save, thisWeek, today } from './helpers';

test.beforeEach(({ request }) => save(request, {}));

test('stores the dishes of each day and gives them back', async ({ request }) => {
  const malice = { [thisWeek()[0]]: ['Goveja juha', 'Golaž'], [nextWeek()[4]]: ['Rižota'] };
  expect((await save(request, malice)).malice).toEqual(malice);

  const stored = await load(request);
  expect(stored.malice).toEqual(malice);
  expect(stored.hours).toEqual(defaultHours);
  expect(stored.today).toBe(today());
});

test('tidies what was typed', async ({ request }) => {
  const day = thisWeek()[0];
  const { malice } = await save(request, { [day]: ['', '   ', '  Goveja   juha \n z rezanci ', 'x'.repeat(300)] });
  expect(malice[day]).toEqual(['Goveja juha z rezanci', 'x'.repeat(200)]);
});

test('keeps at most ten dishes a day', async ({ request }) => {
  const day = thisWeek()[0];
  const { malice } = await save(request, { [day]: Array.from({ length: 12 }, (_, i) => `Jed ${i + 1}`) });
  expect(malice[day]).toHaveLength(10);
  expect(malice[day].at(-1)).toBe('Jed 10');
});

test('a day with no dishes is not stored', async ({ request }) => {
  const [monday, tuesday] = thisWeek();
  const { malice } = await save(request, { [monday]: ['', ' '], [tuesday]: ['Golaž'] });
  expect(Object.keys(malice)).toEqual([tuesday]);
});

test('drops past weeks and dates far ahead', async ({ request }) => {
  // "Past" counts from the Monday of the calendar week, also at the weekend.
  const monday = addDays(today(), -((new Date(`${today()}T00:00:00Z`).getUTCDay() + 6) % 7));
  const { malice } = await save(request, {
    [addDays(monday, -3)]: ['Prejšnji teden'],
    [monday]: ['Ta teden'],
    [addDays(monday, 60)]: ['Čez dva meseca'],
    [addDays(monday, 61)]: ['Predaleč'],
  });
  expect(Object.keys(malice)).toEqual([monday, addDays(monday, 60)]);
});

test('saving replaces everything stored before', async ({ request }) => {
  const [monday, tuesday] = thisWeek();
  await save(request, { [monday]: ['Golaž'] });
  expect((await save(request, { [tuesday]: ['Rižota'] })).malice).toEqual({ [tuesday]: ['Rižota'] });
});

test('remembers every dish for the suggestions', async ({ request }) => {
  const day = thisWeek()[0];
  await save(request, { [day]: ['Bograč s kruhom'] });
  // Gone from the malice, still suggested.
  expect((await save(request, {})).dishes).toContain('Bograč s kruhom');
  expect((await load(request)).dishes).toContain('Bograč s kruhom');
});

test('stamps each save', async ({ request }) => {
  const before = Date.now();
  const { saved } = await save(request, {});
  expect(saved).toBeGreaterThanOrEqual(before);
  expect((await load(request)).saved).toBe(saved);
});

test.describe('refuses', () => {
  const put = (request: Parameters<typeof save>[0], data: unknown, headers = {}) => request.put(API, { data, headers });

  test('a date that is not a date', async ({ request }) => {
    for (const date of ['8.10.2026', '2026-13-45', 'danes'])
      expect((await put(request, { malice: { [date]: ['Golaž'] }, hours: defaultHours })).status()).toBe(400);
  });

  test('dishes that are not a list', async ({ request }) => {
    expect((await put(request, { malice: { [thisWeek()[0]]: 'Golaž' }, hours: defaultHours })).status()).toBe(400);
  });

  test('a save without opening hours', async ({ request }) => {
    expect((await put(request, { malice: {} })).status()).toBe(400);
  });

  test('a save sent from another site', async ({ request }) => {
    const res = await put(request, { malice: {}, hours: defaultHours }, { origin: 'https://example.com' });
    expect(res.status()).toBe(403);
  });

  test('anything but reading and saving', async ({ request }) => {
    expect((await request.delete(API)).status()).toBe(405);
    expect((await request.post(API, { data: {} })).status()).toBe(405);
  });

  test('and leaves what was stored alone', async ({ request }) => {
    const malice = { [thisWeek()[0]]: ['Golaž'] };
    await save(request, malice);
    await put(request, { malice: { danes: ['Rižota'] }, hours: defaultHours });
    expect((await load(request)).malice).toEqual(malice);
  });
});
