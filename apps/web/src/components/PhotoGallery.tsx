'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, ImageOff } from 'lucide-react';
import { FullScreenPhoto } from './FullScreenPhoto';

interface Photo {
  url: string;
  label: string;
  color: string;
}

interface Props {
  restaurantName: string;
  realPhotos?: Photo[] | null;
  // Legacy props (ignored — we only use real photos now)
  cuisineTypes?: string[];
  mainPhoto?: string;
}

export function PhotoGallery({ restaurantName, realPhotos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Only use real photos — NO mock fallback
  const photos = realPhotos || [];

  // No photos: show clean placeholder
  if (photos.length === 0) {
    return (
      <div className="h-48 bg-[var(--vb-bg-secondary)] flex flex-col items-center justify-center gap-2">
        <ImageOff size={32} className="text-[var(--vb-text-secondary)] opacity-40" />
        <p className="text-xs text-[var(--vb-text-secondary)]">Photos coming soon</p>
      </div>
    );
  }

  const current = photos[currentIndex];

  // Swipe handlers
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
      className="relative h-56 bg-gray-200 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={current.url}
        alt={`${restaurantName} — ${current.label}`}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => setFullscreen(true)}
        loading="lazy"
      />

      {/* Category label */}
      <div className="absolute top-3 left-3">
        <span className={`text-xs text-white px-2 py-0.5 rounded-full font-medium ${current.color}`}>
          {current.label}
        </span>
      </div>

      {/* Counter + Google badge */}
      <div className="absolute bottom-3 right-3">
        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Camera size={11} /> {currentIndex + 1}/{photos.length}
        </span>
      </div>
      <div className="absolute bottom-3 left-3">
        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
          Photos
        </span>
      </div>

      {/* Nav arrows (desktop) */}
      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full hidden sm:flex items-center justify-center"><ChevronLeft size={18} /></button>
          <button onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full hidden sm:flex items-center justify-center"><ChevronRight size={18} /></button>
        </>
      )}

      {/* Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      )}

      {/* Fullscreen viewer */}
      {fullscreen && (
        <FullScreenPhoto
          photos={photos}
          initialIndex={currentIndex}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
