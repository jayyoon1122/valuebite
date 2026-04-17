'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { getDisplayName } from '@/lib/user-profile';
import { MessageSquare, TrendingUp, Plus, X, Send, ArrowUp, Loader2, Share2, Check, Flag } from 'lucide-react';

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  tip: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Tip' },
  deal: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Deal' },
  discussion: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Discussion' },
};

interface Post {
  id: string;
  post_type: string;
  title: string;
  content: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
}

function parseAuthor(content: string): { author: string; body: string } {
  const match = content.match(/^\[author:(.+?)\]\n/);
  if (match) return { author: match[1], body: content.replace(match[0], '') };
  return { author: 'Anonymous', body: content };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postType, setPostType] = useState('tip');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; content: string; author_name: string; created_at: string }>>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const fingerprintRef = useRef<string>('');

  const tabs = ['All', 'Tips', 'Deals', 'Discussions'];

  // Load fingerprint and upvoted posts on mount
  useEffect(() => {
    getDeviceFingerprint().then(fp => {
      fingerprintRef.current = fp;
      fetch(`/api/community/upvotes?fingerprint=${fp}`)
        .then(r => r.json())
        .then(d => { if (d.success) setUpvoted(new Set(d.data)); })
        .catch(() => {});
    });
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const typeParam = activeTab === 'All' ? '' : `&type=${activeTab.toLowerCase().replace(/s$/, '')}`;
      const res = await fetch(`/api/community/posts?limit=50${typeParam}`);
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch {}
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Load comments when a post is selected
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
      setCommentsLoading(true);
      fetch(`/api/community/comments?post_id=${selectedPost.id}`)
        .then(r => r.json())
        .then(d => { if (d.success) setComments(d.data); })
        .catch(() => {})
        .finally(() => setCommentsLoading(false));
    } else {
      document.body.style.overflow = '';
      setComments([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  const toggleUpvote = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasUpvoted = upvoted.has(postId);
    // Optimistic update
    setUpvoted(prev => {
      const next = new Set(prev);
      if (wasUpvoted) next.delete(postId); else next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, upvotes: p.upvotes + (wasUpvoted ? -1 : 1) } : p
    ));
    try {
      await fetch('/api/community/upvotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, fingerprint: fingerprintRef.current }),
      });
    } catch {}
  };

  const addComment = async () => {
    if (!commentText.trim() || !selectedPost) return;
    const text = commentText;
    setCommentText('');
    const optimistic = { id: 'temp', content: text, author_name: getDisplayName(), created_at: new Date().toISOString() };
    setComments(prev => [...prev, optimistic]);
    try {
      await fetch('/api/community/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: selectedPost.id,
          content: text,
          author_name: getDisplayName(),
          fingerprint: fingerprintRef.current,
        }),
      });
      // Refresh comments from server
      const res = await fetch(`/api/community/comments?post_id=${selectedPost.id}`);
      const data = await res.json();
      if (data.success) setComments(data.data);
      // Update comment count in post list
      setPosts(prev => prev.map(p =>
        p.id === selectedPost.id ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p
      ));
    } catch {}
  };

  const [shareConfirm, setShareConfirm] = useState(false);
  const [reportConfirm, setReportConfirm] = useState(false);
  const [publishError, setPublishError] = useState('');

  const handleReport = (post: Post) => {
    if (!confirm(`Report this post for review?\n\n"${post.title}"\n\nReports go to our moderation team. Spam, harassment, and off-topic content will be removed.`)) return;
    // Send report via mailto (no backend endpoint needed for v1)
    const body = encodeURIComponent(`Reporting community post:\n\nTitle: ${post.title}\nID: ${post.id}\nType: ${post.post_type}\nReported at: ${new Date().toISOString()}\n\nReason: [user can describe here]`);
    window.location.href = `mailto:economistview123@gmail.com?subject=ValueBite%20-%20Report%20Community%20Post&body=${body}`;
    setReportConfirm(true);
    setTimeout(() => setReportConfirm(false), 3000);
  };

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/community?post=${post.id}`;
    const shareData = { title: post.title, text: `Check out this post on ValueBite: ${post.title}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareConfirm(true);
      setTimeout(() => setShareConfirm(false), 2000);
    }
  };

  const handlePublish = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    setPublishError('');
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_type: postType,
          title: postTitle,
          content: postContent,
          author_name: getDisplayName(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPostSubmitted(true);
        fetchPosts();
      } else {
        setPublishError(data.error || 'Failed to publish. Please try again.');
      }
    } catch {
      setPublishError('Network error. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Community</h1>
          <button
            onClick={() => { setShowPostForm(true); setPostSubmitted(false); setPostTitle(''); setPostContent(''); }}
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
                <p className="text-sm text-[var(--vb-text-secondary)] mt-1">Thank you for contributing!</p>
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
                <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Share your tip, deal, or discussion..." rows={4} className="w-full px-3 py-2 rounded-lg bg-[var(--vb-bg-secondary)] border border-[var(--vb-border)] text-sm resize-none" />
                {publishError && <p className="text-sm text-red-500">{publishError}</p>}
                <button onClick={handlePublish} disabled={!postTitle.trim() || !postContent.trim()} className="w-full py-3 rounded-xl bg-[var(--vb-primary)] text-white font-semibold disabled:opacity-50"><Send size={16} className="inline mr-2" />Publish</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post detail modal */}
      {selectedPost && (() => {
        const { author, body } = parseAuthor(selectedPost.content);
        return (
          <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setSelectedPost(null)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-[var(--vb-bg)] rounded-t-2xl max-h-[90vh] flex flex-col sm:relative sm:top-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:mx-auto sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--vb-border)] shrink-0">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeStyles[selectedPost.post_type]?.bg} ${typeStyles[selectedPost.post_type]?.text}`}>
                  {typeStyles[selectedPost.post_type]?.label}
                </span>
                <button onClick={() => setSelectedPost(null)} className="p-1"><X size={20} /></button>
              </div>
              <div className="overflow-y-auto flex-1 overscroll-contain touch-pan-y">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--vb-primary)] flex items-center justify-center text-white text-xs font-bold">{author.charAt(0)}</div>
                    <div>
                      <span className="text-sm font-medium">{author}</span>
                      <p className="text-xs text-[var(--vb-text-secondary)]">{timeAgo(selectedPost.created_at)}</p>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-3">{selectedPost.title}</h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--vb-border)] text-sm">
                    <button
                      onClick={(e) => toggleUpvote(selectedPost.id, e)}
                      className={`flex items-center gap-1.5 transition ${upvoted.has(selectedPost.id) ? 'text-[var(--vb-primary)] font-semibold' : 'text-[var(--vb-text-secondary)]'}`}
                    >
                      <ArrowUp size={18} />
                      {selectedPost.upvotes}
                    </button>
                    <span className="flex items-center gap-1.5 text-[var(--vb-text-secondary)]">
                      <MessageSquare size={18} /> {comments.length}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(selectedPost); }}
                      className="flex items-center gap-1.5 text-[var(--vb-text-secondary)] hover:text-[var(--vb-primary)] transition ml-auto"
                    >
                      {shareConfirm ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                      <span className="text-xs">{shareConfirm ? 'Copied!' : 'Share'}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReport(selectedPost); }}
                      className="flex items-center gap-1.5 text-[var(--vb-text-secondary)] hover:text-red-500 transition"
                      title="Report this post"
                    >
                      <Flag size={16} />
                      <span className="text-xs">{reportConfirm ? 'Reported' : 'Report'}</span>
                    </button>
                  </div>
                  {commentsLoading ? (
                    <div className="mt-4 flex justify-center"><Loader2 size={20} className="animate-spin text-[var(--vb-text-secondary)]" /></div>
                  ) : comments.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {comments.map((c, i) => (
                        <div key={c.id || i} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-[var(--vb-bg-secondary)] flex items-center justify-center text-xs font-bold shrink-0">{c.author_name.charAt(0)}</div>
                          <div>
                            <span className="text-xs font-medium">{c.author_name}</span>
                            <span className="text-xs text-[var(--vb-text-secondary)] ml-2">{timeAgo(c.created_at)}</span>
                            <p className="text-sm mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
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
        );
      })()}

      {/* Post list */}
      <div className="px-4 py-4 space-y-3 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-[var(--vb-text-secondary)] animate-pulse">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto mb-3 text-[var(--vb-text-secondary)] opacity-30" />
            <p className="font-semibold">No posts yet</p>
            <p className="text-sm text-[var(--vb-text-secondary)] mt-1">Be the first to share a tip or deal!</p>
          </div>
        ) : (
          posts.map((post) => {
            const style = typeStyles[post.post_type] || typeStyles.tip;
            const { author } = parseAuthor(post.content);
            const isUpvoted = upvoted.has(post.id);
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-[var(--vb-bg)] border border-[var(--vb-border)] rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
                  <span className="text-xs text-[var(--vb-text-secondary)]">{author}</span>
                  <span className="text-xs text-[var(--vb-text-secondary)]">{timeAgo(post.created_at)}</span>
                </div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-[var(--vb-text-secondary)] mt-1 line-clamp-3">{parseAuthor(post.content).body}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <button
                    onClick={(e) => toggleUpvote(post.id, e)}
                    className={`flex items-center gap-1 transition ${isUpvoted ? 'text-[var(--vb-primary)] font-semibold' : 'text-[var(--vb-text-secondary)]'}`}
                  >
                    <ArrowUp size={16} /> {post.upvotes}
                  </button>
                  <span className="flex items-center gap-1 text-[var(--vb-text-secondary)]">
                    <MessageSquare size={16} /> {post.comment_count || 0}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
