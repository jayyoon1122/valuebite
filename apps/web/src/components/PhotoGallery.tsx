'use client';

import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
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

// Cuisine-themed gradient fallbacks (avoid empty placeholder feeling)
const CUISINE_THEME: Record<string, { emoji: string; gradient: string }> = {
  japanese: { emoji: '🍣', gradient: 'from-rose-400 via-pink-500 to-red-500' },
  sushi: { emoji: '🍣', gradient: 'from-rose-400 via-pink-500 to-red-500' },
  ramen: { emoji: '🍜', gradient: 'from-amber-400 via-orange-500 to-red-500' },
  udon: { emoji: '🍜', gradient: 'from-amber-300 via-yellow-500 to-orange-500' },
  yakitori: { emoji: '🍢', gradient: 'from-amber-500 via-orange-600 to-red-600' },
  korean: { emoji: '🍖', gradient: 'from-red-500 via-rose-600 to-pink-600' },
  chinese: { emoji: '🥡', gradient: 'from-red-400 via-rose-500 to-pink-500' },
  thai: { emoji: '🍛', gradient: 'from-green-400 via-emerald-500 to-teal-500' },
  indian: { emoji: '🍛', gradient: 'from-orange-400 via-amber-500 to-yellow-500' },
  italian: { emoji: '🍝', gradient: 'from-green-500 via-yellow-400 to-red-500' },
  pizza: { emoji: '🍕', gradient: 'from-red-400 via-orange-500 to-yellow-500' },
  mexican: { emoji: '🌮', gradient: 'from-yellow-400 via-orange-500 to-red-500' },
  burger: { emoji: '🍔', gradient: 'from-yellow-500 via-amber-600 to-red-600' },
  american: { emoji: '🍔', gradient: 'from-blue-500 via-indigo-600 to-purple-600' },
  cafe: { emoji: '☕', gradient: 'from-amber-700 via-yellow-800 to-stone-700' },
  bakery: { emoji: '🥖', gradient: 'from-amber-300 via-orange-400 to-yellow-500' },
  vietnamese: { emoji: '🍲', gradient: 'from-emerald-400 via-green-500 to-teal-600' },
  seafood: { emoji: '🦐', gradient: 'from-blue-400 via-cyan-500 to-teal-500' },
  default: { emoji: '🍽', gradient: 'from-slate-500 via-gray-600 to-zinc-700' },
};

function getCuisineTheme(cuisineTypes?: string[]) {
  if (!cuisineTypes?.length) return CUISINE_THEME.default;
  for (const c of cuisineTypes) {
    const key = c.toLowerCase().replace(/[_\s]/g, '');
    for (const [k, v] of Object.entries(CUISINE_THEME)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }
  return CUISINE_THEME.default;
}

export function PhotoGallery({ restaurantName, realPhotos, cuisineTypes }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleImageError = useCallback((url: string) => {
    setBrokenUrls(prev => new Set(prev).add(url));
  }, []);
  const handleImageLoad = useCallback((url: string) => {
    setLoadedUrls(prev => new Set(prev).add(url));
  }, []);

  // Filter out broken photos
  const photos = (realPhotos || []).filter(p => !brokenUrls.has(p.url));
  const theme = getCuisineTheme(cuisineTypes);

  if (photos.length === 0) {
    return (
      <div className={`h-64 bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center gap-3 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <span className="text-7xl drop-shadow-lg" role="img" aria-label="Cuisine">{theme.emoji}</span>
        <p className="text-sm text-white/90 font-medium drop-shadow">{restaurantName}</p>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, photos.length - 1);
  const current = photos[safeIndex];
  const isLoaded = loadedUrls.has(current.url);

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
      className={`relative h-64 overflow-hidden ${isLoaded ? 'bg-black' : `bg-gradient-to-br ${theme.gradient}`}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cuisine-themed skeleton shown while photo loads (instead of black void) */}
      {!isLoaded && (
        <>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <span className="text-6xl drop-shadow-lg animate-pulse" role="img" aria-label="Loading">{theme.emoji}</span>
            <p className="text-xs text-white/80 font-medium drop-shadow uppercase tracking-wide">Loading photo…</p>
          </div>
        </>
      )}
      <img
        src={current.url}
        alt={`${restaurantName} photo ${safeIndex + 1}`}
        className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setFullscreen(true)}
        onError={() => handleImageError(current.url)}
        onLoad={() => handleImageLoad(current.url)}
        loading="eager"
        decoding="async"
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
