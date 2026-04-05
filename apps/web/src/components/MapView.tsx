'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { RestaurantListItem } from '@valuebite/types';
import { formatPrice } from '@valuebite/utils';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

// Component to programmatically update map center
const ChangeView = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { useMap } = mod;
    return function ChangeViewInner({ center, zoom }: { center: [number, number]; zoom: number }) {
      const map = useMap();
      useEffect(() => {
        map.setView(center, zoom);
      }, [center[0], center[1], zoom]);
      return null;
    };
  }),
  { ssr: false }
);

// Currency lookup for price display
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  JPY: 'JP', USD: 'US', GBP: 'GB', EUR: 'DE', AUD: 'AU', SGD: 'SG',
  AED: 'AE', TWD: 'TW', HKD: 'HK', CAD: 'CA', CHF: 'CH',
};

interface Props {
  restaurants: RestaurantListItem[];
  center: [number, number];
  countryCode?: string;
  onMarkerClick?: (id: string) => void;
}

export function MapView({ restaurants, center, countryCode = 'JP', onMarkerClick }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[var(--vb-bg-secondary)] flex items-center justify-center">
        <span className="text-[var(--vb-text-secondary)]">Loading map...</span>
      </div>
    );
  }

  // Key forces full re-mount when city changes significantly (different continent)
  const mapKey = `${Math.round(center[0])}-${Math.round(center[1])}`;

  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={13}
      className="w-full h-full"
      zoomControl={false}
    >
      <ChangeView center={center} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map((r) => {
        const priceCC = CURRENCY_TO_COUNTRY[r.priceCurrency || ''] || countryCode;
        return (
          <Marker key={r.id} position={[r.lat, r.lng]}>
            <Popup>
              <div className="p-1 min-w-[180px]">
                <h3 className="font-bold text-sm">
                  {r.name.en || r.name.original || ''}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {r.avgMealPrice ? formatPrice(r.avgMealPrice, priceCC) + '/person' : ''}
                </p>
                {r.valueScore && (
                  <p className="text-xs mt-1">
                    Value Score: <strong>{r.valueScore.toFixed(1)}</strong>/5.0
                  </p>
                )}
                <button
                  onClick={() => onMarkerClick?.(r.id)}
                  className="mt-2 text-xs text-[var(--vb-primary)] font-semibold hover:underline"
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
