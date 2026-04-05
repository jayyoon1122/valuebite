'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { SEED_POSTS } from '@/lib/seed-data';
import { MessageSquare, TrendingUp, Plus, X, Send } from 'lucide-react';

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  tip: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Tip' },
  deal: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Deal' },
  discussion: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Discussion' },
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const [postType, setPostType] = useState('tip');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const tabs = ['All', 'Tips', 'Deals', 'Discussions'];

  const filtered = activeTab === 'All'
    ? SEED_POSTS
    : SEED_POSTS.filter((p) => p.type === activeTab.toLowerCase().replace('s', ''));

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Community</h1>
          <button
            onClick={() => { setShowPostForm(true); setPostSubmitted(false); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--vb-primary)] text-white rounded-full text-sm font-semibold"
          >
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

      {/* Post creation form */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--vb-bg)] w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)]">
              <h2 className="font-semibold text-lg">New Post</h2>
              <button onClick={() => setShowPostForm(false)} className="p-1 hover:bg-[var(--vb-bg-secondary)] rounded-lg"><X size={20} /></button>
            </div>
            {postSubmitted ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-3">🎉</p>
                <p className="font-semibold text-lg">Post Published!</p>
                <p className="text-sm text-[var(--vb-text-secondary)] mt-1">+10 contribution points earned</p>
                <button onClick={() => setShowPostForm(false)} className="mt-4 px-6 py-2 bg-[var(--vb-primary)] text-white rounded-full text-sm font-semibold">Done</button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Post Type</label>
                  <div className="flex gap-2">
                    {[{ key: 'tip', label: 'Tip', color: 'blue' }, { key: 'deal', label: 'Deal', color: 'green' }, { key: 'discussion', label: 'Discussion', color: 'purple' }].map((t) => (
                      <button key={t.key} onClick={() => setPostType(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${postType === t.key ? `bg-${t.color}-500 text-white` : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)]'}`}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Title</label>
                  <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="What's your tip, deal, or question?" className="w-full px-3 py-2.5 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Details</label>
                  <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Share the details..." rows={4} className="w-full px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]" />
                </div>
                <button onClick={() => setPostSubmitted(true)} disabled={!postTitle.trim()} className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"><Send size={16} /> Publish Post</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post detail modal — fixed overlay that prevents background scroll */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 overflow-hidden"
          onClick={() => setSelectedPost(null)}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--vb-bg)] rounded-t-2xl sm:rounded-2xl sm:relative sm:top-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:mx-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)] shrink-0">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeStyles[selectedPost.type]?.bg} ${typeStyles[selectedPost.type]?.text}`}>
                {typeStyles[selectedPost.type]?.label}
              </span>
              <button onClick={() => setSelectedPost(null)} className="p-1"><X size={20} /></button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--vb-primary)] flex items-center justify-center text-white text-xs font-bold">{selectedPost.user?.charAt(0)}</div>
                  <div>
                    <span className="text-sm font-medium">{selectedPost.user}</span>
                    {selectedPost.userLevel >= 3 && <span className="ml-1 text-xs text-purple-500">Expert</span>}
                    <p className="text-xs text-[var(--vb-text-secondary)]">{selectedPost.time}</p>
                  </div>
                </div>
                <h2 className="text-lg font-bold mb-3">{selectedPost.title}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[var(--vb-border)] text-sm">
                  <button className="flex items-center gap-1.5 text-[var(--vb-text-secondary)] hover:text-[var(--vb-primary)]">
                    <TrendingUp size={18} /> {selectedPost.upvotes}
                  </button>
                  <button className="flex items-center gap-1.5 text-[var(--vb-text-secondary)] hover:text-[var(--vb-primary)]">
                    <MessageSquare size={18} /> {selectedPost.comments}
                  </button>
                </div>
                {/* Just 1 comment — feels natural for a new app */}
                {selectedPost.comments > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--vb-bg-secondary)] flex items-center justify-center text-xs font-bold shrink-0">V</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">ValueBiter</span>
                          <span className="text-xs text-[var(--vb-text-secondary)]">2h ago</span>
                        </div>
                        <p className="text-sm">Thanks for sharing! 👍</p>
                      </div>
                    </div>
                    {selectedPost.comments > 5 && (
                      <p className="text-xs text-[var(--vb-text-secondary)] text-center">View all {selectedPost.comments} comments</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Sticky comment input */}
            <div className="p-3 border-t border-[var(--vb-border)] shrink-0">
              <div className="flex gap-2">
                <input type="text" placeholder="Add a comment..." className="flex-1 px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm" />
                <button className="px-4 py-2 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-semibold">Post</button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {filtered.map((post) => {
          const style = typeStyles[post.type];
          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
                <span className="text-xs text-[var(--vb-text-secondary)]">{post.user}</span>
                {post.userLevel >= 3 && <span className="text-xs text-purple-500">Expert</span>}
                <span className="text-xs text-[var(--vb-text-secondary)]">{post.time}</span>
              </div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-[var(--vb-text-secondary)] mt-1 line-clamp-3">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[var(--vb-text-secondary)]">
                <span className="flex items-center gap-1">
                  <TrendingUp size={16} /> {post.upvotes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} /> {post.comments}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
