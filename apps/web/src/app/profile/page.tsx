'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { BudgetTracker } from '@/components/BudgetTracker';
import { loadProfile } from '@/lib/user-profile';
import { formatPrice } from '@valuebite/utils';
import { useAppStore } from '@/lib/store';
import { REGIONS } from '@/lib/regions';
import { User, Heart, Settings, Pencil, Star, DollarSign } from 'lucide-react';

interface FavoriteItem {
  id: string;
  name: string;
  cuisine?: string;
  price?: string;
  score?: number;
}

function loadFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('valuebite-favorites');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function loadUserStats() {
  if (typeof window === 'undefined') return { reviews: 0, photos: 0, helpful: 0 };
  try {
    const saved = localStorage.getItem('valuebite-user-stats');
    return saved ? JSON.parse(saved) : { reviews: 0, photos: 0, helpful: 0 };
  } catch { return { reviews: 0, photos: 0, helpful: 0 }; }
}

export default function ProfilePage() {
  const { countryCode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'budget' | 'favorites' | 'stats'>('budget');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [stats, setStats] = useState({ reviews: 0, photos: 0, helpful: 0 });
  const [profile, setProfile] = useState({ displayName: '', avatarDataUrl: null as string | null });

  useEffect(() => {
    setFavorites(loadFavorites());
    setStats(loadUserStats());
    const p = loadProfile();
    setProfile({ displayName: p.displayName, avatarDataUrl: p.avatarDataUrl });
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Profile</h1>
          <Link href="/settings" className="p-2 hover:bg-[var(--vb-bg-secondary)] rounded-lg">
            <Settings size={20} />
          </Link>
        </div>
      </header>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* User card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {profile.avatarDataUrl ? (
                <img src={profile.avatarDataUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.displayName || 'ValueBite User'}</h2>
              <p className="text-xs opacity-80 mt-1">{profile.displayName ? 'Budget dining explorer' : 'Set up your profile to personalize'}</p>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition"
            >
              <Pencil size={12} />
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.reviews}</div>
              <div className="text-xs opacity-80">Reviews</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.photos}</div>
              <div className="text-xs opacity-80">Photos</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{favorites.length}</div>
              <div className="text-xs opacity-80">Favorites</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[var(--vb-bg-secondary)] rounded-xl p-1">
          {(['budget', 'favorites', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'bg-[var(--vb-bg)] shadow text-[var(--vb-text)]'
                  : 'text-[var(--vb-text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'budget' && <BudgetTracker countryCode={countryCode} />}

        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={48} className="mx-auto mb-3 text-[var(--vb-text-secondary)] opacity-30" />
                <p className="font-semibold">No favorites yet</p>
                <p className="text-sm text-[var(--vb-text-secondary)] mt-1">
                  Tap the heart icon on any restaurant to save it here
                </p>
                <Link href="/" className="inline-block mt-4 px-4 py-2 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-semibold">
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={`/restaurant/${fav.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--vb-border)] hover:shadow-md transition"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg">
                    🍽
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{fav.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {fav.cuisine && (
                        <span className="text-xs text-[var(--vb-text-secondary)] truncate capitalize">{fav.cuisine.replace(/_/g, ' ')}</span>
                      )}
                      {fav.price && (
                        <span className="text-xs font-semibold text-[var(--vb-text)] flex items-center gap-0.5 shrink-0">
                          <DollarSign size={10} />{fav.price}
                        </span>
                      )}
                      {fav.score && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-0.5 shrink-0">
                          <Star size={10} className="fill-current" />{fav.score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Heart size={16} className="text-red-500 fill-red-500 shrink-0" />
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (() => {
          // Load expenses for stats calculation
          let expenses: Array<{ amount: number; date: string }> = [];
          try {
            const saved = localStorage.getItem('valuebite-expenses');
            expenses = saved ? JSON.parse(saved) : [];
          } catch {}

          const totalMeals = expenses.length;
          const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
          const avgPerMeal = totalMeals > 0 ? totalSpent / totalMeals : 0;

          // Estimate savings (compared to typical dining out — 1.5x of budget average)
          const typicalPerMeal = avgPerMeal * 1.5;
          const estimatedSavings = totalMeals > 0 ? (typicalPerMeal - avgPerMeal) * totalMeals : 0;

          // Streaks — days with at least one logged meal
          const uniqueDays = new Set(expenses.map(e => e.date)).size;

          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
                <h3 className="font-semibold text-sm opacity-80 mb-3">Your ValueBite Journey</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalMeals}</div>
                    <div className="text-xs opacity-80">Meals Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{uniqueDays}</div>
                    <div className="text-xs opacity-80">Active Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatPrice(Math.round(avgPerMeal), countryCode)}</div>
                    <div className="text-xs opacity-80">Avg per Meal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatPrice(Math.round(totalSpent), countryCode)}</div>
                    <div className="text-xs opacity-80">Total Spent</div>
                  </div>
                </div>
              </div>

              {estimatedSavings > 0 && (
                <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-center">
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">Estimated Savings</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">
                    {formatPrice(Math.round(estimatedSavings), countryCode)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    By choosing budget-friendly restaurants over typical dining
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-[var(--vb-bg-secondary)] p-4 text-center">
                <p className="text-sm text-[var(--vb-text-secondary)]">
                  {totalMeals === 0
                    ? 'Start logging meals in the Budget tab to see your stats!'
                    : `Keep tracking to unlock more insights about your dining habits.`}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      <BottomNav />
    </div>
  );
}
