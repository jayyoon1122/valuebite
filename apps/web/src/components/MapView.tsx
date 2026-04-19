'use client';

import { useEffect, useRef, useState } from 'react';
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

// Score → color (Tailwind hex) for marker tinting.
// Green ≥4.0, yellow 3.0-4.0, orange 2.0-3.0, gray <2.0 / unknown.
function valueColor(score?: number): string {
  if (!score) return '#9ca3af'; // gray
  if (score >= 4.0) return '#16a34a'; // green-600
  if (score >= 3.0) return '#eab308'; // yellow-500
  if (score >= 2.0) return '#f97316'; // orange-500
  return '#ef4444';                    // red-500
}

// Cluster cluster — groups overlapping pins with a count badge so dense city
// centers don't become an unreadable pile of pins.
const ClusteredMarkers = dynamic(
  () => Promise.all([
    import('react-leaflet'),
    import('leaflet'),
    import('leaflet.markercluster'),
    import('leaflet.markercluster/dist/MarkerCluster.css' as any).catch(() => null),
    import('leaflet.markercluster/dist/MarkerCluster.Default.css' as any).catch(() => null),
  ]).then(([rl, L]) => {
    const { useMap, Popup } = rl;
    const Lns = (L as any).default || L;
    return function ClusteredMarkersInner({ restaurants, countryCode, onMarkerClick }: {
      restaurants: RestaurantListItem[]; countryCode?: string; onMarkerClick?: (id: string) => void;
    }) {
      const map = useMap();
      const layerRef = useRef<any>(null);

      useEffect(() => {
        // Create cluster group once
        if (!layerRef.current) {
          layerRef.current = (Lns as any).markerClusterGroup({
            maxClusterRadius: 60,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
          });
          map.addLayer(layerRef.current);
        }
        const layer = layerRef.current;
        layer.clearLayers();

        for (const r of restaurants) {
          const color = valueColor(r.valueScore);
          // Tiny SVG pin colored by value score
          const html = `
            <div style="position:relative;width:28px;height:36px;">
              <svg viewBox="0 0 28 36" width="28" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
                <path d="M14 0 C 6 0, 0 6, 0 14 C 0 22, 14 36, 14 36 C 14 36, 28 22, 28 14 C 28 6, 22 0, 14 0 Z" fill="${color}" stroke="white" stroke-width="2"/>
                <circle cx="14" cy="13" r="5" fill="white"/>
              </svg>
              ${r.valueScore ? `<div style="position:absolute;top:5px;left:0;right:0;text-align:center;font-size:9px;font-weight:700;color:${color};">${r.valueScore.toFixed(1)}</div>` : ''}
            </div>`;
          const icon = (Lns as any).divIcon({
            html,
            className: 'vb-marker',
            iconSize: [28, 36],
            iconAnchor: [14, 36],
            popupAnchor: [0, -32],
          });
          const m = (Lns as any).marker([r.lat, r.lng], { icon });
          const priceCC = CURRENCY_TO_COUNTRY[r.priceCurrency || ''] || countryCode || 'JP';
          const price = r.avgMealPrice ? formatPrice(r.avgMealPrice, priceCC) + '/person' : '';
          m.bindPopup(`
            <div style="padding:4px;min-width:180px">
              <h3 style="font-weight:700;font-size:13px;margin:0 0 4px">${(r.name?.en || r.name?.original || '').replace(/</g, '&lt;')}</h3>
              ${price ? `<p style="font-size:11px;color:#666;margin:0 0 4px">${price}</p>` : ''}
              ${r.valueScore ? `<p style="font-size:11px;margin:0 0 6px">Value: <strong>${r.valueScore.toFixed(1)}</strong>/5.0</p>` : ''}
              <a href="/restaurant/${r.id}" style="font-size:11px;color:#16a34a;font-weight:600;text-decoration:none">View Details →</a>
            </div>
          `);
          m.on('click', () => onMarkerClick?.(r.id));
          layer.addLayer(m);
        }
      }, [restaurants, map, countryCode, onMarkerClick]);

      // No JSX rendering needed — all done imperatively
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
      <ClusteredMarkers restaurants={restaurants} countryCode={countryCode} onMarkerClick={onMarkerClick} />
    </MapContainer>
  );
}
