// Marks today's lunch and the open/closed status, using Bled local time.
const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Ljubljana' }));
const day = now.getDay();
const mins = now.getHours() * 60 + now.getMinutes();

document.querySelectorAll<HTMLElement>('[data-day]').forEach((el) => {
  el.toggleAttribute('data-today', Number(el.dataset.day) === day);
});

// Today's lunch bar: show only the panel dated today, and only from 6:00 until lunch ends at 14:00.
const pad = (n: number) => String(n).padStart(2, '0');
const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
document.querySelectorAll<HTMLElement>('[data-lunch-today]').forEach((bar) => {
  let any = false;
  bar.querySelectorAll<HTMLElement>('[data-date-panel]').forEach((el) => {
    const on = el.dataset.datePanel === iso;
    el.toggleAttribute('data-active', on);
    any ||= on;
  });
  // TODO: restore the 6:00–14:00 window when the design is done:
  // bar.hidden = !any || mins < 6 * 60 || mins >= 14 * 60;
  bar.hidden = !any;
});

document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
  const closedDays = (el.dataset.closedDays ?? '').split(',').filter(Boolean).map(Number);
  const open = !closedDays.includes(day) && mins >= Number(el.dataset.opens) && mins < Number(el.dataset.closes);
  el.dataset.state = open ? 'open' : 'closed';
  el.textContent = (open ? el.dataset.openText : el.dataset.closedText) ?? '';
});
