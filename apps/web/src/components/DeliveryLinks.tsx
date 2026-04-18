'use client';

import { ExternalLink } from 'lucide-react';
import { getDeliveryLinks } from '@/lib/affiliate-links';

interface Props {
  restaurant: {
    name: { en?: string; original?: string };
    lat: number;
    lng: number;
    countryCode?: string;
  };
}

/**
 * "Order Online" buttons — Tier 3 monetization (affiliate revenue).
 *
 * Subtle integration: small chip-style buttons after Get Directions.
 * Users would search for delivery anyway — we just give them 1-tap links
 * with our affiliate code attached. No UX disruption.
 *
 * Earns ~5-10% commission per order (varies by platform).
 */
export function DeliveryLinks({ restaurant }: Props) {
  const links = getDeliveryLinks(restaurant);
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <span className="text-sm text-[var(--vb-text-secondary)] font-medium">Order online:</span>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.service}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--vb-bg-secondary)] hover:bg-[var(--vb-primary)] hover:text-white transition"
          >
            {link.label}
            <ExternalLink size={11} className="opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
}
