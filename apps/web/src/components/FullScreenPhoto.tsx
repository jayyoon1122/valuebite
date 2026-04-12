'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
  label: string;
}

interface Props {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export function FullScreenPhoto({ photos, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const current = photos[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % photos.length);
    };
    window.addEventListener('keydown', handler);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [photos.length, onClose]);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentIndex((i) => (i + 1) % photos.length); // swipe left → next
      else setCurrentIndex((i) => (i - 1 + photos.length) % photos.length); // swipe right → prev
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X size={24} />
        </button>
        <span className="text-sm font-medium">{currentIndex + 1} / {photos.length}</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center px-4">
        <img
          src={current.url}
          alt={current.label}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Bottom spacing */}
      <div className="py-3" />

      {/* Arrow buttons (desktop) */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full hidden sm:flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full hidden sm:flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
