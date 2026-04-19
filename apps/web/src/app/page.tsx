'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PurposeChips } from '@/components/PurposeChips';
import { RestaurantCard } from '@/components/RestaurantCard';
import { MapView } from '@/components/MapView';
import { PriceAlertBanner } from '@/components/PriceAlertBanner';
import { GoogleAdSlot } from '@/components/GoogleAdSlot';
import { Onboarding } from '@/components/Onboarding';
import { useAppStore } from '@/lib/store';
import { fetchNearbyRestaurants } from '@/lib/data';
import { findNearestCity } from '@/lib/regions';
import { MapPin, Loader2, Crosshair } from 'lucide-react';

// Ad placement: every 6 organic results, starting at position 4
const AD_FREQUENCY = 6;
const FIRST_AD_POSITION = 4;
// AdSense ad slot IDs — replace with real slots after AdSense approval
// Until then, GoogleAdSlot renders nothing (no client ID env set)
const AD_SLOT_IDS = ['feed-ad-1', 'feed-ad-2', 'feed-ad-3'];

export default function HomePage() {
  const router = useRouter();
  const { isMapView, userLat, userLng, selectedPurpose, countryCode, showChains, cityId, cityName, setUserLocation, setCountryCode, setCityId } = useAppStore();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [geoAsked, setGeoAsked] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleNearMe = () => {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestCity(latitude, longitude);
        if (nearest) {
          setUserLocation(nearest.city.lat, nearest.city.lng);
          setCountryCode(nearest.country.code);
          setCityId(nearest.city.id, nearest.city.name);
        }
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  // Auto-detect location on first visit
  useEffect(() => {
    if (geoAsked) return;
    const alreadySet = localStorage.getItem('valuebite-geo-set');
    if (alreadySet) return;
    setGeoAsked(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const nearest = findNearestCity(latitude, longitude);
          if (nearest) {
            setUserLocation(nearest.city.lat, nearest.city.lng);
            setCountryCode(nearest.country.code);
            setCityId(nearest.city.id, nearest.city.name);
          }
          localStorage.setItem('valuebite-geo-set', '1');
        },
        () => { localStorage.setItem('valuebite-geo-set', '1'); },
        { timeout: 5000 }
      );
    }
  }, [geoAsked, setUserLocation, setCountryCode, setCityId]);

  // Per-purpose cache. Switching chips becomes instant for cached purposes;
  // a stale entry is shown immediately while a background refetch updates it.
  // Keyed by `${lat},${lng},${purpose}` so location changes invalidate cleanly.
  const cacheRef = useRef<Map<string, { data: any[]; ts: number }>>(new Map());
  const STALE_MS = 5 * 60 * 1000; // 5 min

  useEffect(() => {
    const key = `${userLat.toFixed(3)},${userLng.toFixed(3)},${selectedPurpose || ''}`;
    const cached = cacheRef.current.get(key);
    if (cached) {
      // Show cached instantly — no spinner
      setRestaurants(cached.data);
      setLoading(false);
      // If stale, refresh in background (no spinner)
      if (Date.now() - cached.ts > STALE_MS) {
        fetchNearbyRestaurants(userLat, userLng, 15, selectedPurpose)
          .then(data => { cacheRef.current.set(key, { data, ts: Date.now() }); setRestaurants(data); })
          .catch(() => {});
      }
      return;
    }
    // No cache — show spinner
    setLoading(true);
    fetchNearbyRestaurants(userLat, userLng, 15, selectedPurpose)
      .then(data => {
        cacheRef.current.set(key, { data, ts: Date.now() });
        setRestaurants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userLat, userLng, selectedPurpose]);

  // Apply filters
  let filtered = [...restaurants];
  if (!showChains) filtered = filtered.filter(r => !r.isChain);

  // When a purpose chip is selected, only show restaurants that genuinely
  // match that purpose (score >= 0.4). Otherwise the chip would be cosmetic.
  if (selectedPurpose) {
    filtered = filtered.filter(r => (r.purposeScores?.[selectedPurpose] || 0) >= 0.4);
  }

  // Weave AdSense ad slots into the organic feed at positions 4, 10, 16.
  // GoogleAdSlot renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT_ID is set,
  // so before AdSense approval the feed is 100% clean (no empty boxes).
  type FeedItem = { type: 'restaurant'; data: any } | { type: 'ad'; slotId: string };
  const feedItems: FeedItem[] = [];
  let adIdx = 0;
  filtered.forEach((r, i) => {
    feedItems.push({ type: 'restaurant', data: r });
    if ((i + 1) >= FIRST_AD_POSITION
        && (i + 1 - FIRST_AD_POSITION) % AD_FREQUENCY === 0
        && adIdx < AD_SLOT_IDS.length) {
      feedItems.push({ type: 'ad', slotId: AD_SLOT_IDS[adIdx++] });
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
          {/* Near Me floating button */}
          <button
            onClick={handleNearMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[1000] bg-white dark:bg-gray-800 shadow-lg rounded-full p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-600"
            title="Center on my location"
          >
            {locating ? <Loader2 size={20} className="animate-spin text-[var(--vb-primary)]" /> : <Crosshair size={20} className="text-[var(--vb-primary)]" />}
          </button>
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
                {feedItems.map((item, i) => (
                  item.type === 'restaurant'
                    ? <RestaurantCard key={`r-${item.data.id}-${i}`} restaurant={item.data} />
                    : <GoogleAdSlot key={`ad-${item.slotId}-${i}`} slotId={item.slotId} format="fluid" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-[var(--vb-text-secondary)]">{filtered.length} restaurants nearby</h2>
          {feedItems.map((item, i) => (
            item.type === 'restaurant'
              ? <RestaurantCard key={`r-${item.data.id}-${i}`} restaurant={item.data} />
              : <GoogleAdSlot key={`ad-${item.slotId}-${i}`} slotId={item.slotId} format="fluid" />
          ))}
        </div>
      )}

      <BottomNav />
      <Onboarding />
    </div>
  );
}
