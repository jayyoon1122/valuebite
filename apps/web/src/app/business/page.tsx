'use client';

import Link from 'next/link';
import { BarChart3, Megaphone, Store, TrendingUp, Eye, MousePointer, Users } from 'lucide-react';

const MOCK_STATS = {
  views: 1247,
  clicks: 89,
  favorites: 23,
  reviews: 12,
  avgRating: 4.3,
  campaigns: [
    { id: '1', name: 'Lunch Special Promo', status: 'active', impressions: 8420, clicks: 234, spent: '¥12,500', budget: '¥30,000' },
    { id: '2', name: 'Weekend Deal', status: 'paused', impressions: 3200, clicks: 95, spent: '¥6,800', budget: '¥15,000' },
  ],
};

export default function BusinessPortal() {
  return (
    <div className="min-h-screen bg-[var(--vb-bg)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Store size={24} />
            <h1 className="text-2xl font-bold">ValueBite for Business</h1>
          </div>
          <p className="text-green-100">Manage your restaurant listing and reach budget-conscious diners</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Eye, label: 'Views (30d)', value: MOCK_STATS.views.toLocaleString(), color: 'text-blue-500' },
            { icon: MousePointer, label: 'Clicks (30d)', value: MOCK_STATS.clicks.toString(), color: 'text-green-500' },
            { icon: Users, label: 'Favorites', value: MOCK_STATS.favorites.toString(), color: 'text-red-500' },
            { icon: TrendingUp, label: 'Avg Rating', value: MOCK_STATS.avgRating.toString(), color: 'text-yellow-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[var(--vb-bg-secondary)] rounded-xl p-4">
              <Icon size={20} className={color} />
              <div className="text-xl font-bold mt-2">{value}</div>
              <div className="text-xs text-[var(--vb-text-secondary)]">{label}</div>
            </div>
          ))}
        </div>

        {/* Active campaigns */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2"><Megaphone size={20} /> Promoted Listings</h2>
            <Link
              href="/business/promote"
              className="px-4 py-2 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              + New Campaign
            </Link>
          </div>
          <div className="space-y-3">
            {MOCK_STATS.campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-[var(--vb-bg-secondary)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    campaign.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[var(--vb-text-secondary)] text-xs">Impressions</div>
                    <div className="font-semibold">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[var(--vb-text-secondary)] text-xs">Clicks</div>
                    <div className="font-semibold">{campaign.clicks}</div>
                  </div>
                  <div>
                    <div className="text-[var(--vb-text-secondary)] text-xs">Spent / Budget</div>
                    <div className="font-semibold">{campaign.spent} / {campaign.budget}</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--vb-primary)] rounded-full"
                    style={{ width: `${(parseInt(campaign.spent.replace(/[^0-9]/g, '')) / parseInt(campaign.budget.replace(/[^0-9]/g, ''))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold flex items-center gap-2"><BarChart3 size={18} /> Insight</h3>
          <p className="text-sm mt-2">
            Your listing gets <strong>3x more views</strong> when promoted during lunch hours (11am-1pm).
            Consider increasing your budget for weekday lunches.
          </p>
        </div>

        {/* Pricing info */}
        <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Promoted Listings Pricing</h3>
          <p className="text-sm text-[var(--vb-text-secondary)] mb-4">Affordable advertising for budget restaurants</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--vb-bg)] rounded-lg p-4">
              <div className="text-2xl font-bold text-[var(--vb-primary)]">¥3,000</div>
              <div className="text-sm font-semibold mt-1">Starter</div>
              <div className="text-xs text-[var(--vb-text-secondary)] mt-2">~1,000 impressions/month<br/>Basic targeting</div>
            </div>
            <div className="bg-[var(--vb-bg)] rounded-lg p-4 border-2 border-[var(--vb-primary)]">
              <div className="text-2xl font-bold text-[var(--vb-primary)]">¥8,000</div>
              <div className="text-sm font-semibold mt-1">Growth</div>
              <div className="text-xs text-[var(--vb-text-secondary)] mt-2">~5,000 impressions/month<br/>Purpose + area targeting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
