'use client';

import { use } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { RestaurantCard } from '@/components/RestaurantCard';
import { MOCK_RESTAURANTS, MOCK_BRACKETS } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';

export default function PurposeDetailPage({ params }: { params: Promise<{ purpose: string }> }) {
  const { purpose } = use(params);
  const bracket = MOCK_BRACKETS.find((b) => b.purposeKey === purpose);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/purpose" className="p-1 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold text-lg">
              {bracket?.icon} {bracket?.purposeLabel.en || purpose}
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {MOCK_RESTAURANTS.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} countryCode="JP" />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
