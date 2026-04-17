'use client';

import { useState, useEffect } from 'react';
import { CreditCard, TrendingDown, TrendingUp, Plus, Check, Trash2 } from 'lucide-react';
import { formatPrice } from '@valuebite/utils';
import { loadProfile } from '@/lib/user-profile';

interface Props {
  countryCode?: string;
}

interface Expense {
  id: string;
  restaurant: string;
  amount: number;
  date: string;
  countryCode?: string;
}

const STORAGE_KEY = 'valuebite-expenses';

// Currency symbol lookup by country code
const CURRENCY_SYMBOLS: Record<string, string> = {
  JP: '¥', US: '$', GB: '£', SG: 'S$', HK: 'HK$', DE: '€', AU: 'A$', CA: 'C$',
};

// Sensible default monthly budgets by country code
const DEFAULT_BUDGETS: Record<string, number> = {
  JP: 30000, US: 300, GB: 200, SG: 300, HK: 2000, DE: 250, AU: 350, CA: 350,
};

function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveExpenses(expenses: Expense[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); } catch {}
}

export function BudgetTracker({ countryCode = 'JP' }: Props) {
  const currencySymbol = CURRENCY_SYMBOLS[countryCode] || '$';
  const defaultBudget = DEFAULT_BUDGETS[countryCode] || 300;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(defaultBudget);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logAmount, setLogAmount] = useState('');
  const [logRestaurant, setLogRestaurant] = useState('');

  useEffect(() => {
    setExpenses(loadExpenses());
    // Read budget from user profile (set via /profile/edit)
    const profile = loadProfile();
    if (profile.monthlyBudget) {
      const parsed = parseInt(profile.monthlyBudget);
      if (!isNaN(parsed) && parsed > 0) {
        setBudget(parsed);
        return;
      }
    }
    // Fallback to legacy key
    try {
      const savedBudget = localStorage.getItem('valuebite-budget');
      if (savedBudget) {
        const parsed = parseInt(savedBudget);
        if (!isNaN(parsed) && parsed > 0) setBudget(parsed);
      }
    } catch {}
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = budget > 0 ? Math.min(100, (totalSpent / budget) * 100) : 0;
  const dayOfMonth = new Date().getDate() || 1;
  const dailyAvg = expenses.length > 0 ? totalSpent / dayOfMonth : 0;
  const projectedMonthly = dailyAvg * 30;
  const onTrack = projectedMonthly <= budget || expenses.length === 0;

  const currentMonth = new Date().toLocaleString('en', { month: 'long', year: 'numeric' });

  const handleLog = () => {
    const amount = parseFloat(logAmount);
    if (!logRestaurant.trim() || isNaN(amount) || amount <= 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      restaurant: logRestaurant.trim(),
      amount,
      date: new Date().toISOString().split('T')[0],
      countryCode,
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    setShowLogForm(false);
    setLogAmount('');
    setLogRestaurant('');
  };

  const removeExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Check if any expenses were logged in a different currency
  const mixedCurrency = expenses.some(e => e.countryCode && e.countryCode !== countryCode);

  return (
    <div className="space-y-4">
      {/* Currency mismatch notice */}
      {mixedCurrency && (
        <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-300">Mixed currencies detected</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            Some expenses were logged in a different region. Totals may not reflect accurate conversion.
          </p>
        </div>
      )}

      {/* Budget overview card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard size={18} /> Monthly Budget
          </h3>
          <span className="text-sm opacity-80">{currentMonth}</span>
        </div>

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

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold">{formatPrice(Math.max(0, remaining), countryCode)}</div>
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]">{currencySymbol}</span>
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
            <button onClick={handleLog} disabled={!logRestaurant.trim() || !logAmount} className="flex-1 py-2 rounded-lg bg-[var(--vb-primary)] text-white text-sm font-semibold disabled:opacity-50">
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
      {expenses.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Recent Expenses</h4>
          <div className="space-y-1">
            {expenses.slice(0, 10).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--vb-bg-secondary)] group"
              >
                <div>
                  <span className="text-sm">{expense.restaurant}</span>
                  <span className="text-xs text-[var(--vb-text-secondary)] ml-2">{expense.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{formatPrice(expense.amount, countryCode)}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-6 text-[var(--vb-text-secondary)]">
          <p className="text-sm">No expenses logged yet</p>
          <p className="text-xs mt-1">Tap "Log Expense" to start tracking your dining budget</p>
        </div>
      )}
    </div>
  );
}
