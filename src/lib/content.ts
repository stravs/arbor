// Editable content: weekly lunches ("malice") and opening hours.
// Shared by the Astro build, the browser scripts and the Worker, so keep it free of Astro and DOM imports.

// Opening and closing time in minutes from midnight, Europe/Ljubljana.
export type Span = [opens: number, closes: number];

export interface HoursException {
  from: string;
  to: string;
  hours: Span | null;
}

export interface Hours {
  // Index 0 = Sunday. null = closed.
  week: (Span | null)[];
  // Holidays, vacations and other dated changes. Dates are inclusive ISO days.
  exceptions: HoursException[];
}

// ISO date → dishes of the day.
export type Malice = Record<string, string[]>;

export interface Content {
  malice: Malice;
  hours: Hours;
}

const regular: Span = [10 * 60, 22 * 60];
export const defaultHours: Hours = {
  week: [null, regular, regular, regular, regular, regular, regular],
  exceptions: [],
};

export const dayNames = {
  sl: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
  de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
};

type Lang = keyof typeof dayNames;

const shortDays: Record<Lang, string[]> = {
  sl: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  it: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
};

const closedText: Record<Lang, (days: string, single: boolean) => string> = {
  sl: (days) => `${days} zaprto`,
  en: (days, single) => `Closed ${single ? 'on ' : ''}${days}`,
  it: (days) => `${days} chiuso`,
  de: (days) => `${days} geschlossen`,
};

const closedWord: Record<Lang, string> = { sl: 'zaprto', en: 'closed', it: 'chiuso', de: 'geschlossen' };

// Dates

export const dayOf = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();

export const addDays = (iso: string, n: number) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

// Monday to Friday of the week containing the given date.
export const workWeek = (iso: string) => {
  const monday = addDays(iso, -((dayOf(iso) + 6) % 7));
  return [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
};

// The week of lunches on show: the current one, or the coming one from Saturday on,
// so next week's malice appear as soon as they are entered at the weekend.
export const lunchWeek = (iso: string) => workWeek(dayOf(iso) % 6 === 0 ? addDays(iso, 2) : iso);

// The current date, weekday and minutes from midnight in Bled local time.
export const localNow = (at = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Ljubljana',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(at);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const date = `${p.year}-${p.month}-${p.day}`;
  return { date, day: dayOf(date), mins: Number(p.hour) * 60 + Number(p.minute) };
};

export const shortDate = (iso: string | null, lang: Lang = 'sl') => {
  if (!iso) return '';
  const [, m, d] = iso.split('-').map(Number);
  return lang === 'sl' ? `${d}. ${m}.` : lang === 'de' ? `${d}.${m}.` : `${d}/${m}`;
};

// Hours

export const hoursOn = (hours: Hours, date: string) => {
  const exception = hours.exceptions.find((e) => e.from <= date && date <= e.to);
  return exception ? exception.hours : hours.week[dayOf(date)];
};

export const isOpen = (hours: Hours, now: { date: string; mins: number }) => {
  const span = hoursOn(hours, now.date);
  return !!span && now.mins >= span[0] && now.mins < span[1];
};

// 600 → "10.00" ("10:00" in English)
const clock = (mins: number, lang: Lang) =>
  `${Math.floor(mins / 60)}${lang === 'en' ? ':' : '.'}${String(mins % 60).padStart(2, '0')}`;

const spanText = (span: Span, lang: Lang) => `${clock(span[0], lang)}–${clock(span[1], lang)}`;

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Regular week as text, consecutive days with the same hours merged:
// "Pon–sob · 10.00–22.00", "Nedelja zaprto".
export const weekLines = (hours: Hours, lang: Lang, openOnly = false) => {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; span: Span | null }[] = [];
  for (const day of order) {
    const span = hours.week[day];
    const last = groups.at(-1);
    if (last && String(last.span) === String(span)) last.days.push(day);
    else groups.push({ days: [day], span });
  }
  return groups
    .filter((g) => g.span || !openOnly)
    .map(({ days, span }) => {
      const single = days.length === 1;
      const range = capital(`${shortDays[lang][days[0]]}–${shortDays[lang][days.at(-1)!]}`);
      if (span) return `${single ? capital(shortDays[lang][days[0]]) : range} · ${spanText(span, lang)}`;
      return closedText[lang](single ? dayNames[lang][days[0]] : range, single);
    });
};

// Exceptions that are running or start within the next two months: "24. 12.–26. 12. · zaprto".
export const exceptionLines = (hours: Hours, lang: Lang, today: string) =>
  hours.exceptions
    .filter((e) => e.to >= today && e.from <= addDays(today, 60))
    .map((e) => {
      const dates = e.from === e.to ? shortDate(e.from, lang) : `${shortDate(e.from, lang)}–${shortDate(e.to, lang)}`;
      return `${dates} · ${e.hours ? spanText(e.hours, lang) : closedWord[lang]}`;
    });
