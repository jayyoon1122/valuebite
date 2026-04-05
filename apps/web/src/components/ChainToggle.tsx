'use client';

import { useAppStore } from '@/lib/store';
import { Store } from 'lucide-react';

export function ChainToggle() {
  const { showChains, toggleShowChains } = useAppStore();

  return (
    <button
      onClick={toggleShowChains}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
        showChains
          ? 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
      }`}
      title={showChains ? 'Click to hide chain restaurants' : 'Click to show chain restaurants'}
    >
      <Store size={13} />
      {showChains ? 'Chains: On' : 'Chains: Off'}
    </button>
  );
}
