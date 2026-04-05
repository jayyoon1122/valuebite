'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { useAppStore } from '@/lib/store';
import { getCityBrackets } from '@/lib/city-brackets';
import { formatPrice } from '@valuebite/utils';
import { ChevronRight } from 'lucide-react';

export default function PurposePage() {
  const { cityId, cityName, countryCode, locale } = useAppStore();
  const brackets = getCityBrackets(cityId || 'tokyo', countryCode);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">Browse by Purpose</h1>
          <p className="text-sm text-[var(--vb-text-secondary)]">
            Prices for {cityName || 'Tokyo'}
          </p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {brackets.map((bracket) => {
          const label = bracket.purposeLabel[locale] || bracket.purposeLabel.en;
          return (
            <Link
              key={bracket.purposeKey}
              href={`/purpose/${bracket.purposeKey}`}
              className="flex items-center gap-4 p-4 bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">{bracket.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold">{label}</h3>
                <p className="text-sm text-[var(--vb-text-secondary)]">
                  Under {formatPrice(bracket.maxPrice, countryCode)}/person
                </p>
              </div>
              <ChevronRight size={20} className="text-[var(--vb-text-secondary)]" />
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
