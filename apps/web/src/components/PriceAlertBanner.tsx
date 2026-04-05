'use client';

import { TrendingUp, TrendingDown, Bell, X } from 'lucide-react';
import { useState } from 'react';

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
  {
    id: '1',
    restaurantName: 'Matsuya Shinjuku',
    menuItem: 'Beef Bowl (Regular)',
    previousPrice: 430,
    newPrice: 450,
    currency: '¥',
    type: 'increase',
  },
  {
    id: '2',
    restaurantName: 'Hidakaya Ikebukuro',
    menuItem: 'Ramen Set',
    previousPrice: 520,
    newPrice: 490,
    currency: '¥',
    type: 'decrease',
  },
];

export function PriceAlertBanner() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissed(new Set([...dismissed, id]));
  };

  return (
    <div className="px-4 space-y-2">
      {visible.map((alert) => {
        const isUp = alert.type === 'increase';
        const diff = Math.abs(alert.newPrice - alert.previousPrice);
        const pctChange = Math.round((diff / alert.previousPrice) * 100);

        return (
          <div
            key={alert.id}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
              isUp
                ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                : 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
            }`}
          >
            <div className={`shrink-0 ${isUp ? 'text-red-500' : 'text-green-500'}`}>
              {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{alert.restaurantName}</p>
              <p className="text-xs text-[var(--vb-text-secondary)]">
                {alert.menuItem}: {alert.currency}{alert.previousPrice} → {alert.currency}{alert.newPrice}
                <span className={`ml-1 font-medium ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                  ({isUp ? '+' : '-'}{pctChange}%)
                </span>
              </p>
            </div>
            <button
              onClick={() => dismiss(alert.id)}
              className="shrink-0 p-1 text-[var(--vb-text-secondary)] hover:text-[var(--vb-text)]"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
