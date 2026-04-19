'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { shareLink } from '@/lib/format';

interface Props {
  title: string;
  text?: string;
  url?: string; // defaults to current page
  size?: number;
}

export function ShareButton({ title, text, url, size = 22 }: Props) {
  const [feedback, setFeedback] = useState<'idle' | 'shared' | 'copied'>('idle');

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const result = await shareLink({ title, text, url: targetUrl });
    if (result === 'shared') setFeedback('shared');
    else if (result === 'copied') setFeedback('copied');
    if (result !== 'failed') setTimeout(() => setFeedback('idle'), 2000);
  }

  return (
    <button
      onClick={handleClick}
      className="p-1.5 rounded-full text-[var(--vb-text-secondary)] hover:text-[var(--vb-primary)] transition-all relative"
      title="Share"
      aria-label="Share this restaurant"
    >
      {feedback === 'copied' ? (
        <>
          <Check size={size} className="text-green-500" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-semibold text-green-600 whitespace-nowrap bg-[var(--vb-bg)] px-2 py-0.5 rounded shadow">
            Link copied
          </span>
        </>
      ) : (
        <Share2 size={size} />
      )}
    </button>
  );
}
