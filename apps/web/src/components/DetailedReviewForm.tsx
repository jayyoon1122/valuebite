'use client';

import { useState } from 'react';
import { Star, Camera, X, Send, Loader2 } from 'lucide-react';

interface Props {
  restaurantId: string;
  restaurantName: string;
  currency?: string;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="p-0.5"
          >
            <Star
              size={22}
              className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function DetailedReviewForm({ restaurantId, restaurantName, currency = '¥', onSubmit, onClose }: Props) {
  const [taste, setTaste] = useState(0);
  const [portion, setPortion] = useState(0);
  const [value, setValue] = useState(0);
  const [content, setContent] = useState('');
  const [pricePaid, setPricePaid] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const purposes = [
    { key: 'daily_eats', label: 'Daily Eats', icon: '🍱' },
    { key: 'date_night', label: 'Date Night', icon: '🥂' },
    { key: 'family_dinner', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { key: 'late_night', label: 'Late Night', icon: '🌙' },
    { key: 'solo_dining', label: 'Solo', icon: '🧑‍💻' },
    { key: 'group_party', label: 'Group', icon: '🎉' },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    const data = {
      restaurantId,
      tasteRating: taste || undefined,
      portionRating: portion || undefined,
      valueRating: value || undefined,
      content: content || undefined,
      pricePaid: pricePaid ? parseFloat(pricePaid) : undefined,
      visitPurpose: purpose || undefined,
      wasWorthIt: value >= 3 ? true : value > 0 ? false : undefined,
    };
    onSubmit?.(data);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[var(--vb-bg)] rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-bold">Review Submitted!</h3>
        <p className="text-sm text-[var(--vb-text-secondary)] mt-1">+20 contribution points earned</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-[var(--vb-primary)] text-white rounded-full text-sm font-semibold">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--vb-bg)] rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)]">
        <h3 className="font-semibold">Review {restaurantName}</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Star ratings */}
        <div className="space-y-3">
          <StarRating value={taste} onChange={setTaste} label="Taste" />
          <StarRating value={portion} onChange={setPortion} label="Portions" />
          <StarRating value={value} onChange={setValue} label="Value for Money" />
        </div>

        {/* Visit purpose */}
        <div>
          <label className="text-sm font-medium block mb-2">What was the occasion?</label>
          <div className="flex flex-wrap gap-1.5">
            {purposes.map((p) => (
              <button
                key={p.key}
                onClick={() => setPurpose(purpose === p.key ? '' : p.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  purpose === p.key
                    ? 'bg-[var(--vb-primary)] text-white'
                    : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)]'
                }`}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price paid */}
        <div>
          <label className="text-sm font-medium block mb-1">How much did you pay?</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]">{currency}</span>
            <input
              type="number"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
            />
          </div>
        </div>

        {/* Review text */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Your review <span className="text-[var(--vb-text-secondary)]">(optional)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
          />
        </div>

        {/* Photo upload placeholder */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-[var(--vb-border)] text-sm text-[var(--vb-text-secondary)] hover:border-[var(--vb-primary)] hover:text-[var(--vb-primary)] transition">
          <Camera size={18} /> Add Food Photos
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || (taste === 0 && portion === 0 && value === 0 && !content)}
          className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Submit Review
        </button>
      </div>
    </div>
  );
}
