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
  { id: '1', restaurantName: 'Matsuya Shinjuku', menuItem: 'Beef Bowl (Regular)', previousPrice: 430, newPrice: 450, currency: '¥', type: 'increase' },
  { id: '2', restaurantName: 'Hidakaya Ikebukuro', menuItem: 'Ramen Set', previousPrice: 520, newPrice: 490, currency: '¥', type: 'decrease' },
];

export function PriceAlertBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Auto-dismiss after 5 seconds, show next
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
        }
      }, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, visible]);

  if (!visible || currentIndex >= MOCK_ALERTS.length) return null;

  const alert = MOCK_ALERTS[currentIndex];
  const isUp = alert.type === 'increase';
  const pctChange = Math.round((Math.abs(alert.newPrice - alert.previousPrice) / alert.previousPrice) * 100);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      if (currentIndex < MOCK_ALERTS.length - 1) {
        setCurrentIndex(i => i + 1);
        setExiting(false);
      } else {
        setVisible(false);
      }
    }, 300);
  };

  return (
    <div className={`fixed top-16 left-4 right-4 z-50 transition-all duration-300 ${exiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className={`flex items-center gap-3 p-3 rounded-xl text-sm shadow-lg backdrop-blur-sm ${
        isUp
          ? 'bg-red-50/95 dark:bg-red-950/90 border border-red-200 dark:border-red-800'
          : 'bg-green-50/95 dark:bg-green-950/90 border border-green-200 dark:border-green-800'
      }`}>
        <div className={`shrink-0 ${isUp ? 'text-red-500' : 'text-green-600'}`}>
          {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{alert.restaurantName}</p>
          <p className="text-xs text-[var(--vb-text-secondary)]">
            {alert.menuItem}: {alert.currency}{alert.previousPrice} → {alert.currency}{alert.newPrice}
            <span className={`ml-1 font-semibold ${isUp ? 'text-red-600' : 'text-green-700'}`}>
              ({isUp ? '+' : '-'}{pctChange}%)
            </span>
          </p>
        </div>
        <button onClick={dismiss} className="shrink-0 p-1 text-[var(--vb-text-secondary)]">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
