'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, X, MapPin, Languages } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { REGIONS, LANGUAGES } from '@/lib/regions';

export function RegionLanguageSelector() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'region' | 'language'>('region');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { locale, setLocale, countryCode, setCountryCode, cityId, cityName, setCityId, setUserLocation } = useAppStore();

  const currentLang = LANGUAGES.find((l) => l.code === locale);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCity = (country: typeof REGIONS[0], city: typeof REGIONS[0]['cities'][0]) => {
    setCountryCode(country.code);
    setCityId(city.id, city.name);
    setUserLocation(city.lat, city.lng);
    setOpen(false);
  };

  const selectLanguage = (code: string) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--vb-bg-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm"
        title="Region & Language"
      >
        <Globe size={16} />
        <span className="hidden sm:inline text-xs font-medium">{cityName || 'Tokyo'}</span>
        <span className="hidden sm:inline text-xs text-[var(--vb-text-secondary)]">·</span>
        <span className="text-xs text-[var(--vb-text-secondary)]">{currentLang?.native?.slice(0, 3) || 'EN'}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--vb-border)]">
            <button
              onClick={() => setTab('region')}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition ${
                tab === 'region' ? 'text-[var(--vb-primary)] border-b-2 border-[var(--vb-primary)]' : 'text-[var(--vb-text-secondary)]'
              }`}
            >
              <MapPin size={14} /> Region
            </button>
            <button
              onClick={() => setTab('language')}
              className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition ${
                tab === 'language' ? 'text-[var(--vb-primary)] border-b-2 border-[var(--vb-primary)]' : 'text-[var(--vb-text-secondary)]'
              }`}
            >
              <Languages size={14} /> Language
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {tab === 'region' ? (
              <div className="py-1">
                {REGIONS.map((country) => (
                  <div key={country.code}>
                    <button
                      onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--vb-bg-secondary)] transition ${
                        countryCode === country.code ? 'font-semibold' : ''
                      }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 text-left">{country.name}</span>
                      {countryCode === country.code && (
                        <span className="text-xs text-[var(--vb-primary)]">{cityName}</span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`text-[var(--vb-text-secondary)] transition ${expandedCountry === country.code ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedCountry === country.code && (
                      <div className="bg-[var(--vb-bg-secondary)] py-1">
                        {country.cities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => selectCity(country, city)}
                            className="w-full flex items-center gap-3 px-8 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          >
                            <span className="flex-1 text-left">{city.name}</span>
                            {cityId === city.id && <Check size={16} className="text-[var(--vb-primary)]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 p-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition ${
                      locale === lang.code
                        ? 'bg-[var(--vb-primary)] text-white'
                        : 'hover:bg-[var(--vb-bg-secondary)]'
                    }`}
                  >
                    <span className="font-medium">{lang.native}</span>
                    {locale === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
