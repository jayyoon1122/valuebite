'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { SEED_POSTS } from '@/lib/seed-data';
import { MessageSquare, TrendingUp, Plus } from 'lucide-react';

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  tip: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Tip' },
  deal: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Deal' },
  discussion: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Discussion' },
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Tips', 'Deals', 'Discussions'];

  const filtered = activeTab === 'All'
    ? SEED_POSTS
    : SEED_POSTS.filter((p) => p.type === activeTab.toLowerCase().replace('s', ''));

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Community</h1>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-[var(--vb-primary)] text-white rounded-full text-sm font-semibold">
            <Plus size={16} /> Post
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeTab === tab
                  ? 'bg-[var(--vb-primary)] text-white'
                  : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {filtered.map((post) => {
          const style = typeStyles[post.type];
          return (
            <div key={post.id} className="bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
                <span className="text-xs text-[var(--vb-text-secondary)]">{post.user}</span>
                {post.userLevel >= 3 && <span className="text-xs text-purple-500">Expert</span>}
                <span className="text-xs text-[var(--vb-text-secondary)]">{post.time}</span>
              </div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-[var(--vb-text-secondary)] mt-1 line-clamp-3">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[var(--vb-text-secondary)]">
                <button className="flex items-center gap-1 hover:text-[var(--vb-primary)]">
                  <TrendingUp size={16} /> {post.upvotes}
                </button>
                <button className="flex items-center gap-1 hover:text-[var(--vb-primary)]">
                  <MessageSquare size={16} /> {post.comments}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
