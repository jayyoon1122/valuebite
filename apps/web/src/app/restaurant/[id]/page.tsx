'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@valuebite/utils';
import { BottomNav } from '@/components/BottomNav';
import { MenuPhotoUploader } from '@/components/MenuPhotoUploader';
import { QuickRating } from '@/components/QuickRating';
import { DetailedReviewForm } from '@/components/DetailedReviewForm';
import { GoogleReviewSection } from '@/components/GoogleReviewCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PhotoGallery } from '@/components/PhotoGallery';
import { fetchRestaurantDetail, fetchMenuItems } from '@/lib/data';
import {
  ArrowLeft, MapPin, MessageSquare, Sparkles, PenLine, Clock, Globe, Phone, ExternalLink,
} from 'lucide-react';

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [realPhotos, setRealPhotos] = useState<any[] | null>(null);
  const [realGoogleReviews, setRealGoogleReviews] = useState<any | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchRestaurantDetail(id),
      fetchMenuItems(id),
    ]).then(([data, menu]) => {
      if (data) {
        setRestaurant(data);
        if (data.photos?.length > 0) setRealPhotos(data.photos);
        if (data.googleReviews?.reviews?.length > 0) setRealGoogleReviews(data.googleReviews);
      }
      if (menu?.length > 0) setMenuItems(menu);
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
  const address = typeof restaurant.address === 'object' && restaurant.address
    ? (restaurant.address.en || restaurant.address.original || '')
    : (restaurant.address || '');
  const currencyMap: Record<string, string> = { JPY: 'JP', USD: 'US', GBP: 'GB', EUR: 'DE', AUD: 'AU', SGD: 'SG', AED: 'AE', TWD: 'TW', HKD: 'HK', CAD: 'CA', CHF: 'CH', CZK: 'CZ', HUF: 'HU', PLN: 'PL', TRY: 'TR', ILS: 'IL', INR: 'IN', MXN: 'MX' };
  const priceCountry = currencyMap[restaurant.priceCurrency || 'JPY'] || 'JP';
  const price = restaurant.avgMealPrice ? formatPrice(restaurant.avgMealPrice, priceCountry) : '';
  const totalReviewCount = realGoogleReviews?.totalReviews || restaurant?.totalReviews || 0;
  const currencySymbol = restaurant.priceCurrency === 'JPY' ? '¥' : restaurant.priceCurrency === 'USD' ? '$' : restaurant.priceCurrency === 'GBP' ? '£' : restaurant.priceCurrency === 'EUR' ? '€' : '$';

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><ArrowLeft size={20} /></Link>
          <h1 className="font-semibold text-lg truncate flex-1">{name}</h1>
          <FavoriteButton restaurantId={id} />
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery
        cuisineTypes={restaurant.cuisineType || []}
        mainPhoto={restaurant.photoUrl}
        restaurantName={name}
        realPhotos={realPhotos}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Name and score */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            {restaurant.name.original && restaurant.name.original !== name && (
              <p className="text-sm text-[var(--vb-text-secondary)]">{restaurant.name.original}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {restaurant.cuisineType?.filter((c: string) => !['meal_takeaway','meal_delivery','store','lodging','bar','night_club','cafe','bakery','supermarket','gas_station','atm','parking'].includes(c)).slice(0, 3).map((c: string) => (
                <span key={c} className="text-sm capitalize bg-[var(--vb-bg-secondary)] px-2 py-0.5 rounded">{c.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </div>
          {restaurant.valueScore && (
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--vb-primary)]">{restaurant.valueScore.toFixed(1)}</div>
              <div className="text-xs text-[var(--vb-text-secondary)]">Value Score</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 py-3 border-t border-b border-[var(--vb-border)]">
          {price && <div className="text-center"><div className="font-semibold text-lg">{price}</div><div className="text-xs text-[var(--vb-text-secondary)]">Avg/person</div></div>}
          {restaurant.distance != null && <div className="text-center"><div className="font-semibold text-lg flex items-center gap-1"><MapPin size={16} />{restaurant.distance < 1000 ? `${restaurant.distance}m` : `${(restaurant.distance/1000).toFixed(1)}km`}</div><div className="text-xs text-[var(--vb-text-secondary)]">Distance</div></div>}
          <div className="text-center"><div className="font-semibold text-lg flex items-center gap-1"><MessageSquare size={16} /> {totalReviewCount > 0 ? totalReviewCount.toLocaleString() : '0'}</div><div className="text-xs text-[var(--vb-text-secondary)]">Reviews</div></div>
        </div>

        {/* Score breakdown */}
        {(restaurant.tasteScore || restaurant.portionScore) && (
          <div>
            <h3 className="font-semibold mb-2">Score Breakdown</h3>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Taste', score: restaurant.tasteScore }, { label: 'Portion', score: restaurant.portionScore }].filter(s => s.score).map(({ label, score }) => (
                <div key={label} className="bg-[var(--vb-bg-secondary)] rounded-lg p-3">
                  <div className="text-xs text-[var(--vb-text-secondary)]">{label}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--vb-primary)] rounded-full" style={{ width: `${((score||0)/5)*100}%` }} />
                    </div>
                    <span className="text-sm font-semibold">{score?.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {(restaurant.operatingHours || restaurant.is24h) && (
          <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
              <Clock size={16} /> Hours
            </h3>
            {restaurant.is24h ? (
              <p className="text-sm text-[var(--vb-text-secondary)]">Open 24 hours</p>
            ) : typeof restaurant.operatingHours === 'string' ? (
              <p className="text-sm text-[var(--vb-text-secondary)]">{restaurant.operatingHours}</p>
            ) : restaurant.operatingHours && typeof restaurant.operatingHours === 'object' ? (
              <div className="text-sm text-[var(--vb-text-secondary)] space-y-0.5">
                {(() => {
                  const hours = restaurant.operatingHours as Record<string, any>;
                  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                  const entries = dayOrder
                    .filter(d => hours[d] != null)
                    .map(d => {
                      const val = hours[d];
                      const text = typeof val === 'string' ? val
                        : typeof val === 'object' && val?.open && val?.close ? `${val.open} - ${val.close}`
                        : JSON.stringify(val);
                      return { day: d, text };
                    });
                  if (entries.length === 0) return <p>Hours vary</p>;
                  return entries.map(({ day, text }) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium w-10">{day}</span>
                      <span>{text}</span>
                    </div>
                  ));
                })()}
              </div>
            ) : null}
          </div>
        )}

        {/* Contact & Location */}
        <div className="flex flex-wrap gap-2">
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-[var(--vb-bg-secondary)] rounded-lg text-sm hover:bg-[var(--vb-primary)] hover:text-white transition">
              <Phone size={14} /> Call
            </a>
          )}
          {restaurant.website && (
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-[var(--vb-bg-secondary)] rounded-lg text-sm hover:bg-[var(--vb-primary)] hover:text-white transition">
              <Globe size={14} /> Website
            </a>
          )}
          {restaurant.lat && restaurant.lng && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-[var(--vb-bg-secondary)] rounded-lg text-sm hover:bg-[var(--vb-primary)] hover:text-white transition">
              <MapPin size={14} /> Directions
            </a>
          )}
        </div>

        {/* Address */}
        {address && (
          <p className="text-sm text-[var(--vb-text-secondary)]">
            <MapPin size={12} className="inline mr-1" />{address}
          </p>
        )}

        {/* Menu — only show if we have real menu items from AI extraction */}
        {menuItems.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              Menu
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> AI Extracted
              </span>
            </h3>
            <div className="space-y-1">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--vb-bg-secondary)]">
                  <span className="text-sm">{item.name}</span>
                  <span className="font-semibold text-sm">{formatPrice(item.price, priceCountry)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <MenuPhotoUploader restaurantId={id} />

        {/* Quick Rating */}
        <QuickRating restaurantId={id} currency={currencySymbol} />

        {/* Write Review */}
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="w-full py-2.5 rounded-xl border border-[var(--vb-border)] text-[var(--vb-text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition"
        >
          <PenLine size={16} /> Share your experience on ValueBite
        </button>

        {showReviewForm && (
          <DetailedReviewForm restaurantId={id} restaurantName={name} currency={currencySymbol} onClose={() => setShowReviewForm(false)} />
        )}

        {/* Google Reviews */}
        {realGoogleReviews && (
          <GoogleReviewSection
            reviews={realGoogleReviews.reviews}
            totalCount={realGoogleReviews.totalReviews}
            avgRating={realGoogleReviews.avgRating}
          />
        )}

        {/* Freshness */}
        {restaurant.freshnessIndicator && (
          <div className="text-center">
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
