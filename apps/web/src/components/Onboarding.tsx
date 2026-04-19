'use client';

import { useState, useEffect } from 'react';
import { Star, Compass, Wallet, ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'vb-onboarded-v1';

interface Slide {
  icon: any;
  title: string;
  body: string;
  bg: string;
  accent: string;
  emoji: string;
}

const SLIDES: Slide[] = [
  {
    icon: Star,
    title: 'Find places you can actually afford',
    body: 'Every restaurant gets a Value score (1-5). Green = great quality for the price. No more wondering "is this overpriced?"',
    bg: 'from-green-500 to-emerald-700',
    accent: 'text-green-100',
    emoji: '🍽️',
  },
  {
    icon: Compass,
    title: 'Curated for the moment',
    body: 'Date Night, Late Night, Family Dinner, Solo Dining — pick your purpose and we\'ll surface the best fit, filtered by what locals actually pay.',
    bg: 'from-orange-500 to-pink-600',
    accent: 'text-orange-100',
    emoji: '🥂',
  },
  {
    icon: Wallet,
    title: 'Track your dining budget',
    body: 'Log meals as you eat. We project where you\'ll land for the month and show how much you\'re saving versus typical dining.',
    bg: 'from-blue-500 to-indigo-700',
    accent: 'text-blue-100',
    emoji: '💰',
  },
];

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Defer mount so it doesn't compete with location-permission prompt for visual focus.
      setTimeout(() => setShow(true), 300);
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setShow(false);
  }

  if (!show) return null;
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={dismiss} />
      <div className="relative w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden pointer-events-auto shadow-2xl bg-[var(--vb-bg)]">
        {/* Skip button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/30 text-white/90 hover:bg-black/50 transition"
          aria-label="Skip"
        >
          <X size={18} />
        </button>

        {/* Image area */}
        <div className={`bg-gradient-to-br ${slide.bg} h-56 flex flex-col items-center justify-center gap-3 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <span className="text-6xl drop-shadow-lg">{slide.emoji}</span>
          <Icon size={36} className="text-white drop-shadow" />
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-7 text-center">
          <h2 className="text-xl font-bold mb-2.5">{slide.title}</h2>
          <p className="text-sm text-[var(--vb-text-secondary)] leading-relaxed mb-6">{slide.body}</p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[var(--vb-primary)]' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button
              onClick={dismiss}
              className="flex-1 py-3 rounded-xl text-sm text-[var(--vb-text-secondary)] hover:bg-[var(--vb-bg-secondary)] transition"
            >
              Skip
            </button>
            <button
              onClick={() => isLast ? dismiss() : setIdx(idx + 1)}
              className="flex-[2] py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold text-sm flex items-center justify-center gap-1.5 hover:opacity-95 transition"
            >
              {isLast ? 'Get started' : 'Next'}
              {!isLast && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
