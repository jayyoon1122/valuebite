'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@valuebite/utils';
import { BottomNav } from '@/components/BottomNav';
import { AISummaryCard } from '@/components/AISummaryCard';
import { MenuPhotoUploader } from '@/components/MenuPhotoUploader';
import { PurposeFitBadges } from '@/components/PurposeFitBadges';
import { QuickRating } from '@/components/QuickRating';
import { DetailedReviewForm } from '@/components/DetailedReviewForm';
import { ReviewCard } from '@/components/ReviewCard';
import { GoogleReviewSection } from '@/components/GoogleReviewCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PhotoGallery } from '@/components/PhotoGallery';
import { SEED_REVIEWS, SEED_AI_SUMMARIES, SEED_MENUS } from '@/lib/seed-data';
import { getRestaurantById, getReviewsForRestaurant, getAISummaryForRestaurant, getGoogleReviewsForRestaurant, fetchRealRestaurantDetail } from '@/lib/city-data';
import {
  ArrowLeft, MapPin, MessageSquare, Sparkles, PenLine, ExternalLink,
} from 'lucide-react';

const DEFAULT_PURPOSE_FITS: Record<string, Record<string, number>> = {
  r1: { fitDailyEats: 0.95, fitSoloDining: 0.92, fitLateNight: 0.85, fitGroupParty: 0.30, fitDateNight: 0.10, fitFamilyDinner: 0.40, fitHealthyBudget: 0.50, fitSpecialOccasion: 0.05 },
  r2: { fitDailyEats: 0.97, fitSoloDining: 0.95, fitLateNight: 0.80, fitGroupParty: 0.10, fitDateNight: 0.05, fitFamilyDinner: 0.20, fitHealthyBudget: 0.55, fitSpecialOccasion: 0.02 },
  r8: { fitDailyEats: 0.70, fitSoloDining: 0.50, fitLateNight: 0.30, fitGroupParty: 0.75, fitDateNight: 0.55, fitFamilyDinner: 0.90, fitHealthyBudget: 0.35, fitSpecialOccasion: 0.20 },
  r24: { fitDailyEats: 0.96, fitSoloDining: 0.90, fitLateNight: 0.40, fitGroupParty: 0.20, fitDateNight: 0.05, fitFamilyDinner: 0.45, fitHealthyBudget: 0.70, fitSpecialOccasion: 0.02 },
  r28: { fitDailyEats: 0.40, fitSoloDining: 0.30, fitLateNight: 0.80, fitGroupParty: 0.95, fitDateNight: 0.50, fitFamilyDinner: 0.20, fitHealthyBudget: 0.15, fitSpecialOccasion: 0.30 },
};

const DEFAULT_FITS = { fitDailyEats: 0.80, fitSoloDining: 0.75, fitLateNight: 0.50, fitGroupParty: 0.40, fitDateNight: 0.30, fitFamilyDinner: 0.45, fitHealthyBudget: 0.50, fitSpecialOccasion: 0.10 };

const DEFAULT_MENU = [
  { name: 'Regular Set', price: 550, category: 'set_meal' },
  { name: 'Large Set', price: 700, category: 'set_meal' },
  { name: 'Side Dish', price: 150, category: 'side' },
  { name: 'Drink', price: 120, category: 'drink' },
];

const DEFAULT_SUMMARY = {
  summary: 'A reliable budget restaurant with consistent quality and fast service. Popular with locals for everyday meals.',
  bestItems: ['Regular Set', 'Large Set'],
  bestFor: ['Quick lunch', 'Solo dining'],
  commonComplaints: ['Can be crowded at peak hours'],
  bestTimeToVisit: 'Weekday lunch, avoid 12-1pm',
  worthItPercentage: 80,
  avgPricePaid: 550,
};

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const seedRestaurant = getRestaurantById(id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [realPhotos, setRealPhotos] = useState<any[] | null>(null);
  const [realGoogleReviews, setRealGoogleReviews] = useState<any | null>(null);
  const [dbRestaurant, setDbRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(!seedRestaurant); // only show loading if no seed data

  // Load real data from Supabase
  useEffect(() => {
    fetchRealRestaurantDetail(id).then((data) => {
      if (data) {
        setDbRestaurant(data);
        if (data.photos && data.photos.length > 0) setRealPhotos(data.photos);
        if (data.googleReviews && data.googleReviews.reviews.length > 0) setRealGoogleReviews(data.googleReviews);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // Use seed data or DB data
  const restaurant = seedRestaurant || dbRestaurant;

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

  const name = restaurant.name.en || restaurant.name.original || '';
  const currencyMap: Record<string, string> = { JPY: 'JP', USD: 'US', GBP: 'GB', EUR: 'DE', AUD: 'AU', SGD: 'SG', AED: 'AE', TWD: 'TW', HKD: 'HK', CAD: 'CA', CHF: 'CH', CZK: 'CZ', HUF: 'HU', PLN: 'PL', TRY: 'TR', ILS: 'IL', INR: 'IN', MXN: 'MX' };
  const priceCountry = currencyMap[restaurant.priceCurrency || 'JPY'] || 'JP';
  const price = restaurant.avgMealPrice ? formatPrice(restaurant.avgMealPrice, priceCountry) : '';
  const userReviews = getReviewsForRestaurant(id);
  const googleData = getGoogleReviewsForRestaurant(id);
  const aiSummary = getAISummaryForRestaurant(id) || DEFAULT_SUMMARY;
  const menu = SEED_MENUS[id] || DEFAULT_MENU;
  const purposeFits = DEFAULT_PURPOSE_FITS[id] || DEFAULT_FITS;
  // Use real review count from DB, or Google reviews count, or seed reviews
  const totalReviewCount = (realGoogleReviews?.totalReviews || 0) || (googleData?.totalReviews || 0) || (dbRestaurant?.totalReviews || 0) || userReviews.length;

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

        <PurposeFitBadges fits={purposeFits} />

        {/* Stats */}
        <div className="flex items-center gap-6 py-3 border-t border-b border-[var(--vb-border)]">
          {price && <div className="text-center"><div className="font-semibold text-lg">{price}</div><div className="text-xs text-[var(--vb-text-secondary)]">Avg/person</div></div>}
          {restaurant.distance != null && <div className="text-center"><div className="font-semibold text-lg flex items-center gap-1"><MapPin size={16} />{restaurant.distance < 1000 ? `${restaurant.distance}m` : `${(restaurant.distance/1000).toFixed(1)}km`}</div><div className="text-xs text-[var(--vb-text-secondary)]">Distance</div></div>}
          <div className="text-center"><div className="font-semibold text-lg flex items-center gap-1"><MessageSquare size={16} /> {totalReviewCount > 0 ? totalReviewCount.toLocaleString() : '0'}</div><div className="text-xs text-[var(--vb-text-secondary)]">Reviews</div></div>
        </div>

        {/* AI Summary */}
        <AISummaryCard summary={aiSummary} />

        {/* Score breakdown */}
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

        {/* Purpose Fit */}
        <div>
          <h3 className="font-semibold mb-2">Purpose Fit</h3>
          <PurposeFitBadges fits={purposeFits} showAll />
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            Menu
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> AI Extracted
            </span>
          </h3>
          <div className="space-y-1">
            {menu.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--vb-bg-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.name}</span>
                  {item.isLunchSpecial && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded">Lunch Special</span>}
                  {item.tag && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">{item.tag}</span>}
                </div>
                <span className="font-semibold text-sm">{formatPrice(item.price, priceCountry)}</span>
              </div>
            ))}
          </div>
        </div>

        <MenuPhotoUploader restaurantId={id} />

        {/* Banner ad between menu and reviews */}
        <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3 flex items-center gap-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold shrink-0">R</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Earn cash back on dining</p>
            <p className="text-xs text-[var(--vb-text-secondary)]">Up to 5% back at partner restaurants</p>
          </div>
          <button className="shrink-0 px-3 py-1.5 rounded-lg bg-[var(--vb-primary)] text-white text-xs font-semibold">Start</button>
          <span className="absolute top-1 right-2 text-[10px] text-[var(--vb-text-secondary)]">Ad</span>
        </div>

        {/* === REVIEW SECTION (Google-first) === */}

        {/* 1. Quick "Was it worth it?" — most likely user action */}
        <QuickRating restaurantId={id} currency={restaurant.priceCurrency === 'JPY' ? '¥' : restaurant.priceCurrency === 'USD' ? '$' : restaurant.priceCurrency === 'GBP' ? '£' : restaurant.priceCurrency === 'EUR' ? '€' : '$'} />

        {/* 1.5. Share experience — right below quick rating */}
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="w-full py-2.5 rounded-xl border border-[var(--vb-border)] text-[var(--vb-text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition"
        >
          <PenLine size={16} /> Share your experience on ValueBite
        </button>

        {showReviewForm && (
          <DetailedReviewForm restaurantId={id} restaurantName={name} currency={restaurant.priceCurrency === 'JPY' ? '¥' : '$'} onClose={() => setShowReviewForm(false)} />
        )}

        {/* 2. Google Reviews — primary review source (real from Supabase or seed) */}
        {(realGoogleReviews || googleData) && (
          <GoogleReviewSection
            reviews={(realGoogleReviews || googleData).reviews}
            totalCount={(realGoogleReviews || googleData).totalReviews}
            avgRating={(realGoogleReviews || googleData).avgRating}
          />
        )}

        {/* 3. ValueBite Community Reviews — secondary */}
        {userReviews.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              ValueBite Reviews
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                {userReviews.length}
              </span>
            </h3>
            <div className="space-y-3">
              {userReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          </div>
        )}

        {/* (Write review button moved above Google reviews) */}

        {/* Freshness */}
        <div className="text-center">
          <span className={`text-xs ${restaurant.freshnessIndicator.color === 'green' ? 'text-green-600' : restaurant.freshnessIndicator.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
            {restaurant.freshnessIndicator.label}
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
