'use client';

import type { PurposeKey } from '@valuebite/types';

interface Props {
  fits: Partial<Record<string, number>>;
  showAll?: boolean;
}

const PURPOSE_INFO: Record<string, { label: string; icon: string }> = {
  fitDailyEats: { label: 'Daily Eats', icon: '🍛' },
  fitDateNight: { label: 'Date Night', icon: '🥂' },
  fitFamilyDinner: { label: 'Family Dinner', icon: '👨‍👩‍👧‍👦' },
  fitLateNight: { label: 'Late Night', icon: '🌙' },
  fitHealthyBudget: { label: 'Healthy & Budget', icon: '🥗' },
  fitSoloDining: { label: 'Solo Dining', icon: '🧑‍💻' },
  fitGroupParty: { label: 'Group & Party', icon: '🎉' },
  fitSpecialOccasion: { label: 'Special Occasion', icon: '🎂' },
};

export function PurposeFitBadges({ fits, showAll = false }: Props) {
  const entries = Object.entries(fits)
    .filter(([key]) => key.startsWith('fit'))
    .map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? parseFloat(value) : (value || 0),
      ...PURPOSE_INFO[key],
    }))
    .filter((e) => e.label)
    .sort((a, b) => b.value - a.value);

  const display = showAll ? entries : entries.filter((e) => e.value >= 0.6).slice(0, 3);

  if (display.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {display.map((entry) => {
        let bgColor = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
        if (entry.value >= 0.8) bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
        else if (entry.value >= 0.6) bgColor = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';

        return (
          <span
            key={entry.key}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
            title={`${Math.round(entry.value * 100)}% fit`}
          >
            {entry.icon} {entry.label}
            {showAll && (
              <span className="opacity-60">{Math.round(entry.value * 100)}%</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
