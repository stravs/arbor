// Which week of malice the editor opens on, which one the public page shows, and what time it is in Bled.
import { expect, test } from '@playwright/test';
import { addDays, localNow, lunchWeek, mergeDishes, shortDate, shownWeek, workWeek } from '../src/lib/content';

test.describe('lunchWeek', () => {
  const week = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];

  for (const day of week) {
    test(`on ${day} it is that week, Monday to Friday`, () => {
      expect(lunchWeek(day)).toEqual(week);
    });
  }

  test('from Saturday on it is the coming week', () => {
    const coming = week.map((day) => addDays(day, 7));
    expect(lunchWeek('2026-10-10')).toEqual(coming);
    expect(lunchWeek('2026-10-11')).toEqual(coming);
    expect(lunchWeek('2026-10-12')).toEqual(coming);
  });

  test('crosses the year', () => {
    expect(lunchWeek('2026-12-31')).toEqual(['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01']);
    expect(lunchWeek('2027-01-02')[0]).toBe('2027-01-04');
  });
});

test.describe('shownWeek', () => {
  const ending = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
  const coming = ending.map((day) => addDays(day, 7));
  const dishes = ['Golaž'];

  test('on a weekday it is that week, whatever is entered for the next', () => {
    for (const day of ending) {
      expect(shownWeek(day, {})).toEqual(ending);
      expect(shownWeek(day, { [coming[0]]: dishes })).toEqual(ending);
    }
  });

  test('at the weekend it stays the week just ended until the coming one is entered', () => {
    for (const day of ['2026-10-10', '2026-10-11']) {
      expect(shownWeek(day, {})).toEqual(ending);
      expect(shownWeek(day, { [ending[4]]: dishes })).toEqual(ending);
      // Malice further ahead don't count.
      expect(shownWeek(day, { [addDays(coming[0], 7)]: dishes })).toEqual(ending);
    }
  });

  test('at the weekend it is the coming week as soon as one of its days is entered', () => {
    for (const day of ['2026-10-10', '2026-10-11']) {
      expect(shownWeek(day, { [ending[0]]: dishes, [coming[2]]: dishes })).toEqual(coming);
      // A day saved with no dishes is not an entry.
      expect(shownWeek(day, { [coming[2]]: [] })).toEqual(ending);
    }
  });

  test('on Monday it is the new week, entered or not', () => {
    expect(shownWeek('2026-10-12', { [ending[0]]: dishes })).toEqual(coming);
    expect(shownWeek('2026-10-12', {})).toEqual(coming);
  });
});

test('workWeek stays in the week just ending on a weekend', () => {
  expect(workWeek('2026-10-10')[0]).toBe('2026-10-05');
  expect(workWeek('2026-10-11')[0]).toBe('2026-10-05');
  expect(workWeek('2026-10-12')[0]).toBe('2026-10-12');
});

test.describe('localNow', () => {
  test('is Bled time, whatever the clock of the machine', () => {
    // Summer time, UTC+2.
    expect(localNow(new Date('2026-10-08T11:59:00Z'))).toEqual({ date: '2026-10-08', day: 4, mins: 13 * 60 + 59 });
    expect(localNow(new Date('2026-10-08T12:00:00Z')).mins).toBe(14 * 60);
    // Winter time, UTC+1.
    expect(localNow(new Date('2026-11-05T12:59:00Z'))).toEqual({ date: '2026-11-05', day: 4, mins: 13 * 60 + 59 });
  });

  test('the day changes at midnight in Bled', () => {
    expect(localNow(new Date('2026-10-08T21:59:00Z'))).toEqual({ date: '2026-10-08', day: 4, mins: 23 * 60 + 59 });
    expect(localNow(new Date('2026-10-08T22:00:00Z'))).toEqual({ date: '2026-10-09', day: 5, mins: 0 });
  });
});

test('shortDate', () => {
  expect(shortDate('2026-10-08')).toBe('8. 10.');
  expect(shortDate('2027-01-04')).toBe('4. 1.');
  expect(shortDate(null)).toBe('');
});

test.describe('mergeDishes', () => {
  test('adds new dishes, each once, in Slovenian alphabetical order', () => {
    const dishes = mergeDishes(['Žganci', 'Golaž'], { '2026-10-05': ['Čufte', 'Golaž'], '2026-10-06': ['Cmoki'] });
    expect(dishes).toEqual(['Cmoki', 'Čufte', 'Golaž', 'Žganci']);
  });

  test('ignores case and keeps the latest spelling', () => {
    expect(mergeDishes(['goveja JUHA'], { '2026-10-06': ['Goveja juha'], '2026-10-05': ['GOVEJA juha'] })).toEqual(['Goveja juha']);
  });
});
