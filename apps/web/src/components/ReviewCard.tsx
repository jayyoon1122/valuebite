'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Heart, Sparkles } from 'lucide-react';

function HelpfulButton({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);
  const [localCount, setLocalCount] = useState(count);

  const toggle = () => {
    if (liked) {
      setLocalCount(c => c - 1);
    } else {
      setLocalCount(c => c + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[var(--vb-border)]">
      <button
        onClick={toggle}
        className={`flex items-center gap-1 text-xs transition ${
          liked ? 'text-red-500 font-semibold' : 'text-[var(--vb-text-secondary)] hover:text-red-400'
        }`}
      >
        <Heart size={14} className={liked ? 'fill-current' : ''} />
        Helpful ({localCount})
      </button>
    </div>
  );
}

interface ReviewData {
  id: string;
  userName: string;
  userLevel: number;
  wasWorthIt?: boolean;
  pricePaid?: number;
  currency?: string;
  tasteRating?: number;
  portionRating?: number;
  valueRating?: number;
  content?: string;
  visitPurpose?: string;
  aiSummary?: string;
  helpfulCount: number;
  createdAt: string;
}

interface Props {
  review: ReviewData;
}

const levelLabels = ['', 'Newbie', 'Regular', 'Expert', 'Master'];
const levelColors = ['', 'text-gray-500', 'text-blue-500', 'text-purple-500', 'text-yellow-500'];

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: Props) {
  const timeAgo = getTimeAgo(review.createdAt);

  return (
    <div className="border border-[var(--vb-border)] rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--vb-bg-secondary)] flex items-center justify-center text-xs font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium">{review.userName}</span>
            <span className={`ml-2 text-xs ${levelColors[review.userLevel] || ''}`}>
              {levelLabels[review.userLevel] || ''}
            </span>
          </div>
        </div>
        <span className="text-xs text-[var(--vb-text-secondary)]">{timeAgo}</span>
      </div>

      {/* Quick vote */}
      {review.wasWorthIt !== undefined && (
        <div className="flex items-center gap-2 mb-2">
          {review.wasWorthIt ? (
            <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
              <ThumbsUp size={12} /> Worth it
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
              <ThumbsDown size={12} /> Not worth it
            </span>
          )}
          {review.pricePaid && (
            <span className="text-xs text-[var(--vb-text-secondary)]">
              Paid: {review.currency}{review.pricePaid}
            </span>
          )}
        </div>
      )}

      {/* Star ratings */}
      {(review.tasteRating || review.portionRating || review.valueRating) && (
        <div className="flex gap-4 mb-2 text-xs">
          {review.tasteRating && (
            <div className="flex items-center gap-1">
              <span className="text-[var(--vb-text-secondary)]">Taste</span>
              <MiniStars rating={review.tasteRating} />
            </div>
          )}
          {review.portionRating && (
            <div className="flex items-center gap-1">
              <span className="text-[var(--vb-text-secondary)]">Portion</span>
              <MiniStars rating={review.portionRating} />
            </div>
          )}
          {review.valueRating && (
            <div className="flex items-center gap-1">
              <span className="text-[var(--vb-text-secondary)]">Value</span>
              <MiniStars rating={review.valueRating} />
            </div>
          )}
        </div>
      )}

      {/* Review text */}
      {review.content && (
        <p className="text-sm mb-2 leading-relaxed">{review.content}</p>
      )}

      {/* AI summary of this review */}
      {review.aiSummary && (
        <div className="text-xs text-purple-600 dark:text-purple-400 flex items-start gap-1 mb-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-2">
          <Sparkles size={12} className="shrink-0 mt-0.5" />
          <span>{review.aiSummary}</span>
        </div>
      )}

      {/* Purpose tag */}
      {review.visitPurpose && (
        <span className="text-xs bg-[var(--vb-bg-secondary)] px-2 py-0.5 rounded-full capitalize">
          {review.visitPurpose.replace('_', ' ')}
        </span>
      )}

      {/* Actions */}
      <HelpfulButton count={review.helpfulCount} />
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
