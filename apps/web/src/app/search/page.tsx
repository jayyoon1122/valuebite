'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useAppStore } from '@/lib/store';
import { SlidersHorizontal, X, Clock } from 'lucide-react';
import { getOpenStatus } from '@/lib/format';

const CUISINE_FILTERS = [
  'Japanese', 'Ramen', 'Sushi', 'Chinese', 'Korean', 'Thai',
  'Indian', 'Italian', 'American', 'Vietnamese', 'Mexican', 'Seafood',
];

const PRICE_FILTERS = [
  { label: 'Budget', max: 1000 },
  { label: 'Mid-range', max: 2000 },
  { label: 'Any price', max: Infinity },
];

const SORT_OPTIONS = [
  { label: 'Value', key: 'value' },
  { label: 'Distance', key: 'distance' },
  { label: 'Price: Low', key: 'price_asc' },
  { label: 'Rating', key: 'rating' },
];

function SearchResults({ liveQuery, cuisineFilter, priceMax, sortBy, openNowOnly }: {
  liveQuery: string; cuisineFilter: string | null; priceMax: number; sortBy: string; openNowOnly: boolean;
}) {
  const searchParams = useSearchParams();
  const q = liveQuery || searchParams.get('q') || '';
  const { cityName, userLat, userLng } = useAppStore();
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants/nearby?lat=${userLat}&lng=${userLng}&radius=15`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) setAllRestaurants(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userLat, userLng]);

  const results = useMemo(() => {
    let filtered = [...allRestaurants];

    // Text search
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((r: any) => {
        const name = (r.name?.en || r.name?.original || '').toLowerCase();
        const cuisine = (r.cuisineType || []).join(' ').toLowerCase();
        return name.includes(lower) || cuisine.includes(lower);
      });
    }

    // Cuisine filter
    if (cuisineFilter) {
      const cf = cuisineFilter.toLowerCase();
      filtered = filtered.filter((r: any) =>
        (r.cuisineType || []).some((c: string) => c.toLowerCase().includes(cf))
      );
    }

    // Price filter
    if (priceMax < Infinity) {
      filtered = filtered.filter((r: any) => !r.avgMealPrice || r.avgMealPrice <= priceMax);
    }

    // Open Now filter
    if (openNowOnly) {
      filtered = filtered.filter((r: any) => {
        const s = getOpenStatus(r.operatingHours, r.is24h);
        return s.state === 'open' || s.state === 'closing_soon';
      });
    }

    // Sort
    if (sortBy === 'value') filtered.sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0));
    else if (sortBy === 'distance') filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    else if (sortBy === 'price_asc') filtered.sort((a, b) => (a.avgMealPrice || 0) - (b.avgMealPrice || 0));
    else if (sortBy === 'rating') filtered.sort((a, b) => (b.tasteScore || 0) - (a.tasteScore || 0));

    return filtered;
  }, [allRestaurants, q, cuisineFilter, priceMax, sortBy, openNowOnly]);

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
            <p className="text-sm text-[var(--vb-text-secondary)]">Try different keywords or filters</p>
          </div>
        )}
      </div>
    </>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [liveQuery, setLiveQuery] = useState(initialQ);
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState(Infinity);
  const [sortBy, setSortBy] = useState('value');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = cuisineFilter || priceMax < Infinity || sortBy !== 'value' || openNowOnly;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="px-4 py-3 flex gap-2">
          <div className="flex-1">
            <SearchBar onQueryChange={setLiveQuery} initialValue={initialQ} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 p-2.5 rounded-lg border transition ${
              hasActiveFilters
                ? 'border-[var(--vb-primary)] text-[var(--vb-primary)] bg-[var(--vb-primary)]/10'
                : 'border-[var(--vb-border)] text-[var(--vb-text-secondary)]'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-3 border-t border-[var(--vb-border)] pt-3">
            {/* Cuisine chips */}
            <div>
              <p className="text-xs font-semibold text-[var(--vb-text-secondary)] mb-1.5">Cuisine</p>
              <div className="flex flex-wrap gap-1.5">
                {CUISINE_FILTERS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCuisineFilter(cuisineFilter === c ? null : c)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      cuisineFilter === c
                        ? 'bg-[var(--vb-primary)] text-white'
                        : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price chips */}
            <div>
              <p className="text-xs font-semibold text-[var(--vb-text-secondary)] mb-1.5">Price Range</p>
              <div className="flex gap-1.5">
                {PRICE_FILTERS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPriceMax(p.max)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      priceMax === p.max
                        ? 'bg-[var(--vb-primary)] text-white'
                        : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort chips */}
            <div>
              <p className="text-xs font-semibold text-[var(--vb-text-secondary)] mb-1.5">Sort by</p>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      sortBy === s.key
                        ? 'bg-[var(--vb-primary)] text-white'
                        : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Open Now chip */}
            <div>
              <p className="text-xs font-semibold text-[var(--vb-text-secondary)] mb-1.5">Availability</p>
              <button
                onClick={() => setOpenNowOnly(!openNowOnly)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  openNowOnly
                    ? 'bg-green-500 text-white'
                    : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Clock size={12} /> Open now
              </button>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={() => { setCuisineFilter(null); setPriceMax(Infinity); setSortBy('value'); setOpenNowOnly(false); }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}
      </header>
      <Suspense fallback={<p className="text-center py-8">Loading...</p>}>
        <SearchResults liveQuery={liveQuery} cuisineFilter={cuisineFilter} priceMax={priceMax} sortBy={sortBy} openNowOnly={openNowOnly} />
      </Suspense>
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  // Wrap inner in Suspense because useSearchParams requires it in Next.js.
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading…</p></div>}>
      <SearchPageInner />
    </Suspense>
  );
}
