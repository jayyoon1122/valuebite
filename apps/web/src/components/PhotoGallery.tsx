'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface CategorizedPhoto {
  url: string;
  label: string;
  color: string;
}

const CUISINE_PHOTO_SETS: Record<string, CategorizedPhoto[]> = {
  pizza: [
    { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop', label: 'Signature Dish', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Interior', color: 'bg-purple-500' },
    { url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop', label: 'Menu Item', color: 'bg-green-500' },
  ],
  ramen: [
    { url: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&h=400&fit=crop', label: 'Signature Ramen', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Counter Seating', color: 'bg-purple-500' },
    { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', label: 'Set Meal', color: 'bg-green-500' },
  ],
  gyudon: [
    { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', label: 'Beef Bowl', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=600&h=400&fit=crop', label: 'Set Meal', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Interior', color: 'bg-purple-500' },
  ],
  chinese: [
    { url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop', label: 'Signature Dish', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop', label: 'Dumplings', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Dining Area', color: 'bg-purple-500' },
  ],
  indian: [
    { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop', label: 'Curry Set', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', label: 'Thali Plate', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Restaurant', color: 'bg-blue-500' },
  ],
  burger: [
    { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', label: 'Signature Burger', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', label: 'Combo Meal', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Interior', color: 'bg-purple-500' },
  ],
  sushi: [
    { url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop', label: 'Sushi Plate', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop', label: 'Sashimi', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Counter', color: 'bg-purple-500' },
  ],
  thai: [
    { url: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&h=400&fit=crop', label: 'Pad Thai', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop', label: 'Curry Bowl', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Restaurant', color: 'bg-blue-500' },
  ],
  hawker: [
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop', label: 'Popular Dish', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', label: 'Chef Special', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Hawker Stall', color: 'bg-blue-500' },
  ],
  kebab: [
    { url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop', label: 'Shawarma', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop', label: 'Mixed Grill', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Interior', color: 'bg-purple-500' },
  ],
  default: [
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop', label: 'Popular Dish', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', label: 'Chef Special', color: 'bg-green-500' },
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop', label: 'Interior', color: 'bg-purple-500' },
  ],
};

function getPhotos(cuisineTypes: string[], mainPhoto?: string): CategorizedPhoto[] {
  for (const cuisine of cuisineTypes) {
    const key = Object.keys(CUISINE_PHOTO_SETS).find(k => cuisine.includes(k));
    if (key) {
      const photos = [...CUISINE_PHOTO_SETS[key]];
      if (mainPhoto) photos[0] = { ...photos[0], url: mainPhoto };
      return photos;
    }
  }
  const photos = [...CUISINE_PHOTO_SETS.default];
  if (mainPhoto) photos[0] = { ...photos[0], url: mainPhoto };
  return photos;
}

interface Props {
  cuisineTypes: string[];
  mainPhoto?: string;
  restaurantName: string;
}

export function PhotoGallery({ cuisineTypes, mainPhoto, restaurantName }: Props) {
  const photos = getPhotos(cuisineTypes, mainPhoto);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="h-56 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20 flex items-center justify-center">
        <Camera size={48} className="text-green-300" />
      </div>
    );
  }

  const current = photos[currentIndex];

  return (
    <div className="relative h-56 bg-gray-200 overflow-hidden">
      <img
        src={current.url}
        alt={`${restaurantName} — ${current.label}`}
        className="w-full h-full object-cover"
      />

      {/* Category label */}
      <div className="absolute top-3 left-3">
        <span className={`text-xs text-white px-2 py-0.5 rounded-full font-medium ${current.color}`}>
          {current.label}
        </span>
      </div>

      {/* Counter + Google attribution */}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
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

      {/* Nav arrows */}
      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center"><ChevronLeft size={18} /></button>
          <button onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center"><ChevronRight size={18} /></button>
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
    </div>
  );
}
