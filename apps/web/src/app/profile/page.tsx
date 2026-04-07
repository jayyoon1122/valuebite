'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { BudgetTracker } from '@/components/BudgetTracker';
import { User, Heart, Settings, Pencil } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'budget' | 'favorites'>('budget');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [stats, setStats] = useState({ reviews: 0, photos: 0, helpful: 0 });

  useEffect(() => {
    setFavorites(loadFavorites());
    setStats(loadUserStats());
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
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">ValueBite User</h2>
              <p className="text-xs opacity-80 mt-1">Sign in to track your dining history</p>
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
          {(['budget', 'favorites'] as const).map((tab) => (
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
        {activeTab === 'budget' && <BudgetTracker />}

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
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{fav.name}</h4>
                    {fav.cuisine && <p className="text-xs text-[var(--vb-text-secondary)]">{fav.cuisine}</p>}
                  </div>
                  <Heart size={16} className="text-red-500 fill-red-500" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
