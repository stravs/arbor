// Marks today's lunch and the open/closed status, using Bled local time.
import { isOpen, localNow, type Hours } from '../lib/content';

const now = localNow();
const { day, mins } = now;

document.querySelectorAll<HTMLElement>('[data-day]').forEach((el) => {
  el.toggleAttribute('data-today', Number(el.dataset.day) === day);
});

// Today's lunch bar: show only the panel dated today, and only from 6:00 until lunch ends at 14:00.
document.querySelectorAll<HTMLElement>('[data-lunch-today]').forEach((bar) => {
  let any = false;
  bar.querySelectorAll<HTMLElement>('[data-date-panel]').forEach((el) => {
    const on = el.dataset.datePanel === now.date;
    el.toggleAttribute('data-active', on);
    any ||= on;
  });
  // TODO: restore the 6:00–14:00 window when the design is done:
  // bar.hidden = !any || mins < 6 * 60 || mins >= 14 * 60;
  bar.hidden = !any;
});

document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
  const open = isOpen(JSON.parse(el.dataset.hours ?? '') as Hours, now);
  el.dataset.state = open ? 'open' : 'closed';
  el.textContent = (open ? el.dataset.openText : el.dataset.closedText) ?? '';
});
