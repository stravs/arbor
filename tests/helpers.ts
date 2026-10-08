import { expect, type APIRequestContext } from '@playwright/test';
import { addDays, defaultHours, localNow, lunchWeek, type Hours, type Malice } from '../src/lib/content';

export const API = '/pero/api/content';

// Unless a test sets the Worker's clock (see week.test.ts) it runs on the real one, so tests
// work with the week the editor opens on: Monday to Friday of this week, or of the coming
// one at the weekend. The public page shows that same week once it has malice.
export const today = () => localNow().date;
export const thisWeek = () => lunchWeek(today());
export const nextWeek = () => lunchWeek(addDays(thisWeek()[0], 7));
// A day of that week to stand in for "today" in the browser: the real one on a weekday.
export const lunchDay = () => (thisWeek().includes(today()) ? today() : thisWeek()[0]);

// The moment a Bled wall clock shows the given time on the given date.
export const bledTime = (date: string, time: string) => {
  const [hours, mins] = time.split(':').map(Number);
  for (const offset of [1, 2]) {
    const at = new Date(Date.parse(`${date}T${time}:00Z`) - offset * 3600e3);
    const now = localNow(at);
    if (now.date === date && now.mins === hours * 60 + mins) return at;
  }
  throw new Error(`No such time in Bled: ${date} ${time}`);
};

// Three dishes for each of the given dates.
export const sample = (dates: string[]): Malice =>
  Object.fromEntries(dates.map((date) => [date, [`Goveja juha ${date}`, `Dunajski zrezek ${date}`, `Sirovi štruklji ${date}`]]));

// Replaces everything stored, the way the editor's save does.
export const save = async (request: APIRequestContext, malice: Malice, hours: Hours = defaultHours) => {
  const res = await request.put(API, { data: { malice, hours } });
  expect(res.status()).toBe(200);
  return (await res.json()) as { today: string; malice: Malice; hours: Hours; dishes: string[]; saved: number };
};

export const load = async (request: APIRequestContext) => (await (await request.get(API)).json()) as Awaited<ReturnType<typeof save>>;
