'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  restaurantId: string;
  initialFavorited?: boolean;
  size?: number;
}

export function FavoriteButton({ restaurantId, initialFavorited = false, size = 22 }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [animating, setAnimating] = useState(false);

  const toggle = () => {
    setFavorited(!favorited);
    if (!favorited) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
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
