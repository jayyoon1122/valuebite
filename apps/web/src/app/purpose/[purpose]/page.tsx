'use client';

import { use } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useAppStore } from '@/lib/store';
import { getRestaurantsForCity } from '@/lib/city-data';
import { getCityBrackets } from '@/lib/city-brackets';
import { ArrowLeft } from 'lucide-react';

// Purposes where chain restaurants typically don't fit well
const EXCLUDE_CHAINS_FOR = new Set(['date_night', 'special_occasion']);

export default function PurposeDetailPage({ params }: { params: Promise<{ purpose: string }> }) {
  const { purpose } = use(params);
  const { cityId, countryCode, locale, showChains } = useAppStore();

  const brackets = getCityBrackets(cityId || 'tokyo', countryCode);
  const bracket = brackets.find((b) => b.purposeKey === purpose);
  const allRestaurants = getRestaurantsForCity(cityId || 'tokyo');

  // Filter: price must be under bracket max, and exclude chains for romantic purposes
  let filtered = allRestaurants.filter((r) => {
    if (!bracket) return true;
    const price = r.avgMealPrice || 0;
    if (price > bracket.maxPrice) return false;
    return true;
  });

  // For Date Night / Special Occasion, exclude chains
  if (EXCLUDE_CHAINS_FOR.has(purpose)) {
    filtered = filtered.filter((r) => !r.isChain);
  }

  // Also respect global chain toggle
  if (!showChains) {
    filtered = filtered.filter((r) => !r.isChain);
  }

  // Sort by value score
  filtered.sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));

  const label = bracket?.purposeLabel?.[locale] || bracket?.purposeLabel?.en || purpose;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/purpose" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold text-lg">{bracket?.icon} {label}</h1>
            <p className="text-xs text-[var(--vb-text-secondary)]">{filtered.length} restaurants</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {filtered.length > 0 ? (
          filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-lg font-semibold">No restaurants found</p>
            <p className="text-sm text-[var(--vb-text-secondary)]">Try a different category or change your city</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
