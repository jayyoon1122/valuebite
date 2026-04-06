'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useAppStore } from '@/lib/store';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { cityName, userLat, userLng } = useAppStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants/nearby?lat=${userLat}&lng=${userLng}&radius=15`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          if (q) {
            const filtered = d.data.filter((r: any) => {
              const name = (r.name?.en || r.name?.original || '').toLowerCase();
              const cuisine = (r.cuisineType || []).join(' ').toLowerCase();
              return name.includes(q.toLowerCase()) || cuisine.includes(q.toLowerCase());
            });
            setResults(filtered);
          } else {
            setResults(d.data);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, userLat, userLng]);

  return (
    <>
      <p className="text-sm text-[var(--vb-text-secondary)] px-4 mt-2">
        {loading ? 'Searching...' : q ? `${results.length} results for "${q}" in ${cityName}` : `${results.length} restaurants in ${cityName}`}
      </p>
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
        {!loading && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold">No restaurants found</p>
            <p className="text-sm text-[var(--vb-text-secondary)]">Try different keywords</p>
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
