'use client';

import { Sparkles, ThumbsUp, Clock, AlertTriangle } from 'lucide-react';

interface AISummary {
  summary: string;
  bestItems: string[];
  bestFor: string[];
  commonComplaints: string[];
  bestTimeToVisit?: string;
  worthItPercentage: number;
  avgPricePaid?: number;
}

interface Props {
  summary: AISummary;
  currency?: string;
}

export function AISummaryCard({ summary, currency = '¥' }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
      <h3 className="font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-3">
        <Sparkles size={18} /> AI Summary
      </h3>

      <p className="text-sm leading-relaxed mb-3">{summary.summary}</p>

      {/* Worth it gauge */}
      <div className="flex items-center gap-3 mb-3 bg-white/60 dark:bg-white/5 rounded-lg p-3">
        <ThumbsUp size={20} className="text-green-600 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Worth It Rating</span>
            <span className="font-bold text-green-600">{summary.worthItPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${summary.worthItPercentage}%`,
                backgroundColor: summary.worthItPercentage >= 80 ? '#22c55e' :
                  summary.worthItPercentage >= 60 ? '#eab308' : '#ef4444',
              }}
            />
          </div>
        </div>
      </div>

      {/* Best items */}
      {summary.bestItems.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase mb-1">
            Top Picks
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {summary.bestItems.map((item, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Best for */}
      {summary.bestFor.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase mb-1">
            Best For
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {summary.bestFor.map((purpose, i) => (
              <span
                key={i}
                className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
              >
                {purpose}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Common complaints */}
      {summary.commonComplaints.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase mb-1">
            Heads Up
          </h4>
          {summary.commonComplaints.map((complaint, i) => (
            <p key={i} className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <AlertTriangle size={12} /> {complaint}
            </p>
          ))}
        </div>
      )}

      {/* Best time */}
      {summary.bestTimeToVisit && (
        <div className="flex items-center gap-2 text-xs text-[var(--vb-text-secondary)]">
          <Clock size={14} />
          <span>Best time: {summary.bestTimeToVisit}</span>
        </div>
      )}
    </div>
  );
}
