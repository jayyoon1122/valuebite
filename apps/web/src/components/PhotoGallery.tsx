'use client';

import { useState, useRef, useCallback } from 'react';
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
  cuisineTypes?: string[];
  mainPhoto?: string;
}

export function PhotoGallery({ restaurantName, realPhotos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleImageError = useCallback((url: string) => {
    setBrokenUrls(prev => new Set(prev).add(url));
  }, []);

  // Filter out broken photos
  const photos = (realPhotos || []).filter(p => !brokenUrls.has(p.url));

  if (photos.length === 0) {
    return (
      <div className="h-48 bg-[var(--vb-bg-secondary)] flex flex-col items-center justify-center gap-2">
        <ImageOff size={32} className="text-[var(--vb-text-secondary)] opacity-40" />
        <p className="text-xs text-[var(--vb-text-secondary)]">Photos coming soon</p>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, photos.length - 1);
  const current = photos[safeIndex];

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentIndex((i) => (i + 1) % photos.length);
      else setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div
      className="relative h-64 bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={current.url}
        alt={`${restaurantName} photo ${safeIndex + 1}`}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => setFullscreen(true)}
        onError={() => handleImageError(current.url)}
        loading="lazy"
      />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* Counter badge — no labels */}
      <div className="absolute bottom-3 right-3">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Camera size={11} /> {safeIndex + 1}/{photos.length}
        </span>
      </div>

      {/* Nav arrows (desktop) */}
      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full hidden sm:flex items-center justify-center transition"><ChevronLeft size={18} /></button>
          <button onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full hidden sm:flex items-center justify-center transition"><ChevronRight size={18} /></button>
        </>
      )}

      {/* Dots */}
      {photos.length > 1 && photos.length <= 12 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={`w-1.5 h-1.5 rounded-full transition ${i === safeIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
          ))}
        </div>
      )}

      {fullscreen && (
        <FullScreenPhoto
          photos={photos}
          initialIndex={safeIndex}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
