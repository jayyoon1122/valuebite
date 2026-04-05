import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

// Lazy-loaded locales (loaded on demand when selected)
const lazyLocales: Record<string, () => Promise<any>> = {
  pt: () => import('./locales/pt.json'),
  it: () => import('./locales/it.json'),
  nl: () => import('./locales/nl.json'),
  'zh-TW': () => import('./locales/zh-TW.json'),
  tr: () => import('./locales/tr.json'),
  pl: () => import('./locales/pl.json'),
  hu: () => import('./locales/hu.json'),
  cs: () => import('./locales/cs.json'),
  el: () => import('./locales/el.json'),
  he: () => import('./locales/he.json'),
  ar: () => import('./locales/ar.json'),
  hi: () => import('./locales/hi.json'),
};

// Eagerly loaded core locales
const eagerLocales: Record<string, typeof en> = { en, ja, ko, de, fr, es };

// Cache for lazy-loaded locales
const localeCache: Record<string, typeof en> = { ...eagerLocales };

export const supportedLocales = [
  'en', 'ja', 'ko', 'de', 'fr', 'es',
  'pt', 'it', 'nl', 'zh-TW', 'tr', 'pl',
  'hu', 'cs', 'el', 'he', 'ar', 'hi',
] as const;

export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = 'en';

export type TranslationKeys = typeof en;

export function getTranslations(locale: Locale): TranslationKeys {
  return localeCache[locale] || localeCache[defaultLocale];
}

// Async loader for lazy locales
export async function loadLocale(locale: string): Promise<void> {
  if (localeCache[locale]) return;
  const loader = lazyLocales[locale];
  if (loader) {
    const mod = await loader();
    localeCache[locale] = mod.default || mod;
  }
}

export function t(locale: Locale, path: string, params?: Record<string, string>): string {
  const translations = getTranslations(locale);
  const keys = path.split('.');
  let value: unknown = translations;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof value !== 'string') return path;
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    value
  );
}
