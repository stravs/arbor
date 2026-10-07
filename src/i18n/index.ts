import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import de from './de';
import en from './en';
import it from './it';
import sl from './sl';

// Keep in sync with `i18n.locales` in astro.config.mjs.
export const langs = ['sl', 'en', 'it', 'de'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'sl';

export const langNames: Record<Lang, string> = { sl: 'Slovensko', en: 'English', it: 'Italiano', de: 'Deutsch' };
// Open Graph wants language_TERRITORY.
export const ogLocales: Record<Lang, string> = { sl: 'sl_SI', en: 'en_GB', it: 'it_IT', de: 'de_DE' };

export const t = { sl, en, it, de };

// Slovenian lives at the base path, other languages under their code (see `i18n.routing`).
export const langPath = (lang: Lang) => getRelativeLocaleUrl(lang);
export const langUrl = (lang: Lang) => getAbsoluteLocaleUrl(lang);
