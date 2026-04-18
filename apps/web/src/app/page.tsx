'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PurposeChips } from '@/components/PurposeChips';
import { RestaurantCard } from '@/components/RestaurantCard';
import { MapView } from '@/components/MapView';
import { PriceAlertBanner } from '@/components/PriceAlertBanner';
import { useAppStore } from '@/lib/store';
import { fetchNearbyRestaurants } from '@/lib/data';
import { findNearestCity } from '@/lib/regions';
import { MapPin, Loader2, Crosshair } from 'lucide-react';

// Sponsored placement: every 6 organic results, starting at position 4
const SPONSORED_FREQUENCY = 6;
const FIRST_SPONSORED_POSITION = 4;

export default function HomePage() {
  const router = useRouter();
  const { isMapView, userLat, userLng, selectedPurpose, countryCode, showChains, cityId, cityName, setUserLocation, setCountryCode, setCityId } = useAppStore();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [sponsored, setSponsored] = useState<any[]>([]);
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

  // Fetch from Supabase whenever location changes
  useEffect(() => {
    setLoading(true);
    fetchNearbyRestaurants(userLat, userLng, 15)
      .then(data => { setRestaurants(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userLat, userLng]);

  // Fetch sponsored listings (in-house promoted) — up to 3 per page view
  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    (async () => {
      const seen: string[] = [];
      const items: any[] = [];
      for (let i = 0; i < 3; i++) {
        const params = new URLSearchParams({ city: cityId, exclude: seen.join(',') });
        if (selectedPurpose) params.set('purpose', selectedPurpose);
        try {
          const r = await fetch('/api/sponsored?' + params.toString());
          const d = await r.json();
          if (d.success && d.data) {
            items.push(d.data);
            seen.push(d.data.id);
          } else {
            break;
          }
        } catch { break; }
      }
      if (!cancelled) setSponsored(items);
    })();
    return () => { cancelled = true; };
  }, [cityId, selectedPurpose]);

  // Apply filters
  let filtered = [...restaurants];
  if (!showChains) filtered = filtered.filter(r => !r.isChain);

  // Weave sponsored cards into the organic feed at positions 4, 10, 16
  // They look 100% identical to RestaurantCard (only difference: small "Sponsored" tag in cuisine row)
  const feedItems: any[] = [];
  let sponsoredIdx = 0;
  filtered.forEach((r, i) => {
    feedItems.push(r);
    if ((i + 1) >= FIRST_SPONSORED_POSITION
        && (i + 1 - FIRST_SPONSORED_POSITION) % SPONSORED_FREQUENCY === 0
        && sponsoredIdx < sponsored.length) {
      feedItems.push(sponsored[sponsoredIdx++]);
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
                  <RestaurantCard key={`${item.isSponsored ? 's' : 'r'}-${item.id}-${i}`} restaurant={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-[var(--vb-text-secondary)]">{filtered.length} restaurants nearby</h2>
          {feedItems.map((item, i) => (
            <RestaurantCard key={`${item.isSponsored ? 's' : 'r'}-${item.id}-${i}`} restaurant={item} />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
