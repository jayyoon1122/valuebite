'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@valuebite/utils';
import { BottomNav } from '@/components/BottomNav';
import { QuickRating } from '@/components/QuickRating';
import { DetailedReviewForm } from '@/components/DetailedReviewForm';
import { GoogleReviewSection } from '@/components/GoogleReviewCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PhotoGallery } from '@/components/PhotoGallery';
import { fetchRestaurantDetail } from '@/lib/data';
import { PriceSuggestionModal } from '@/components/PriceSuggestionModal';
import { useAppStore } from '@/lib/store';
import { formatDistance } from '@valuebite/utils';
import { DeliveryLinks } from '@/components/DeliveryLinks';
import {
  ArrowLeft, MapPin, MessageSquare, PenLine, Clock, Globe, Phone,
  TrendingDown, Star, ChevronDown, ChevronUp,
  Utensils, Camera, DollarSign, Navigation,
} from 'lucide-react';

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Menu items will come from the menu_items table (populated by OCR pipeline)
// No client-side review parsing — too inaccurate

// Get typical meal price — median of real main dishes, with price-gap detection
function getTypicalMealPrice(menuItems: any[]): number | null {
  if (menuItems.length === 0) return null;
  const mealItems = menuItems.filter((m: any) => ['main', 'set_meal', 'combo'].includes(m.category));
  let prices = (mealItems.length >= 1 ? mealItems : menuItems)
    .map((m: any) => m.price).filter((p: number) => p > 0).sort((a: number, b: number) => a - b);
  if (prices.length === 0) return null;
  // Price-gap detection: if a jump > 2.5x exists, items above are the real meals
  if (prices.length > 1) {
    for (let i = prices.length - 2; i >= 0; i--) {
      if (prices[i + 1] > prices[i] * 2.5) {
        prices = prices.slice(i + 1);
        break;
      }
    }
  }
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
}

// Currency-specific budget benchmarks (typical budget meal in local currency)
const BUDGET_BENCHMARKS: Record<string, number> = {
  JPY: 1000, USD: 15, GBP: 10, SGD: 12, HKD: 60, EUR: 12, AUD: 15, CAD: 15,
};

function getBenchmark(currency: string): number {
  return BUDGET_BENCHMARKS[currency] || 15;
}

// Compute value verdict — uses typical meal price (median of mains) when available
function getValueVerdict(valueScore: number | undefined, avgRating: number, totalReviews: number, menuItems: any[], currency: string) {
  const typicalPrice = getTypicalMealPrice(menuItems);
  const benchmark = getBenchmark(currency);

  if (typicalPrice && menuItems.length >= 3) {
    const priceRatio = typicalPrice / benchmark;

    if (priceRatio <= 0.7 && avgRating >= 4.0 && totalReviews >= 50)
      return { label: 'Excellent Value', color: 'text-green-500', bg: 'bg-green-500/10', icon: '🏆', desc: 'High quality at a great price' };
    if (priceRatio <= 0.9 && avgRating >= 3.8)
      return { label: 'Good Value', color: 'text-green-400', bg: 'bg-green-500/10', icon: '👍', desc: 'Quality matches the price' };
    if (priceRatio <= 1.2)
      return { label: 'Fair Price', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: '➡️', desc: 'Average value for this area' };
    return { label: 'Premium', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '💎', desc: 'Higher price point' };
  }

  // Fallback to valueScore-based verdict
  const score = valueScore || 0;
  if (score >= 4.2 && avgRating >= 4.5 && totalReviews >= 100)
    return { label: 'Excellent Value', color: 'text-green-500', bg: 'bg-green-500/10', icon: '🏆', desc: 'High quality at a great price' };
  if (score >= 3.8 && avgRating >= 4.0)
    return { label: 'Good Value', color: 'text-green-400', bg: 'bg-green-500/10', icon: '👍', desc: 'Quality matches the price' };
  if (score >= 3.2)
    return { label: 'Fair Price', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: '➡️', desc: 'Average value for this area' };
  return { label: 'Premium', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '💎', desc: 'Higher price point' };
}

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { userLat, userLng } = useAppStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPriceSuggestion, setShowPriceSuggestion] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [realPhotos, setRealPhotos] = useState<any[] | null>(null);
  const [realGoogleReviews, setRealGoogleReviews] = useState<any | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchRestaurantDetail(id).then((data) => {
      if (data) {
        setRestaurant(data);
        if (data.photos?.length > 0) setRealPhotos(data.photos);
        if (data.googleReviews?.reviews?.length > 0) setRealGoogleReviews(data.googleReviews);
        if (data.menuItems?.length > 0) setMenuItems(data.menuItems);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="animate-pulse text-[var(--vb-text-secondary)]">Loading...</div>
        <BottomNav />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-20 gap-4">
        <p className="text-lg font-semibold">Restaurant not found</p>
        <Link href="/" className="text-[var(--vb-primary)] hover:underline">Back to home</Link>
        <BottomNav />
      </div>
    );
  }

  const name = restaurant.name?.en || restaurant.name?.original || '';
  const originalName = restaurant.name?.original && restaurant.name.original !== name ? restaurant.name.original : '';
  const address = typeof restaurant.address === 'object' && restaurant.address
    ? (restaurant.address.en || restaurant.address.original || '')
    : (restaurant.address || '');
  const currencyMap: Record<string, string> = { JPY: 'JP', USD: 'US', GBP: 'GB', EUR: 'DE', AUD: 'AU', SGD: 'SG', AED: 'AE', TWD: 'TW', HKD: 'HK', CAD: 'CA', CHF: 'CH', CZK: 'CZ', HUF: 'HU', PLN: 'PL', TRY: 'TR', ILS: 'IL', INR: 'IN', MXN: 'MX' };
  const priceCountry = currencyMap[restaurant.priceCurrency || 'JPY'] || 'JP';
  const price = restaurant.avgMealPrice ? formatPrice(restaurant.avgMealPrice, priceCountry) : '';
  const totalReviewCount = realGoogleReviews?.totalReviews || restaurant?.totalReviews || 0;
  const avgRating = realGoogleReviews?.avgRating || (restaurant.valueScore ? Math.min(restaurant.valueScore, 5.0) : 0);
  const currencySymbol = restaurant.priceCurrency === 'JPY' ? '¥' : restaurant.priceCurrency === 'USD' ? '$' : restaurant.priceCurrency === 'GBP' ? '£' : restaurant.priceCurrency === 'EUR' ? '€' : '$';

  const distanceKm = restaurant.lat && restaurant.lng
    ? haversineDistance(userLat, userLng, restaurant.lat, restaurant.lng)
    : null;
  const directionsUrl = restaurant.lat && restaurant.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
    : null;

  const verdict = getValueVerdict(restaurant.valueScore, avgRating, totalReviewCount, menuItems, restaurant.priceCurrency || 'USD');
  // menuItems comes from DB (populated by OCR pipeline)

  // Cuisine types — filter noise
  const cuisines = (restaurant.cuisineType || [])
    .filter((c: string) => !['meal_takeaway','meal_delivery','store','lodging','bar','night_club','cafe','bakery','supermarket','gas_station','atm','parking','point_of_interest','establishment','food'].includes(c))
    .slice(0, 3);

  // Operating hours helper
  const renderHours = () => {
    if (restaurant.is24h) return <span className="text-sm text-[var(--vb-text-secondary)]">Open 24 hours</span>;
    if (typeof restaurant.operatingHours === 'string') return <span className="text-sm text-[var(--vb-text-secondary)]">{restaurant.operatingHours}</span>;
    if (restaurant.operatingHours && typeof restaurant.operatingHours === 'object') {
      const hours = restaurant.operatingHours as Record<string, any>;
      const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const entries = dayOrder.filter(d => hours[d] != null).map(d => {
        const val = hours[d];
        const text = typeof val === 'string' ? val : (val?.open && val?.close ? `${val.open} - ${val.close}` : JSON.stringify(val));
        return { day: d, text };
      });
      if (entries.length === 0) return <span className="text-sm text-[var(--vb-text-secondary)]">Hours vary</span>;

      // Check if all hours are the same
      const allSame = entries.every(e => e.text === entries[0].text);
      if (!showHours) {
        return (
          <span className="text-sm text-[var(--vb-text-secondary)]">
            {allSame ? `${entries[0].text} (${entries.map(e => e.day.charAt(0).toUpperCase() + e.day.slice(1)).join(', ')})` : `${entries[0].text} (${entries[0].day.charAt(0).toUpperCase() + entries[0].day.slice(1)})`}
          </span>
        );
      }
      return (
        <div className="text-sm text-[var(--vb-text-secondary)] space-y-0.5 mt-1">
          {entries.map(({ day, text }) => (
            <div key={day} className="flex justify-between">
              <span className="capitalize font-medium w-10">{day}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-20 bg-[var(--vb-bg)]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--vb-bg)]/95 backdrop-blur-sm border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-base truncate flex-1">{name}</h1>
          <FavoriteButton
            restaurantId={id}
            restaurantName={name}
            cuisine={cuisines.join(', ')}
            price={price}
            score={restaurant.valueScore}
          />
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery
        restaurantName={name}
        realPhotos={realPhotos}
        cuisineTypes={restaurant.cuisineType}
      />

      {/* Main Content */}
      <div className="px-4 pt-5 pb-4 space-y-5">

        {/* ── Name + Quick Stats ── */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight">{name}</h2>
              {originalName && <p className="text-sm text-[var(--vb-text-secondary)] mt-0.5">{originalName}</p>}
              {cuisines.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cuisines.map((c: string) => (
                    <span key={c} className="text-xs capitalize text-[var(--vb-text-secondary)] bg-[var(--vb-bg-secondary)] px-2 py-0.5 rounded-full">{c.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}
            </div>
            {restaurant.valueScore && (
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${verdict.bg} flex flex-col items-center justify-center`}>
                <div className={`text-xl font-bold ${verdict.color}`}>{restaurant.valueScore.toFixed(1)}</div>
                <div className="text-[9px] text-[var(--vb-text-secondary)] font-medium">VALUE</div>
              </div>
            )}
          </div>

          {/* Compact stats row */}
          <div className="flex items-center gap-4 mt-3 text-sm text-[var(--vb-text-secondary)]">
            {price && <span className="font-semibold text-[var(--vb-text)]">{price}<span className="font-normal text-xs">/person</span></span>}
            {avgRating > 0 && <span className="flex items-center gap-1"><Star size={13} className="text-yellow-500 fill-yellow-500" /> {avgRating.toFixed(1)}</span>}
            {totalReviewCount > 0 && <span>{totalReviewCount.toLocaleString()} reviews</span>}
            {distanceKm != null && (
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`}
              </span>
            )}
          </div>
        </div>

        {/* ── VALUE ANALYSIS CARD — the core feature ── */}
        <div className="rounded-2xl border border-[var(--vb-border)] overflow-hidden">
          <div className="px-4 py-3 bg-[var(--vb-bg-secondary)] border-b border-[var(--vb-border)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingDown size={15} className="text-[var(--vb-primary)]" />
                Value Analysis
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${verdict.bg} ${verdict.color}`}>
                {verdict.icon} {verdict.label}
              </span>
            </div>
            <p className="text-xs text-[var(--vb-text-secondary)] mt-0.5">{verdict.desc}</p>
          </div>

          <div className="p-4 space-y-3">
            {/* Price + Rating summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold">{price || '—'}</div>
                <div className="text-[10px] text-[var(--vb-text-secondary)] uppercase tracking-wide">
                  {menuItems.length > 0 ? 'Typical Meal' : 'Avg Price'}
                </div>
              </div>
              <div>
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                </div>
                <div className="text-[10px] text-[var(--vb-text-secondary)] uppercase tracking-wide">Rating</div>
              </div>
              <div>
                <div className="text-lg font-bold">{totalReviewCount > 0 ? (totalReviewCount > 999 ? `${(totalReviewCount/1000).toFixed(1)}k` : totalReviewCount) : '—'}</div>
                <div className="text-[10px] text-[var(--vb-text-secondary)] uppercase tracking-wide">Reviews</div>
              </div>
            </div>

            {/* Menu-based price insight — uses typical meal price (median of mains) */}
            {menuItems.length >= 3 && (() => {
              const typicalPrice = getTypicalMealPrice(menuItems);
              if (!typicalPrice) return null;
              const benchmark = getBenchmark(restaurant.priceCurrency || 'USD');
              const pctDiff = ((typicalPrice - benchmark) / benchmark) * 100;
              const isBelow = pctDiff < -5;
              const isAbove = pctDiff > 10;
              const mealCount = menuItems.filter((m: any) => ['main', 'set_meal', 'combo'].includes(m.category)).length;
              return (
                <div className="pt-2 border-t border-[var(--vb-border)]">
                  <div className={`text-xs px-3 py-2 rounded-lg ${isBelow ? 'bg-green-500/10 text-green-600' : isAbove ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>
                    {isBelow
                      ? `Typical meal ${Math.abs(Math.round(pctDiff))}% below budget average — great deal!`
                      : isAbove
                      ? `Typical meal ${Math.round(pctDiff)}% above budget average`
                      : 'Typical meal right at budget average'}
                    <span className="text-[var(--vb-text-secondary)] ml-1">
                      (median of {mealCount >= 3 ? `${mealCount} main dishes` : `${menuItems.length} items`})
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Score breakdown bars */}
            {(restaurant.tasteScore || restaurant.portionScore) && (
              <div className="space-y-2 pt-2 border-t border-[var(--vb-border)]">
                {[{ label: 'Taste', score: restaurant.tasteScore }, { label: 'Portion Size', score: restaurant.portionScore }].filter(s => s.score).map(({ label, score }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--vb-text-secondary)] w-20">{label}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--vb-primary)] rounded-full transition-all" style={{ width: `${((score||0)/5)*100}%` }} />
                    </div>
                    <span className="text-xs font-semibold w-6 text-right">{score?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── MENU & PRICES ── */}
        {menuItems.length > 0 && (() => {
          const categoryLabels: Record<string, string> = {
            main: 'Main Dishes', appetizer: 'Appetizers', side: 'Sides',
            drink: 'Drinks', dessert: 'Desserts', set_meal: 'Set Meals', combo: 'Combos',
          };
          const categoryOrder = ['set_meal', 'combo', 'main', 'appetizer', 'side', 'dessert', 'drink'];
          const grouped: Record<string, any[]> = {};
          menuItems.forEach((item: any) => {
            const cat = item.category || 'main';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });
          const sortedCategories = Object.keys(grouped).sort((a, b) =>
            (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
            (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
          );
          const allPrices = menuItems.map((m: any) => m.price).filter((p: number) => p > 0);
          const avgPrice = allPrices.length > 0 ? allPrices.reduce((a: number, b: number) => a + b, 0) / allPrices.length : 0;
          const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
          const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

          return (
            <div className="rounded-2xl border border-[var(--vb-border)] overflow-hidden">
              <div className="px-4 py-3 bg-[var(--vb-bg-secondary)] border-b border-[var(--vb-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Utensils size={15} />
                    Menu & Prices
                  </h3>
                  <span className="text-xs text-[var(--vb-text-secondary)]">{menuItems.length} items</span>
                </div>
                {allPrices.length > 1 && (
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--vb-text-secondary)]">
                    <span>Low: <span className="font-semibold text-[var(--vb-text)]">{formatPrice(minPrice, priceCountry)}</span></span>
                    <span>Avg: <span className="font-semibold text-[var(--vb-text)]">{formatPrice(avgPrice, priceCountry)}</span></span>
                    <span>High: <span className="font-semibold text-[var(--vb-text)]">{formatPrice(maxPrice, priceCountry)}</span></span>
                  </div>
                )}
              </div>
              <div>
                {sortedCategories.map((cat) => (
                  <div key={cat}>
                    {sortedCategories.length > 1 && (
                      <div className="px-4 py-1.5 bg-[var(--vb-bg-secondary)] border-y border-[var(--vb-border)]">
                        <span className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wide">
                          {categoryLabels[cat] || cat}
                        </span>
                      </div>
                    )}
                    <div className="divide-y divide-[var(--vb-border)]">
                      {grouped[cat].map((item: any, i: number) => {
                        const nameObj = typeof item.name === 'object' ? item.name : { en: item.name };
                        // Use English name if available and not Korean; otherwise use ja, then original
                        const koreanRe = /[\uac00-\ud7af]/;
                        const enName = nameObj.en && !koreanRe.test(nameObj.en) ? nameObj.en : null;
                        const jaName = nameObj.ja && !koreanRe.test(nameObj.ja) ? nameObj.ja : null;
                        const itemName = enName || jaName || nameObj.original || nameObj.en || '';
                        const localName = nameObj.original && nameObj.original !== itemName ? nameObj.original : (nameObj.ja && nameObj.ja !== itemName ? nameObj.ja : '');
                        const showLocal = localName && localName !== itemName;
                        return (
                          <div key={`menu-${cat}-${i}`} className="flex items-center justify-between px-4 py-2.5">
                            <div className="min-w-0 flex-1">
                              <span className="text-sm">{itemName}</span>
                              {showLocal && <span className="text-xs text-[var(--vb-text-secondary)] ml-1.5">{localName}</span>}
                            </div>
                            <span className="font-semibold text-sm ml-3 flex-shrink-0">{formatPrice(item.price, priceCountry)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── INFO SECTION (hours, contact, address) ── */}
        <div className="rounded-2xl border border-[var(--vb-border)] overflow-hidden divide-y divide-[var(--vb-border)]">
          {/* Hours — collapsible */}
          {(restaurant.operatingHours || restaurant.is24h) && (
            <button
              onClick={() => setShowHours(!showHours)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--vb-bg-secondary)] transition"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Clock size={16} className="text-[var(--vb-text-secondary)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {renderHours()}
                </div>
              </div>
              {!restaurant.is24h && restaurant.operatingHours && typeof restaurant.operatingHours === 'object' && (
                showHours ? <ChevronUp size={16} className="text-[var(--vb-text-secondary)]" /> : <ChevronDown size={16} className="text-[var(--vb-text-secondary)]" />
              )}
            </button>
          )}

          {/* Address */}
          {address && (
            <a
              href={restaurant.lat && restaurant.lng ? `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--vb-bg-secondary)] transition"
            >
              <MapPin size={16} className="text-[var(--vb-text-secondary)] flex-shrink-0" />
              <span className="text-sm text-[var(--vb-text-secondary)] truncate">{address}</span>
            </a>
          )}

          {/* Get Directions */}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--vb-bg-secondary)] transition"
            >
              <Navigation size={16} className="text-[var(--vb-primary)] flex-shrink-0" />
              <span className="text-sm text-[var(--vb-primary)] font-medium">
                Get Directions
                {distanceKm != null && (
                  <span className="text-[var(--vb-text-secondary)] font-normal ml-1.5">
                    ({distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm.toFixed(1)}km away`})
                  </span>
                )}
              </span>
            </a>
          )}

          {/* Order Online — affiliate links to delivery services (Tier 3 monetization) */}
          <DeliveryLinks restaurant={{
            name: restaurant.name || {},
            lat: restaurant.lat,
            lng: restaurant.lng,
            countryCode: priceCountry,
          }} />

          {/* Phone */}
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--vb-bg-secondary)] transition">
              <Phone size={16} className="text-[var(--vb-text-secondary)] flex-shrink-0" />
              <span className="text-sm text-[var(--vb-text-secondary)]">{restaurant.phone}</span>
            </a>
          )}

          {/* Website */}
          {restaurant.website && (
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--vb-bg-secondary)] transition">
              <Globe size={16} className="text-[var(--vb-text-secondary)] flex-shrink-0" />
              <span className="text-sm text-[var(--vb-primary)] truncate">{restaurant.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
            </a>
          )}
        </div>

        {/* ── REVIEWS ── */}
        {realGoogleReviews && (
          <GoogleReviewSection
            reviews={realGoogleReviews.reviews}
            totalCount={realGoogleReviews.totalReviews}
            avgRating={realGoogleReviews.avgRating}
          />
        )}

        {/* ── CONTRIBUTE ── */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-[var(--vb-text-secondary)] uppercase tracking-wide">Contribute</h3>

          <QuickRating restaurantId={id} currency={currencySymbol} />

          {menuItems.length > 0 && (
            <button
              onClick={() => setShowPriceSuggestion(true)}
              className="w-full py-2.5 rounded-xl border border-[var(--vb-primary)] text-[var(--vb-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--vb-primary)] hover:text-white transition"
            >
              <DollarSign size={15} /> Suggest Price Update
            </button>
          )}

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full py-2.5 rounded-xl border border-[var(--vb-border)] text-[var(--vb-text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition"
          >
            <PenLine size={15} /> Write a Review
          </button>

          <label className="w-full py-2.5 rounded-xl border border-dashed border-[var(--vb-border)] text-[var(--vb-text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition cursor-pointer">
            <Camera size={15} /> Upload Menu Photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) alert(`Photo "${file.name}" received! Menu photo upload coming soon.`);
              e.target.value = '';
            }} />
          </label>
        </div>

        {showReviewForm && (
          <DetailedReviewForm restaurantId={id} restaurantName={name} currency={currencySymbol} onClose={() => setShowReviewForm(false)} />
        )}

        {showPriceSuggestion && (
          <PriceSuggestionModal
            restaurantId={id}
            restaurantName={name}
            menuItems={menuItems}
            priceCurrency={restaurant.priceCurrency || 'USD'}
            onClose={() => setShowPriceSuggestion(false)}
          />
        )}

        {/* Freshness */}
        {restaurant.freshnessIndicator && (
          <div className="text-center pt-2">
            <span className={`text-xs ${restaurant.freshnessIndicator.color === 'green' ? 'text-green-600' : restaurant.freshnessIndicator.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
              {restaurant.freshnessIndicator.label}
            </span>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
