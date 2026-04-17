'use client';

import { useState } from 'react';
import { X, DollarSign, Plus, Trash2, Send, Check } from 'lucide-react';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { formatPrice } from '@valuebite/utils';

type Tab = 'price_update' | 'new_item' | 'remove_item';

interface MenuItem {
  id?: string;
  name: string;
  nameLocal?: string;
  price: number;
  currency: string;
  category: string;
}

interface Props {
  restaurantId: string;
  restaurantName: string;
  menuItems: MenuItem[];
  priceCurrency: string;
  onClose: () => void;
}

export function PriceSuggestionModal({ restaurantId, restaurantName, menuItems, priceCurrency, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('price_update');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Price update state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState('');

  // New item state
  const [itemName, setItemName] = useState('');
  const [itemNameLocal, setItemNameLocal] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('main');

  // Remove item state
  const [removeItem, setRemoveItem] = useState<MenuItem | null>(null);
  const [removeReason, setRemoveReason] = useState('');

  // Shared
  const [note, setNote] = useState('');

  const currencySymbol = { JPY: '\u00a5', USD: '$', GBP: '\u00a3', EUR: '\u20ac', SGD: 'S$', HKD: 'HK$' }[priceCurrency] || '$';

  async function handleSubmit() {
    setError('');
    setSubmitting(true);

    try {
      const fingerprint = await getDeviceFingerprint();

      let body: any = {
        restaurant_id: restaurantId,
        suggestion_type: tab,
        submitter_fingerprint: fingerprint,
        submitter_note: note || undefined,
      };

      if (tab === 'price_update') {
        if (!selectedItem || !newPrice) { setError('Select an item and enter a new price'); setSubmitting(false); return; }
        body.menu_item_id = selectedItem.id;
        body.current_price = selectedItem.price;
        body.suggested_price = parseFloat(newPrice);
        body.suggested_currency = priceCurrency;
      } else if (tab === 'new_item') {
        if (!itemName || !itemPrice) { setError('Enter item name and price'); setSubmitting(false); return; }
        body.suggested_name = { en: itemName, original: itemNameLocal || itemName };
        body.suggested_price = parseFloat(itemPrice);
        body.suggested_category = itemCategory;
        body.suggested_currency = priceCurrency;
      } else if (tab === 'remove_item') {
        if (!removeItem) { setError('Select an item to flag'); setSubmitting(false); return; }
        body.menu_item_id = removeItem.id;
        body.removal_reason = removeReason || 'Item no longer available';
      }

      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to submit');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="bg-[var(--vb-bg)] rounded-2xl p-8 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-green-500" />
          </div>
          <h3 className="font-bold text-lg">Thank you!</h3>
          <p className="text-sm text-[var(--vb-text-secondary)] mt-1">Your suggestion has been submitted for review.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'price_update', label: 'Correct Price', icon: DollarSign },
    { key: 'new_item', label: 'Add Item', icon: Plus },
    { key: 'remove_item', label: 'Flag Removal', icon: Trash2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--vb-bg)] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--vb-bg)] px-4 py-3 border-b border-[var(--vb-border)] flex items-center justify-between z-10">
          <h2 className="font-bold text-base">Suggest Price Update</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--vb-border)]">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(''); }}
              className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition border-b-2 ${
                tab === key
                  ? 'border-[var(--vb-primary)] text-[var(--vb-primary)]'
                  : 'border-transparent text-[var(--vb-text-secondary)] hover:text-[var(--vb-text)]'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Price Update Tab */}
          {tab === 'price_update' && (
            <>
              <div>
                <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Select Menu Item</label>
                <div className="mt-1.5 max-h-48 overflow-y-auto border border-[var(--vb-border)] rounded-xl divide-y divide-[var(--vb-border)]">
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedItem(item); setNewPrice(''); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition ${
                        selectedItem === item ? 'bg-[var(--vb-primary)]/10' : 'hover:bg-[var(--vb-bg-secondary)]'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="font-semibold flex-shrink-0 ml-2">{currencySymbol}{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedItem && (
                <div>
                  <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">
                    Correct Price ({currencySymbol})
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm text-[var(--vb-text-secondary)] line-through">{currencySymbol}{selectedItem.price}</span>
                    <span className="text-[var(--vb-text-secondary)]">&rarr;</span>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      placeholder="New price"
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* New Item Tab */}
          {tab === 'new_item' && (
            <>
              <div>
                <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Item Name (English)</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="e.g. Chicken Katsu Curry"
                  className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Local Name (optional)</label>
                <input
                  type="text"
                  value={itemNameLocal}
                  onChange={e => setItemNameLocal(e.target.value)}
                  placeholder="e.g. チキンカツカレー"
                  className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Price ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemPrice}
                    onChange={e => setItemPrice(e.target.value)}
                    placeholder="0.00"
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Category</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                  >
                    <option value="main">Main Dish</option>
                    <option value="set_meal">Set Meal</option>
                    <option value="combo">Combo</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="side">Side</option>
                    <option value="drink">Drink</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Remove Item Tab */}
          {tab === 'remove_item' && (
            <>
              <div>
                <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Select Item to Flag</label>
                <div className="mt-1.5 max-h-48 overflow-y-auto border border-[var(--vb-border)] rounded-xl divide-y divide-[var(--vb-border)]">
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setRemoveItem(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition ${
                        removeItem === item ? 'bg-red-500/10' : 'hover:bg-[var(--vb-bg-secondary)]'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="font-semibold flex-shrink-0 ml-2">{currencySymbol}{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              {removeItem && (
                <div>
                  <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Reason</label>
                  <select
                    value={removeReason}
                    onChange={e => setRemoveReason(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)]"
                  >
                    <option value="">Select reason...</option>
                    <option value="Item no longer available">No longer available</option>
                    <option value="Restaurant closed">Restaurant closed</option>
                    <option value="Duplicate entry">Duplicate entry</option>
                    <option value="Wrong restaurant">Wrong restaurant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Note (shared) */}
          <div>
            <label className="text-xs font-medium text-[var(--vb-text-secondary)] uppercase tracking-wide">Note (optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Any additional context..."
              rows={2}
              className="mt-1.5 w-full px-3 py-2 rounded-lg border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:border-[var(--vb-primary)] resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <><Send size={15} /> Submit Suggestion</>
            )}
          </button>

          <p className="text-[10px] text-center text-[var(--vb-text-secondary)]">
            Suggestions are reviewed before being applied. No account needed.
          </p>
        </div>
      </div>
    </div>
  );
}
