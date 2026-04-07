'use client';

import { useState } from 'react';
import { CreditCard, TrendingDown, TrendingUp, Plus, Check } from 'lucide-react';
import { formatPrice } from '@valuebite/utils';

interface Props {
  countryCode?: string;
  currency?: string;
}

interface Expense {
  id: string;
  restaurant: string;
  amount: number;
  date: string;
  purpose?: string;
}


export function BudgetTracker({ countryCode = 'JP', currency = '¥' }: Props) {
  const [budget, setBudget] = useState(30000); // ¥30,000/month
  const [showLogForm, setShowLogForm] = useState(false);
  const [logAmount, setLogAmount] = useState('');
  const [logRestaurant, setLogRestaurant] = useState('');
  const [expenses] = useState<Expense[]>([]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = Math.min(100, (totalSpent / budget) * 100);
  const daysInMonth = 30;
  const dayOfMonth = new Date().getDate();
  const dailyAvg = totalSpent / dayOfMonth;
  const projectedMonthly = dailyAvg * daysInMonth;
  const onTrack = projectedMonthly <= budget;

  const handleLog = () => {
    setShowLogForm(false);
    setLogAmount('');
    setLogRestaurant('');
  };

  return (
    <div className="space-y-4">
      {/* Budget overview card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard size={18} /> Monthly Budget
          </h3>
          <span className="text-sm opacity-80">April 2026</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Spent: {formatPrice(totalSpent, countryCode)}</span>
            <span>Budget: {formatPrice(budget, countryCode)}</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: percentage > 90 ? '#ef4444' : percentage > 70 ? '#eab308' : '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold">{formatPrice(remaining, countryCode)}</div>
            <div className="text-xs opacity-80">Remaining</div>
          </div>
          <div>
            <div className="text-lg font-bold">{formatPrice(Math.round(dailyAvg), countryCode)}</div>
            <div className="text-xs opacity-80">Daily Avg</div>
          </div>
          <div>
            <div className="text-lg font-bold flex items-center justify-center gap-1">
              {onTrack ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              {onTrack ? 'On Track' : 'Over'}
            </div>
            <div className="text-xs opacity-80">Projection</div>
          </div>
        </div>
      </div>

      {/* Quick log */}
      {showLogForm ? (
        <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-4 space-y-3">
          <h4 className="font-medium text-sm">Log Dining Expense</h4>
          <input
            type="text"
            value={logRestaurant}
            onChange={(e) => setLogRestaurant(e.target.value)}
            placeholder="Restaurant name"
            className="w-full px-3 py-2 rounded-lg bg-[var(--vb-bg)] border border-[var(--vb-border)] text-sm"
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]">{currency}</span>
            <input
              type="number"
              value={logAmount}
              onChange={(e) => setLogAmount(e.target.value)}
              placeholder="Amount"
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-[var(--vb-bg)] border border-[var(--vb-border)] text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowLogForm(false)} className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm">
              Cancel
            </button>
            <button onClick={handleLog} className="flex-1 py-2 rounded-lg bg-[var(--vb-primary)] text-white text-sm font-semibold">
              <Check size={16} className="inline mr-1" /> Log
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowLogForm(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--vb-border)] text-sm text-[var(--vb-text-secondary)] hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Log Expense
        </button>
      )}

      {/* Recent expenses */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Recent Expenses</h4>
        <div className="space-y-1">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--vb-bg-secondary)]"
            >
              <div>
                <span className="text-sm">{expense.restaurant}</span>
                <span className="text-xs text-[var(--vb-text-secondary)] ml-2">{expense.date}</span>
              </div>
              <span className="font-semibold text-sm">{formatPrice(expense.amount, countryCode)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Savings insight */}
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-center">
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          You saved {formatPrice(Math.round(budget * 0.15), countryCode)} vs. average this month!
        </p>
        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
          ValueBite users save 15% on avg by choosing smarter
        </p>
      </div>
    </div>
  );
}
