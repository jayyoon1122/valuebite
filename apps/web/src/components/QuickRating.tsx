'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, DollarSign } from 'lucide-react';

interface Props {
  restaurantId: string;
  currency?: string;
  onSubmit?: (data: { wasWorthIt: boolean; pricePaid?: number }) => void;
}

export function QuickRating({ restaurantId, currency = '¥', onSubmit }: Props) {
  const [step, setStep] = useState<'vote' | 'price' | 'done'>('vote');
  const [worthIt, setWorthIt] = useState<boolean | null>(null);
  const [pricePaid, setPricePaid] = useState('');

  const handleVote = (value: boolean) => {
    setWorthIt(value);
    setStep('price');
  };

  const handleSubmit = () => {
    const data = {
      wasWorthIt: worthIt!,
      pricePaid: pricePaid ? parseFloat(pricePaid) : undefined,
    };
    onSubmit?.(data);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 text-center">
        <Check size={32} className="text-green-600 mx-auto mb-2" />
        <p className="font-semibold text-green-700 dark:text-green-300">Thanks for your rating!</p>
        <p className="text-xs text-[var(--vb-text-secondary)] mt-1">+5 contribution points earned</p>
      </div>
    );
  }

  if (step === 'price') {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
        <div className="text-center mb-3">
          <span className="text-2xl">{worthIt ? '👍' : '👎'}</span>
          <p className="text-sm font-medium mt-1">
            {worthIt ? 'Glad you enjoyed it!' : 'Sorry to hear that!'}
          </p>
        </div>
        <div className="mb-3">
          <label className="text-sm font-medium block mb-1">
            How much did you pay? <span className="text-[var(--vb-text-secondary)]">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]">{currency}</span>
            <input
              type="number"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('vote')}
            className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-medium"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-[var(--vb-primary)] text-white text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
      <h3 className="font-semibold text-center mb-3">Was it worth it?</h3>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleVote(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--vb-primary)] text-white rounded-full font-semibold hover:opacity-90 transition active:scale-95"
        >
          <ThumbsUp size={18} /> Yes!
        </button>
        <button
          onClick={() => handleVote(false)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition active:scale-95"
        >
          <ThumbsDown size={18} /> Not really
        </button>
      </div>
    </div>
  );
}
