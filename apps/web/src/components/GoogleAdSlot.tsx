'use client';

import { useEffect, useRef } from 'react';

/**
 * Google AdSense slot — fills empty sponsored positions when no in-house
 * promoted listing is available.
 *
 * Setup:
 * 1. Apply at https://www.google.com/adsense (1-2 weeks approval)
 * 2. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID in Vercel env (e.g., ca-pub-1234567890)
 * 3. Add publisher script to layout.tsx (already done)
 * 4. Configure ad units → use the slot IDs here
 *
 * Until approved, this component renders nothing (empty slot, no harm).
 */
interface Props {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function GoogleAdSlot({ slotId, format = 'fluid', layoutKey = '-fb+5w+4e-db+86', className = '' }: Props) {
  const ref = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [clientId]);

  // No client ID = render nothing (Jay hasn't applied yet)
  if (!clientId) return null;

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-ad-layout-key={layoutKey}
      data-full-width-responsive="true"
    />
  );
}
