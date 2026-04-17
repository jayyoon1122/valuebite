'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, ChevronLeft, ChevronRight, LogIn, Shield } from 'lucide-react';

type Status = 'pending' | 'approved' | 'rejected';

interface Suggestion {
  id: string;
  restaurant_id: string;
  menu_item_id: string | null;
  suggestion_type: 'price_update' | 'new_item' | 'remove_item';
  current_price: number | null;
  suggested_price: number | null;
  suggested_name: { en?: string; original?: string } | null;
  suggested_category: string | null;
  suggested_currency: string | null;
  removal_reason: string | null;
  submitter_note: string | null;
  status: Status;
  admin_note: string | null;
  created_at: string;
  restaurants?: { id: string; name: any; price_currency: string };
  menu_items?: { id: string; name: any; price: number; category: string };
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<Status>('pending');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [actionNote, setActionNote] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const authHeader = { 'Authorization': `Bearer ${secret}` };

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/suggestions?status=${tab}&offset=${page * 20}&limit=20`, {
        headers: authHeader,
      });
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data);
        setCounts(data.counts);
      }
    } catch {}
    setLoading(false);
  }, [tab, page, secret]);

  useEffect(() => {
    if (authed) fetchSuggestions();
  }, [authed, fetchSuggestions]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/admin/suggestions?status=pending&limit=1', {
      headers: { 'Authorization': `Bearer ${secret}` },
    });
    const data = await res.json();
    if (data.success) {
      setAuthed(true);
      sessionStorage.setItem('vb-admin', secret);
    } else {
      setAuthError('Invalid admin key');
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('vb-admin');
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, admin_note: actionNote[id] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSuggestions();
      }
    } catch {}
    setProcessing(null);
  }

  function getRestaurantName(s: Suggestion): string {
    const n = s.restaurants?.name;
    if (!n) return 'Unknown';
    return typeof n === 'string' ? n : n.en || n.original || 'Unknown';
  }

  function getMenuItemName(s: Suggestion): string {
    const n = s.menu_items?.name;
    if (!n) return '—';
    return typeof n === 'string' ? n : n.en || n.original || '—';
  }

  function getCurrencySymbol(c: string | null | undefined): string {
    return { JPY: '\u00a5', USD: '$', GBP: '\u00a3', EUR: '\u20ac', SGD: 'S$', HKD: 'HK$' }[c || ''] || '$';
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm space-y-4 border border-gray-800">
          <div className="flex items-center gap-2 justify-center">
            <Shield size={20} className="text-blue-400" />
            <h1 className="text-lg font-bold text-white">ValueBite Admin</h1>
          </div>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Admin key"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          {authError && <p className="text-xs text-red-400">{authError}</p>}
          <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 flex items-center justify-center gap-2">
            <LogIn size={15} /> Sign In
          </button>
        </form>
      </div>
    );
  }

  const tabConfig: { key: Status; label: string }[] = [
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'approved', label: `Approved (${counts.approved})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-blue-400" />
          <h1 className="font-bold">Price Suggestions</h1>
        </div>
        <button
          onClick={() => { setAuthed(false); setSecret(''); sessionStorage.removeItem('vb-admin'); }}
          className="text-xs text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabConfig.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setPage(0); }}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === key ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-12 animate-pulse">Loading...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No {tab} suggestions</div>
        ) : (
          suggestions.map(s => {
            const sym = getCurrencySymbol(s.suggested_currency || s.restaurants?.price_currency);
            return (
              <div key={s.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                {/* Suggestion header */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{getRestaurantName(s)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      s.suggestion_type === 'price_update' ? 'bg-blue-500/20 text-blue-400' :
                      s.suggestion_type === 'new_item' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {s.suggestion_type === 'price_update' ? 'Price Update' :
                       s.suggestion_type === 'new_item' ? 'New Item' : 'Remove Item'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">{new Date(s.created_at).toLocaleString()}</span>
                </div>

                {/* Suggestion details */}
                <div className="px-4 py-3 space-y-2 text-sm">
                  {s.suggestion_type === 'price_update' && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{getMenuItemName(s)}</span>
                      <span className="text-gray-500 line-through">{sym}{s.current_price ?? s.menu_items?.price}</span>
                      <span className="text-gray-400">&rarr;</span>
                      <span className="font-bold text-green-400">{sym}{s.suggested_price}</span>
                    </div>
                  )}
                  {s.suggestion_type === 'new_item' && (
                    <div>
                      <span className="text-gray-300">{s.suggested_name?.en || '?'}</span>
                      {s.suggested_name?.original && s.suggested_name.original !== s.suggested_name.en && (
                        <span className="text-gray-500 ml-2 text-xs">{s.suggested_name.original}</span>
                      )}
                      <span className="ml-3 font-bold text-green-400">{sym}{s.suggested_price}</span>
                      <span className="ml-2 text-xs text-gray-500 capitalize">{s.suggested_category}</span>
                    </div>
                  )}
                  {s.suggestion_type === 'remove_item' && (
                    <div>
                      <span className="text-gray-300">{getMenuItemName(s)}</span>
                      <span className="ml-3 text-xs text-red-400">{s.removal_reason}</span>
                    </div>
                  )}
                  {s.submitter_note && (
                    <p className="text-xs text-gray-500 italic">&ldquo;{s.submitter_note}&rdquo;</p>
                  )}
                </div>

                {/* Actions (pending only) */}
                {s.status === 'pending' && (
                  <div className="px-4 py-3 border-t border-gray-800 space-y-2">
                    <input
                      type="text"
                      placeholder="Admin note (optional)"
                      value={actionNote[s.id] || ''}
                      onChange={e => setActionNote(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(s.id, 'approve')}
                        disabled={processing === s.id}
                        className="flex-1 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-500 flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(s.id, 'reject')}
                        disabled={processing === s.id}
                        className="flex-1 py-2 rounded-lg bg-red-600/80 text-white text-xs font-semibold hover:bg-red-500 flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviewed info */}
                {s.status !== 'pending' && s.admin_note && (
                  <div className="px-4 py-2 border-t border-gray-800">
                    <p className="text-xs text-gray-500">Admin: {s.admin_note}</p>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {suggestions.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-xs text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-gray-500">Page {page + 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={suggestions.length < 20}
              className="text-xs text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
