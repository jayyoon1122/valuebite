'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PurposeChips } from '@/components/PurposeChips';
import { RestaurantCard } from '@/components/RestaurantCard';
import { NativeAdCard } from '@/components/NativeAdCard';
import { MapView } from '@/components/MapView';
import { PriceAlertBanner } from '@/components/PriceAlertBanner';
import { useAppStore } from '@/lib/store';
import { getRestaurantsForCity } from '@/lib/city-data';
import { FEED_ADS, getNextFeedAd } from '@/lib/mock-ads';
import { MapPin } from 'lucide-react';

const AD_FREQUENCY = 5;
const FIRST_AD_POSITION = 4;

export default function HomePage() {
  const router = useRouter();
  const { isMapView, userLat, userLng, selectedPurpose, countryCode, showChains, cityId, cityName } = useAppStore();
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const seedRestaurants = getRestaurantsForCity(cityId || 'tokyo');
  const [dbRestaurants, setDbRestaurants] = useState<any[]>([]);

  // Fetch real restaurants from Supabase
  useEffect(() => {
    fetch(`/api/restaurants/nearby?lat=${userLat}&lng=${userLng}&radius=15`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length > 0) setDbRestaurants(d.data); })
      .catch(() => {});
  }, [userLat, userLng]);

  // Use whichever source has more data (DB or seed)
  const allRestaurants = dbRestaurants.length > seedRestaurants.length ? dbRestaurants : (seedRestaurants.length > 0 ? seedRestaurants : dbRestaurants);
  const hasData = allRestaurants.length > 0;

  let filtered = selectedPurpose
    ? allRestaurants.filter((r) => (r.purposeFit || 0) > 0.5)
    : [...allRestaurants];

  // Chain filter
  if (!showChains) {
    filtered = filtered.filter((r) => !r.isChain);
  }

  // Build feed with interspersed ads
  const feedItems: Array<{ type: 'restaurant' | 'ad'; data: any }> = [];
  let adIndex = 0;
  filtered.forEach((r, i) => {
    feedItems.push({ type: 'restaurant', data: r });
    if ((i + 1) >= FIRST_AD_POSITION && (i + 1 - FIRST_AD_POSITION) % AD_FREQUENCY === 0 && adIndex < FEED_ADS.length) {
      feedItems.push({ type: 'ad', data: getNextFeedAd(adIndex) });
      adIndex++;
    }
  });

  // Use restaurant's own currency, not the selected country
  const renderFeed = () => (
    <>
      <h2 className="text-sm font-semibold text-[var(--vb-text-secondary)]">
        {filtered.length} restaurants nearby
      </h2>
      {feedItems.map((item, i) =>
        item.type === 'restaurant' ? (
          <RestaurantCard
            key={`r-${item.data.id}`}
            restaurant={item.data}
            countryCode={item.data.priceCurrency === 'JPY' ? 'JP' : countryCode}
          />
        ) : (
          <NativeAdCard key={`ad-${item.data.id}`} ad={item.data} />
        )
      )}
    </>
  );

  // Empty state for cities without data yet
  const renderEmptyState = () => (
    <div className="px-4 py-16 text-center max-w-md mx-auto">
      <MapPin size={48} className="text-[var(--vb-primary)] mx-auto mb-4 opacity-50" />
      <h2 className="text-xl font-bold mb-2">Coming Soon to {cityName}!</h2>
      <p className="text-sm text-[var(--vb-text-secondary)] mb-4">
        We're building the restaurant database for {cityName}. Explore a launched city below, or help us by suggesting restaurants!
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'tokyo', name: 'Tokyo', cc: 'JP', lat: 35.6762, lng: 139.6503 },
          { id: 'nyc', name: 'New York', cc: 'US', lat: 40.7128, lng: -74.006 },
          { id: 'london', name: 'London', cc: 'GB', lat: 51.5074, lng: -0.1278 },
          { id: 'paris', name: 'Paris', cc: 'FR', lat: 48.8566, lng: 2.3522 },
          { id: 'singapore', name: 'Singapore', cc: 'SG', lat: 1.3521, lng: 103.8198 },
          { id: 'dubai', name: 'Dubai', cc: 'AE', lat: 25.2048, lng: 55.2708 },
          { id: 'sydney', name: 'Sydney', cc: 'AU', lat: -33.8688, lng: 151.2093 },
          { id: 'taipei', name: 'Taipei', cc: 'TW', lat: 25.0330, lng: 121.5654 },
        ].map((city) => (
          <button
            key={city.id}
            onClick={() => {
              useAppStore.getState().setCountryCode(city.cc);
              useAppStore.getState().setCityId(city.id, city.name);
              useAppStore.getState().setUserLocation(city.lat, city.lng);
            }}
            className="px-4 py-2 bg-[var(--vb-primary)] text-white rounded-full text-sm font-semibold hover:opacity-90"
          >
            {city.name}
          </button>
        ))}
      </div>
      <button className="mt-4 px-5 py-2.5 border border-[var(--vb-border)] rounded-full text-sm font-medium hover:bg-[var(--vb-bg-secondary)]">
        Suggest Restaurant for {cityName}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <Header />
      {hasData && <PriceAlertBanner />}
      <PurposeChips />

      {!hasData ? (
        renderEmptyState()
      ) : isMapView ? (
        <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
          <MapView
            restaurants={filtered}
            center={[userLat, userLng]}
            countryCode={countryCode}
            onMarkerClick={(id) => router.push(`/restaurant/${id}`)}
          />
          {/* Bottom sheet — tap handle to toggle between peek and full */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--vb-bg)] rounded-t-2xl shadow-lg transition-all duration-300 ease-out overflow-hidden"
            style={{ height: sheetExpanded ? '75vh' : '30vh' }}
          >
            {/* Drag handle — large touch target */}
            <button
              onClick={() => setSheetExpanded(!sheetExpanded)}
              className="w-full flex flex-col items-center py-3 cursor-pointer active:bg-[var(--vb-bg-secondary)] transition"
              aria-label={sheetExpanded ? 'Collapse restaurant list' : 'Expand restaurant list'}
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-400" />
              <span className="text-xs text-[var(--vb-text-secondary)] mt-1">
                {sheetExpanded ? 'Tap to see map' : 'Tap to see more'}
              </span>
            </button>
            <div className="overflow-y-auto" style={{ height: sheetExpanded ? 'calc(75vh - 50px)' : 'calc(30vh - 50px)' }}>
              <div className="px-4 pb-20 space-y-3">{renderFeed()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">{renderFeed()}</div>
      )}

      <BottomNav />
    </div>
  );
}
