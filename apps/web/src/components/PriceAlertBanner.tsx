'use client';

import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PriceAlert {
  id: string;
  restaurantName: string;
  menuItem: string;
  previousPrice: number;
  newPrice: number;
  currency: string;
  type: 'increase' | 'decrease';
}

const MOCK_ALERTS: PriceAlert[] = [
  { id: '1', restaurantName: 'Matsuya Shinjuku', menuItem: 'Beef Bowl', previousPrice: 430, newPrice: 450, currency: '¥', type: 'increase' },
  { id: '2', restaurantName: 'Hidakaya Ikebukuro', menuItem: 'Ramen Set', previousPrice: 520, newPrice: 490, currency: '¥', type: 'decrease' },
];

const STORAGE_KEY = 'vb-alerts-dismissed';

export function PriceAlertBanner() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Only show once per session/device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        if (currentIndex < MOCK_ALERTS.length - 1) {
          setCurrentIndex(i => i + 1);
          setExiting(false);
        } else {
          setVisible(false);
          localStorage.setItem(STORAGE_KEY, 'true');
        }
      }, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex, visible]);

  if (!visible || currentIndex >= MOCK_ALERTS.length) return null;

  const alert = MOCK_ALERTS[currentIndex];
  const isUp = alert.type === 'increase';
  const pctChange = Math.round((Math.abs(alert.newPrice - alert.previousPrice) / alert.previousPrice) * 100);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, 'true');
    }, 300);
  };

  return (
    <div className={`fixed top-14 left-4 right-4 z-50 transition-all duration-300 ${exiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs shadow-md backdrop-blur-sm ${
        isUp ? 'bg-red-50/95 dark:bg-red-950/90 border border-red-200 dark:border-red-800'
             : 'bg-green-50/95 dark:bg-green-950/90 border border-green-200 dark:border-green-800'
      }`}>
        <div className={`shrink-0 ${isUp ? 'text-red-500' : 'text-green-600'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
        <p className="flex-1 min-w-0 truncate">
          <span className="font-medium">{alert.restaurantName}</span>
          <span className="text-[var(--vb-text-secondary)]"> {alert.menuItem} {alert.currency}{alert.previousPrice}→{alert.currency}{alert.newPrice}</span>
          <span className={`font-semibold ${isUp ? 'text-red-600' : 'text-green-700'}`}> ({isUp ? '+' : '-'}{pctChange}%)</span>
        </p>
        <button onClick={dismiss} className="shrink-0 p-0.5 text-[var(--vb-text-secondary)]">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
