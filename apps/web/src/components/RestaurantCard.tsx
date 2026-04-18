'use client';

import Link from 'next/link';
import type { RestaurantListItem } from '@valuebite/types';
import { formatPrice, formatDistance } from '@valuebite/utils';
import { Star, MapPin, ThumbsUp } from 'lucide-react';

// Map cuisine types to emoji thumbnails for visual scanning
const CUISINE_EMOJI: Record<string, string> = {
  japanese: '🍣', sushi: '🍣', ramen: '🍜', udon: '🍜', soba: '🍜',
  yakitori: '🍢', tempura: '🍤', tonkatsu: '🥩', donburi: '🍚', gyudon: '🍚',
  teishoku: '🍱', izakaya: '🍶', okonomiyaki: '🥞', takoyaki: '🐙',
  onigiri: '🍙', bento: '🍱', kaiseki: '🍽', teppanyaki: '🥩',
  chinese: '🥡', korean: '🍖', thai: '🍛', indian: '🍛', curry: '🍛',
  vietnamese: '🍲', italian: '🍝', pizza: '🍕', french: '🥐',
  mexican: '🌮', american: '🍔', burger: '🍔', steak: '🥩',
  seafood: '🦐', mediterranean: '🥙', greek: '🥗', turkish: '🥙',
  bakery: '🥖', cafe: '☕', dessert: '🍰', ice_cream: '🍦',
  bbq: '🍖', grill: '🍖', chicken: '🍗', sandwich: '🥪',
  noodle: '🍜', dumpling: '🥟', dim_sum: '🥟', tapas: '🫒',
  nepali: '🍛', indonesian: '🍛', malaysian: '🍛',
  fast_food: '🍟', family_restaurant: '🍽', yoshinoya: '🍚',
  default: '🍽',
};

function getCuisineEmoji(cuisineTypes?: string[]): string {
  if (!cuisineTypes?.length) return CUISINE_EMOJI.default;
  for (const c of cuisineTypes) {
    const key = c.toLowerCase().replace(/[_\s]/g, '');
    for (const [k, v] of Object.entries(CUISINE_EMOJI)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }
  return CUISINE_EMOJI.default;
}

// isSponsored/promotedId kept for future in-house promoted listings
// (currently dormant — see MONETIZATION_GUIDE.md for activation path)
interface Props {
  restaurant: RestaurantListItem & { isSponsored?: boolean; promotedId?: string };
  countryCode?: string;
}

function ValueBadge({ score }: { score?: number }) {
  if (!score) return null;
  let color = 'bg-gray-100 text-gray-600';
  let label = 'Value';
  if (score >= 4.5) { color = 'bg-green-100 text-green-700'; label = 'Great Value'; }
  else if (score >= 3.5) { color = 'bg-yellow-100 text-yellow-700'; label = 'Good Value'; }
  else if (score >= 2.5) { color = 'bg-orange-100 text-orange-700'; label = 'Fair'; }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      <Star size={12} /> {score.toFixed(1)} {label}
    </span>
  );
}

function FreshnessBadge({ indicator }: { indicator: RestaurantListItem['freshnessIndicator'] }) {
  const colorMap = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };
  return (
    <span className={`text-xs ${colorMap[indicator.color]}`}>
      {indicator.label}
    </span>
  );
}

// Map currency codes to country codes for formatting
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  JPY: 'JP', USD: 'US', GBP: 'GB', EUR: 'DE', AUD: 'AU', CAD: 'CA',
  AED: 'AE', SGD: 'SG', HKD: 'HK', TWD: 'TW', KRW: 'KR', CHF: 'CH',
  CZK: 'CZ', HUF: 'HU', PLN: 'PL', TRY: 'TR', ILS: 'IL', QAR: 'QA',
  KWD: 'KW', INR: 'IN', MXN: 'MX', NZD: 'NZ',
};

export function RestaurantCard({ restaurant, countryCode = 'JP' }: Props) {
  const name = restaurant.name.en || restaurant.name.original || restaurant.name.romanized || '';
  // Always use the restaurant's own currency for price display
  const priceCountry = restaurant.priceCurrency
    ? CURRENCY_TO_COUNTRY[restaurant.priceCurrency] || countryCode
    : countryCode;
  const price = restaurant.avgMealPrice
    ? formatPrice(restaurant.avgMealPrice, priceCountry)
    : '';

  // Track sponsored click (fire-and-forget, doesn't block navigation)
  const handleClick = () => {
    if (restaurant.isSponsored && restaurant.promotedId) {
      fetch('/api/sponsored', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotedId: restaurant.promotedId }),
      }).catch(() => {});
    }
  };

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      onClick={handleClick}
      className="block bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl p-4 hover:shadow-md transition-shadow relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="w-10 h-10 rounded-lg bg-[var(--vb-bg-secondary)] flex items-center justify-center text-xl mr-3 shrink-0">
          {getCuisineEmoji(restaurant.cuisineType)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--vb-text-secondary)]">
            {restaurant.cuisineType?.filter(c => !['meal_takeaway','meal_delivery','store','lodging','bar','night_club','cafe','bakery','supermarket'].includes(c)).slice(0, 2).map((c) => (
              <span key={c} className="capitalize">{c.replace(/_/g, ' ')}</span>
            ))}
            {restaurant.isSponsored && (
              <span className="text-[10px] uppercase tracking-wide text-[var(--vb-text-secondary)] opacity-60">· Sponsored</span>
            )}
          </div>
        </div>
        <ValueBadge score={restaurant.valueScore} />
      </div>

      <div className="flex items-center gap-4 text-sm text-[var(--vb-text-secondary)] mt-2">
        {price && (
          <span className="font-semibold text-[var(--vb-text)]">{price}<span className="text-xs font-normal">/person</span></span>
        )}
        {restaurant.distance != null && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {formatDistance(restaurant.distance)}
          </span>
        )}
        {restaurant.totalReviews > 0 && (
          <span className="flex items-center gap-1">
            <ThumbsUp size={14} />
            {restaurant.totalReviews}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          {restaurant.tasteScore && (
            <span className="text-xs bg-[var(--vb-bg-secondary)] px-2 py-0.5 rounded">
              Taste {restaurant.tasteScore.toFixed(1)}
            </span>
          )}
          {restaurant.portionScore && (
            <span className="text-xs bg-[var(--vb-bg-secondary)] px-2 py-0.5 rounded">
              Portion {restaurant.portionScore.toFixed(1)}
            </span>
          )}
        </div>
        <FreshnessBadge indicator={restaurant.freshnessIndicator} />
      </div>
    </Link>
  );
}
