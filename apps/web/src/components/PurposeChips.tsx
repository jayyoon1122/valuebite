'use client';

import { useAppStore } from '@/lib/store';
import { ChainToggle } from './ChainToggle';
import { MOCK_BRACKETS } from '@/lib/mock-data';
import type { PurposeKey } from '@valuebite/types';

export function PurposeChips() {
  const { selectedPurpose, setSelectedPurpose, locale } = useAppStore();

  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-hide">
      <button
        onClick={() => setSelectedPurpose(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selectedPurpose
            ? 'bg-[var(--vb-primary)] text-white'
            : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {MOCK_BRACKETS.map((bracket) => {
        const label = bracket.purposeLabel[locale] || bracket.purposeLabel.en;
        return (
          <button
            key={bracket.purposeKey}
            onClick={() =>
              setSelectedPurpose(
                selectedPurpose === bracket.purposeKey ? null : (bracket.purposeKey as PurposeKey)
              )
            }
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedPurpose === bracket.purposeKey
                ? 'bg-[var(--vb-primary)] text-white'
                : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200'
            }`}
          >
            {bracket.icon} {label}
          </button>
        );
      })}
      <ChainToggle />
    </div>
  );
}
