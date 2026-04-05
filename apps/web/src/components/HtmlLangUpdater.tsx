'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { REGIONS } from '@/lib/regions';

const RTL_LOCALES = new Set(['ar', 'he']);

// Find closest city from user's coordinates
function findClosestCity(lat: number, lng: number) {
  let closest = { id: 'tokyo', name: 'Tokyo', cc: 'JP', dist: Infinity, lat: 35.6762, lng: 139.6503 };
  for (const country of REGIONS) {
    for (const city of country.cities) {
      const d = Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2);
      if (d < closest.dist) {
        closest = { id: city.id, name: city.name, cc: country.code, dist: d, lat: city.lat, lng: city.lng };
      }
    }
  }
  return closest;
}

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

  // Geolocation — detect user's nearest city on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasVisited = localStorage.getItem('vb-geo-detected');
    if (hasVisited) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const city = findClosestCity(pos.coords.latitude, pos.coords.longitude);
          useAppStore.getState().setCountryCode(city.cc);
          useAppStore.getState().setCityId(city.id, city.name);
          useAppStore.getState().setUserLocation(city.lat, city.lng);
          localStorage.setItem('vb-geo-detected', 'true');
        },
        () => {
          // Permission denied — keep defaults
          localStorage.setItem('vb-geo-detected', 'true');
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  return null;
}
