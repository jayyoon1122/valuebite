'use client';

import { SearchBar } from './SearchBar';
import { RegionLanguageSelector } from './RegionLanguageSelector';
import { useAppStore } from '@/lib/store';
import { MapIcon, List } from 'lucide-react';

export function Header() {
  const { isMapView, toggleMapView } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
      <div className="flex items-center gap-2 px-4 py-3 max-w-4xl mx-auto">
        <h1 className="text-lg font-bold text-[var(--vb-primary)] shrink-0">
          ValueBite
        </h1>
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>
        <RegionLanguageSelector />
        <button
          onClick={toggleMapView}
          className="shrink-0 p-2 rounded-lg bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title={isMapView ? 'List view' : 'Map view'}
        >
          {isMapView ? <List size={18} /> : <MapIcon size={18} />}
        </button>
      </div>
    </header>
  );
}
