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
import { FEED_ADS, getNextFeedAd } from '@/lib/mock-ads';
import { fetchNearbyRestaurants } from '@/lib/data';
import { MapPin, Loader2 } from 'lucide-react';

const AD_FREQUENCY = 6;
const FIRST_AD_POSITION = 4;

export default function HomePage() {
  const router = useRouter();
  const { isMapView, userLat, userLng, selectedPurpose, countryCode, showChains, cityId, cityName } = useAppStore();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase whenever location changes
  useEffect(() => {
    setLoading(true);
    fetchNearbyRestaurants(userLat, userLng, 15)
      .then(data => { setRestaurants(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userLat, userLng]);

  // Apply filters
  let filtered = [...restaurants];
  if (!showChains) filtered = filtered.filter(r => !r.isChain);

  // Build feed with ads
  const feedItems: Array<{ type: 'restaurant' | 'ad'; data: any }> = [];
  let adIdx = 0;
  filtered.forEach((r, i) => {
    feedItems.push({ type: 'restaurant', data: r });
    if ((i + 1) >= FIRST_AD_POSITION && (i + 1 - FIRST_AD_POSITION) % AD_FREQUENCY === 0 && adIdx < FEED_ADS.length) {
      feedItems.push({ type: 'ad', data: getNextFeedAd(adIdx++) });
    }
  });

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <PriceAlertBanner />
      <PurposeChips />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--vb-primary)]" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="px-4 py-16 text-center max-w-md mx-auto">
          <MapPin size={48} className="text-[var(--vb-primary)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">No restaurants found near {cityName}</h2>
          <p className="text-sm text-[var(--vb-text-secondary)] mb-4">
            We're expanding our database. Try a different city or check back soon!
          </p>
        </div>
      ) : isMapView ? (
        <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
          <MapView
            restaurants={filtered}
            center={[userLat, userLng]}
            countryCode={countryCode}
            onMarkerClick={(id) => router.push(`/restaurant/${id}`)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--vb-bg)] rounded-t-2xl shadow-lg transition-all duration-300 ease-out overflow-hidden"
            style={{ height: sheetExpanded ? '75vh' : '30vh' }}
          >
            <button
              onClick={() => setSheetExpanded(!sheetExpanded)}
              className="w-full flex flex-col items-center py-3 cursor-pointer active:bg-[var(--vb-bg-secondary)] transition"
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-400" />
              <span className="text-xs text-[var(--vb-text-secondary)] mt-1">
                {sheetExpanded ? 'Tap to see map' : 'Tap to see more'}
              </span>
            </button>
            <div className="overflow-y-auto" style={{ height: sheetExpanded ? 'calc(75vh - 50px)' : 'calc(30vh - 50px)' }}>
              <div className="px-4 pb-20 space-y-3">
                <h2 className="text-sm font-semibold text-[var(--vb-text-secondary)]">{filtered.length} restaurants nearby</h2>
                {feedItems.map((item, i) =>
                  item.type === 'restaurant' ? (
                    <RestaurantCard key={`r-${item.data.id}`} restaurant={item.data} />
                  ) : (
                    <NativeAdCard key={`ad-${item.data.id}`} ad={item.data} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-[var(--vb-text-secondary)]">{filtered.length} restaurants nearby</h2>
          {feedItems.map((item, i) =>
            item.type === 'restaurant' ? (
              <RestaurantCard key={`r-${item.data.id}`} restaurant={item.data} />
            ) : (
              <NativeAdCard key={`ad-${item.data.id}`} ad={item.data} />
            )
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
