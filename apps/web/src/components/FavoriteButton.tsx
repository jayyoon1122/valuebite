'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  restaurantId: string;
  restaurantName?: string;
  cuisine?: string;
  price?: string;
  score?: number;
  size?: number;
}

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('valuebite-favorites');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map((f: any) => typeof f === 'string' ? f : f.id) : [];
  } catch { return []; }
}

function saveFavorite(id: string, name?: string, cuisine?: string, price?: string, score?: number) {
  try {
    const saved = localStorage.getItem('valuebite-favorites');
    const favorites: Array<{ id: string; name: string; cuisine?: string; price?: string; score?: number }> = saved ? JSON.parse(saved) : [];
    const existing = favorites.findIndex((f: any) => (typeof f === 'string' ? f : f.id) === id);
    if (existing === -1) {
      favorites.push({ id, name: name || 'Restaurant', cuisine, price, score });
      localStorage.setItem('valuebite-favorites', JSON.stringify(favorites));
    }
  } catch {}
}

function removeFavorite(id: string) {
  try {
    const saved = localStorage.getItem('valuebite-favorites');
    const favorites: any[] = saved ? JSON.parse(saved) : [];
    const filtered = favorites.filter((f: any) => (typeof f === 'string' ? f : f.id) !== id);
    localStorage.setItem('valuebite-favorites', JSON.stringify(filtered));
  } catch {}
}

export function FavoriteButton({ restaurantId, restaurantName, cuisine, price, score, size = 22 }: Props) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(getFavorites().includes(restaurantId));
  }, [restaurantId]);

  const toggle = () => {
    const next = !favorited;
    setFavorited(next);
    if (next) {
      saveFavorite(restaurantId, restaurantName, cuisine, price, score);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    } else {
      removeFavorite(restaurantId);
    }
  };

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      className={`p-1.5 rounded-full transition-all ${
        favorited
          ? 'text-red-500 hover:text-red-600'
          : 'text-[var(--vb-text-secondary)] hover:text-red-400'
      } ${animating ? 'scale-125' : 'scale-100'}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={size} className={favorited ? 'fill-current' : ''} />
    </button>
  );
}
