'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

const RTL_LOCALES = new Set(['ar', 'he']);

export function HtmlLangUpdater() {
  const locale = useAppStore((s) => s.locale);
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  return null;
}
