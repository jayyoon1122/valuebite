'use client';

import { useAppStore } from './store';
import { t as translate, type Locale, supportedLocales, defaultLocale } from '@valuebite/i18n';

export function useTranslation() {
  const locale = useAppStore((s) => s.locale) as Locale;
  const validLocale = supportedLocales.includes(locale) ? locale : defaultLocale;

  const t = (path: string, params?: Record<string, string>) =>
    translate(validLocale, path, params);

  return { t, locale: validLocale };
}
