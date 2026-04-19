'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useAppStore } from '@/lib/store';
import { getCityBrackets } from '@/lib/city-brackets';
import { ArrowLeft } from 'lucide-react';

const EXCLUDE_CHAINS_FOR = new Set(['date_night', 'special_occasion']);

export default function PurposeDetailPage({ params }: { params: Promise<{ purpose: string }> }) {
  const rawPurpose = use(params).purpose;
  // Normalize slug — accept both daily-eats and daily_eats formats
  const purpose = rawPurpose.replace(/-/g, '_');
  const { cityId, countryCode, locale, showChains, userLat, userLng } = useAppStore();
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const brackets = getCityBrackets(cityId || 'tokyo', countryCode);
  const bracket = brackets.find((b) => b.purposeKey === purpose);

  // Fetch from Supabase — pass purpose to API so it sorts by purpose_score and
  // includes premium restaurants (which would otherwise be cut by value_score sort).
  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants/nearby?lat=${userLat}&lng=${userLng}&radius=15&purpose=${purpose}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) setAllRestaurants(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userLat, userLng, purpose]);

  // Filter: must have purpose_score >= 0.4 (real fit, not just price match)
  // The API already sorts by purpose_score, but we apply the threshold to drop poor matches.
  let filtered = allRestaurants.filter((r) => {
    const purposeScore = r.purposeScores?.[purpose] || 0;
    return purposeScore >= 0.4;
  });

  if (EXCLUDE_CHAINS_FOR.has(purpose)) {
    filtered = filtered.filter((r) => !r.isChain);
  }
  if (!showChains) {
    filtered = filtered.filter((r) => !r.isChain);
  }

  // Already sorted by purpose_score from API, but re-sort here in case
  // additional client-side filters removed the top entries.
  filtered.sort((a, b) => {
    const scoreA = a.purposeScores?.[purpose] || 0;
    const scoreB = b.purposeScores?.[purpose] || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (b.valueScore || 0) - (a.valueScore || 0);
  });

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
            <p className="text-xs text-[var(--vb-text-secondary)]">{loading ? 'Loading...' : `${filtered.length} restaurants`}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {filtered.length > 0 ? (
          filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-lg font-semibold">No restaurants found</p>
            <p className="text-sm text-[var(--vb-text-secondary)]">Try a different category or change your city</p>
          </div>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
}
