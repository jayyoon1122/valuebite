'use client';

import { ExternalLink, MoreHorizontal } from 'lucide-react';
import type { NativeAdData } from '@/lib/mock-ads';

interface Props {
  ad: NativeAdData;
}

/**
 * Instagram-style native ad card
 * Designed to blend naturally with the restaurant feed
 * In production: served by Google AdMob or Meta Audience Network SDK
 */
export function NativeAdCard({ ad }: Props) {
  return (
    <div className="bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl overflow-hidden">
      {/* Header — mimics Instagram sponsored post header */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {ad.advertiser.charAt(0)}
          </div>
          <div>
            <span className="text-sm font-semibold">{ad.advertiser}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--vb-text-secondary)]">Sponsored</span>
              <span className="text-xs text-[var(--vb-text-secondary)]">·</span>
              <span className="text-xs text-[var(--vb-text-secondary)]">
                {ad.adNetwork === 'google' ? 'Google Ads' : 'Meta'}
              </span>
            </div>
          </div>
        </div>
        <button className="p-1 text-[var(--vb-text-secondary)]">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Image — full-width like Instagram */}
      {ad.imageUrl ? (
        <div className="h-40 bg-gray-200 overflow-hidden">
          <img src={ad.imageUrl} alt={ad.headline} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center text-2xl">
            {ad.advertiser.charAt(0)}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[15px] leading-snug">{ad.headline}</h3>
        <p className="text-sm text-[var(--vb-text-secondary)] mt-1 leading-relaxed">{ad.body}</p>

        {/* CTA button — prominent like Instagram */}
        <button className="mt-3 w-full py-2.5 rounded-lg bg-[var(--vb-primary)] text-white text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-1.5">
          {ad.callToAction}
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
}

/**
 * Compact banner ad for restaurant detail pages
 * Less intrusive, fits between sections
 */
export function BannerAd({ ad }: Props) {
  return (
    <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
        {ad.advertiser.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{ad.headline}</p>
        <p className="text-xs text-[var(--vb-text-secondary)] truncate">{ad.body}</p>
      </div>
      <button className="shrink-0 px-3 py-1.5 rounded-lg bg-[var(--vb-primary)] text-white text-xs font-semibold">
        {ad.callToAction}
      </button>
      <span className="absolute -top-0 right-2 text-[10px] text-[var(--vb-text-secondary)]">Ad</span>
    </div>
  );
}
