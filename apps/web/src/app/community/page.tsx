'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { SEED_POSTS } from '@/lib/seed-data';
import { MessageSquare, TrendingUp, Plus, X, Send, ArrowUp } from 'lucide-react';

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  tip: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Tip' },
  deal: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Deal' },
  discussion: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Discussion' },
};

// Mock comments per post (vary by post)
const MOCK_COMMENTS: Record<string, Array<{ user: string; text: string; time: string }>> = {
  p1: [{ user: 'SobaFan', text: 'Fuji Soba is my go-to!', time: '1h ago' }],
  p2: [{ user: 'PastaLover', text: 'Just tried it, amazing deal!', time: '3h ago' }],
  p3: [{ user: 'RamenFan', text: 'Hidakaya is underrated honestly', time: '4h ago' }, { user: 'TokyoLocal', text: 'Ichiran has the vibe though', time: '2h ago' }],
  p4: [],
  p5: [{ user: 'CouponUser', text: 'Worked for me, thanks!', time: '8h ago' }],
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const [postType, setPostType] = useState('tip');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Record<string, Array<{ user: string; text: string; time: string }>>>({});
  const tabs = ['All', 'Tips', 'Deals', 'Discussions'];

  const filtered = activeTab === 'All'
    ? SEED_POSTS
    : SEED_POSTS.filter((p) => p.type === activeTab.toLowerCase().replace('s', ''));

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  const toggleUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvoted(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const getComments = (postId: string) => {
    const mock = MOCK_COMMENTS[postId] || [];
    const local = localComments[postId] || [];
    return [...mock, ...local];
  };

  const addComment = () => {
    if (!commentText.trim() || !selectedPost) return;
    setLocalComments(prev => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] || []), { user: 'You', text: commentText, time: 'Just now' }],
    }));
    setCommentText('');
  };

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

      {/* New Post form */}
      {showPostForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--vb-bg)] w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)]">
              <h2 className="font-semibold text-lg">New Post</h2>
              <button onClick={() => setShowPostForm(false)} className="p-1"><X size={20} /></button>
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
                <div className="flex gap-2">
                  {[{ key: 'tip', label: 'Tip' }, { key: 'deal', label: 'Deal' }, { key: 'discussion', label: 'Discussion' }].map((t) => (
                    <button key={t.key} onClick={() => setPostType(t.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium ${postType === t.key ? 'bg-[var(--vb-primary)] text-white' : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)]'}`}>{t.label}</button>
                  ))}
                </div>
                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2.5 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm" />
                <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Details..." rows={4} className="w-full px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm resize-none" />
                <button onClick={() => setPostSubmitted(true)} disabled={!postTitle.trim()} className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold disabled:opacity-50"><Send size={16} className="inline mr-2" />Publish</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post detail modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setSelectedPost(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--vb-bg)] rounded-t-2xl max-h-[90vh] flex flex-col sm:relative sm:top-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:mx-auto sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)] shrink-0">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeStyles[selectedPost.type]?.bg} ${typeStyles[selectedPost.type]?.text}`}>
                {typeStyles[selectedPost.type]?.label}
              </span>
              <button onClick={() => setSelectedPost(null)} className="p-1"><X size={20} /></button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 overscroll-contain touch-pan-y">
              <div className="p-4">
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--vb-primary)] flex items-center justify-center text-white text-xs font-bold">{selectedPost.user?.charAt(0)}</div>
                  <div>
                    <span className="text-sm font-medium">{selectedPost.user}</span>
                    {selectedPost.userLevel >= 3 && <span className="ml-1 text-xs text-purple-500">Expert</span>}
                    <p className="text-xs text-[var(--vb-text-secondary)]">{selectedPost.time}</p>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-lg font-bold mb-3">{selectedPost.title}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>

                {/* Upvote + Comment count */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--vb-border)] text-sm">
                  <button
                    onClick={() => toggleUpvote(selectedPost.id, { stopPropagation: () => {} } as any)}
                    className={`flex items-center gap-1.5 transition ${upvoted.has(selectedPost.id) ? 'text-[var(--vb-primary)] font-semibold' : 'text-[var(--vb-text-secondary)]'}`}
                  >
                    <ArrowUp size={18} className={upvoted.has(selectedPost.id) ? 'fill-current' : ''} />
                    {selectedPost.upvotes + (upvoted.has(selectedPost.id) ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1.5 text-[var(--vb-text-secondary)]">
                    <MessageSquare size={18} /> {getComments(selectedPost.id).length}
                  </span>
                </div>

                {/* Comments */}
                {getComments(selectedPost.id).length > 0 && (
                  <div className="mt-4 space-y-3">
                    {getComments(selectedPost.id).map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--vb-bg-secondary)] flex items-center justify-center text-xs font-bold shrink-0">{c.user.charAt(0)}</div>
                        <div>
                          <span className="text-xs font-medium">{c.user}</span>
                          <span className="text-xs text-[var(--vb-text-secondary)] ml-2">{c.time}</span>
                          <p className="text-sm mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment input — sticky at bottom */}
            <div className="p-3 border-t border-[var(--vb-border)] shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)]"
                />
                <button onClick={addComment} disabled={!commentText.trim()} className="px-4 py-2 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-semibold disabled:opacity-50">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post list */}
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {filtered.map((post) => {
          const style = typeStyles[post.type];
          const isUpvoted = upvoted.has(post.id);
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
              <div className="flex items-center gap-4 mt-3 text-sm">
                <button
                  onClick={(e) => toggleUpvote(post.id, e)}
                  className={`flex items-center gap-1 transition ${isUpvoted ? 'text-[var(--vb-primary)] font-semibold' : 'text-[var(--vb-text-secondary)]'}`}
                >
                  <ArrowUp size={16} /> {post.upvotes + (isUpvoted ? 1 : 0)}
                </button>
                <span className="flex items-center gap-1 text-[var(--vb-text-secondary)]">
                  <MessageSquare size={16} /> {getComments(post.id).length}
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
