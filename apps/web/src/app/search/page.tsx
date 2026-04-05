'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useAppStore } from '@/lib/store';
import { getRestaurantsForCity } from '@/lib/city-data';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { cityId, cityName } = useAppStore();

  const allRestaurants = getRestaurantsForCity(cityId || 'tokyo');

  const results = q
    ? allRestaurants.filter((r) => {
        const name = (r.name.en || r.name.original || r.name.romanized || '').toLowerCase();
        const cuisine = (r.cuisineType || []).join(' ').toLowerCase();
        return name.includes(q.toLowerCase()) || cuisine.includes(q.toLowerCase());
      })
    : allRestaurants;

  return (
    <>
      <p className="text-sm text-[var(--vb-text-secondary)] px-4 mt-2">
        {q ? `${results.length} results for "${q}" in ${cityName}` : `${results.length} restaurants in ${cityName}`}
      </p>
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold">No restaurants found</p>
            <p className="text-sm text-[var(--vb-text-secondary)] mt-1">
              {allRestaurants.length === 0
                ? `No data for ${cityName} yet. Try switching to Tokyo or NYC!`
                : 'Try different keywords'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="px-4 py-3">
          <SearchBar />
        </div>
      </header>
      <Suspense fallback={<p className="text-center py-8">Loading...</p>}>
        <SearchResults />
      </Suspense>
      <BottomNav />
    </div>
  );
}
