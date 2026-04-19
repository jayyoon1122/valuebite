'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar({ onQueryChange }: { onQueryChange?: (q: string) => void } = {}) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search
          size={20}
          strokeWidth={2.5}
          className="absolute left-3 text-[var(--vb-text-secondary)] pointer-events-none flex-shrink-0"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onQueryChange?.(e.target.value); }}
          placeholder="Search restaurants..."
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onQueryChange?.(''); }}
            className="absolute right-3 text-[var(--vb-text-secondary)] hover:text-[var(--vb-text)]"
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
