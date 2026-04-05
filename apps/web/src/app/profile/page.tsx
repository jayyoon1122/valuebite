'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { BudgetTracker } from '@/components/BudgetTracker';
import { PriceAlertBanner } from '@/components/PriceAlertBanner';
import { User, Heart, Star, Camera, Award, Settings, ChevronRight, Trophy, Flame, Target, Pencil } from 'lucide-react';

const BADGES = [
  { id: 'trailblazer', icon: '🏪', label: 'Trailblazer', desc: 'First restaurant suggestion', earned: true },
  { id: 'menu_scout', icon: '📸', label: 'Menu Scout', desc: 'Upload 5 menu photos', earned: true },
  { id: 'reviewer', icon: '✍️', label: 'Reviewer', desc: 'Write 10 reviews', earned: false, progress: '7/10' },
  { id: 'price_checker', icon: '✅', label: 'Price Checker', desc: 'Verify 5 restaurants', earned: false, progress: '2/5' },
  { id: 'power_reviewer', icon: '🔥', label: 'Power Reviewer', desc: '10 reviews in one month', earned: false, progress: '7/10' },
  { id: 'trusted', icon: '⭐', label: 'Trusted Reviewer', desc: 'Review marked most helpful', earned: false },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'badges' | 'favorites'>('budget');

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
              <h2 className="text-xl font-bold">TokyoFoodie</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Lv.3 Expert 🎯</span>
                <span className="text-xs opacity-80">1,250 pts</span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition"
            >
              <Pencil size={12} />
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="font-bold text-lg">27</div>
              <div className="text-xs opacity-80">Reviews</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">12</div>
              <div className="text-xs opacity-80">Photos</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">45</div>
              <div className="text-xs opacity-80">Helpful</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">8</div>
              <div className="text-xs opacity-80">Favorites</div>
            </div>
          </div>
          {/* XP progress to next level */}
          <div className="mt-3">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>Level 3: Expert</span>
              <span>1,250 / 2,000 pts to Master</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '62.5%' }} />
            </div>
          </div>
        </div>

        {/* Price alerts */}
        <PriceAlertBanner />

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[var(--vb-bg-secondary)] rounded-xl p-1">
          {(['budget', 'badges', 'favorites'] as const).map((tab) => (
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

        {activeTab === 'badges' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3">
                <Trophy size={24} className="text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-bold">2</div>
                <div className="text-xs text-[var(--vb-text-secondary)]">Badges Earned</div>
              </div>
              <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3">
                <Flame size={24} className="text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-bold">5</div>
                <div className="text-xs text-[var(--vb-text-secondary)]">Day Streak</div>
              </div>
              <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-3">
                <Target size={24} className="text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold">3</div>
                <div className="text-xs text-[var(--vb-text-secondary)]">In Progress</div>
              </div>
            </div>

            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  badge.earned
                    ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20'
                    : 'border-[var(--vb-border)] bg-[var(--vb-bg)]'
                }`}
              >
                <span className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-40'}`}>
                  {badge.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{badge.label}</span>
                    {badge.earned && <span className="text-xs text-yellow-600 font-semibold">Earned!</span>}
                  </div>
                  <p className="text-xs text-[var(--vb-text-secondary)]">{badge.desc}</p>
                  {badge.progress && !badge.earned && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[var(--vb-text-secondary)]">Progress</span>
                        <span className="font-medium">{badge.progress}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--vb-primary)] rounded-full"
                          style={{ width: `${(parseInt(badge.progress) / parseInt(badge.progress.split('/')[1])) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {[
              { name: 'Matsuya Shinjuku', cuisine: 'Gyudon', price: '¥550', score: 4.5 },
              { name: 'Fuji Soba Shinjuku', cuisine: 'Soba', price: '¥420', score: 4.7 },
              { name: 'Saizeriya Shibuya', cuisine: 'Italian', price: '¥650', score: 4.6 },
            ].map((fav, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--vb-border)]">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg">
                  🍽️
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{fav.name}</h4>
                  <p className="text-xs text-[var(--vb-text-secondary)]">{fav.cuisine} · {fav.price}/person</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--vb-primary)]">{fav.score}</div>
                  <Heart size={14} className="text-red-500 fill-red-500 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
