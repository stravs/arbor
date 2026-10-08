// Marks today's lunch and the open/closed status, using Bled local time.
import { isOpen, localNow, type Hours } from '../lib/content';

const now = localNow();
const { day, mins } = now;

document.querySelectorAll<HTMLElement>('[data-day]').forEach((el) => {
  el.toggleAttribute('data-today', Number(el.dataset.day) === day);
});

// Today's lunch bar: show only the panel dated today, and only until lunch ends at 14:00.
document.querySelectorAll<HTMLElement>('[data-lunch-today]').forEach((bar) => {
  let any = false;
  bar.querySelectorAll<HTMLElement>('[data-date-panel]').forEach((el) => {
    const on = el.dataset.datePanel === now.date;
    el.toggleAttribute('data-active', on);
    any ||= on;
  });
  bar.hidden = !any || mins >= 14 * 60;
});

document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
  const open = isOpen(JSON.parse(el.dataset.hours ?? '') as Hours, now);
  el.dataset.state = open ? 'open' : 'closed';
  el.textContent = (open ? el.dataset.openText : el.dataset.closedText) ?? '';
});
