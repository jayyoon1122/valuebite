'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Target, Calendar, CreditCard } from 'lucide-react';

const PURPOSE_OPTIONS = [
  { key: 'daily_eats', label: 'Daily Eats', icon: '🍱' },
  { key: 'good_value', label: 'Good Value', icon: '💰' },
  { key: 'late_night', label: 'Late Night', icon: '🌙' },
  { key: 'solo_dining', label: 'Solo Dining', icon: '🧑‍💻' },
  { key: 'family_dinner', label: 'Family Dinner', icon: '👨‍👩‍👧‍👦' },
];

export default function CreatePromotionPage() {
  const [campaignName, setCampaignName] = useState('');
  const [budget, setBudget] = useState('5000');
  const [duration, setDuration] = useState('7');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [radius, setRadius] = useState('3');

  const togglePurpose = (key: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const estimatedImpressions = Math.round(parseInt(budget || '0') * 1.2);
  const estimatedClicks = Math.round(estimatedImpressions * 0.028);

  return (
    <div className="min-h-screen bg-[var(--vb-bg)]">
      <div className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Link href="/business" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg">Create Promoted Listing</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Campaign name */}
        <div>
          <label className="text-sm font-semibold block mb-2"><Megaphone size={16} className="inline mr-2" />Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g., Lunch Special Promo"
            className="w-full px-4 py-3 rounded-xl bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
          />
        </div>

        {/* Target purposes */}
        <div>
          <label className="text-sm font-semibold block mb-2"><Target size={16} className="inline mr-2" />Target Dining Purposes</label>
          <p className="text-xs text-[var(--vb-text-secondary)] mb-3">Your listing will appear when users browse these categories</p>
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((p) => (
              <button
                key={p.key}
                onClick={() => togglePurpose(p.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedPurposes.includes(p.key)
                    ? 'bg-[var(--vb-primary)] text-white'
                    : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Geo targeting */}
        <div>
          <label className="text-sm font-semibold block mb-2">Target Radius</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="10"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="flex-1 accent-[var(--vb-primary)]"
            />
            <span className="text-sm font-semibold w-12">{radius}km</span>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-semibold block mb-2"><CreditCard size={16} className="inline mr-2" />Budget</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]">¥</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-semibold block mb-2"><Calendar size={16} className="inline mr-2" />Duration</label>
          <div className="flex gap-2">
            {['7', '14', '30'].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                  duration === d
                    ? 'bg-[var(--vb-primary)] text-white'
                    : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)]'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {/* Estimate */}
        <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Estimated Results</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{estimatedImpressions.toLocaleString()}</div>
              <div className="text-xs text-[var(--vb-text-secondary)]">Impressions</div>
            </div>
            <div>
              <div className="text-lg font-bold">{estimatedClicks}</div>
              <div className="text-xs text-[var(--vb-text-secondary)]">Est. Clicks</div>
            </div>
            <div>
              <div className="text-lg font-bold">¥{budget ? Math.round(parseInt(budget) / Math.max(1, estimatedClicks)) : 0}</div>
              <div className="text-xs text-[var(--vb-text-secondary)]">Cost/Click</div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold text-base hover:opacity-90 transition">
          Launch Campaign — ¥{parseInt(budget || '0').toLocaleString()}
        </button>
      </div>
    </div>
  );
}
