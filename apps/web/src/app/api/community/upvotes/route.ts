import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

// POST — toggle upvote (add or remove)
export async function POST(request: NextRequest) {
  try {
    const { post_id, fingerprint } = await request.json();
    if (!post_id || !fingerprint) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // Check if already upvoted
    const { data: existing } = await supaFetch<any[]>(
      `community_upvotes?post_id=eq.${post_id}&fingerprint=eq.${fingerprint}&select=id`
    );

    if (existing && existing.length > 0) {
      // Remove upvote
      await supaFetch(`community_upvotes?id=eq.${existing[0].id}`, { method: 'DELETE' });
      // Decrement
      const { data: post } = await supaFetch<any[]>(`community_posts?id=eq.${post_id}&select=upvotes`);
      if (post?.[0]) {
        await supaFetch(`community_posts?id=eq.${post_id}`, {
          method: 'PATCH',
          body: { upvotes: Math.max(0, (post[0].upvotes || 0) - 1) },
        });
      }
      return NextResponse.json({ success: true, upvoted: false });
    } else {
      // Add upvote
      await supaFetch('community_upvotes', {
        method: 'POST',
        body: { post_id, fingerprint },
      });
      // Increment
      const { data: post } = await supaFetch<any[]>(`community_posts?id=eq.${post_id}&select=upvotes`);
      if (post?.[0]) {
        await supaFetch(`community_posts?id=eq.${post_id}`, {
          method: 'PATCH',
          body: { upvotes: (post[0].upvotes || 0) + 1 },
        });
      }
      return NextResponse.json({ success: true, upvoted: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET — check upvote status for a fingerprint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fingerprint = searchParams.get('fingerprint');
  if (!fingerprint) return NextResponse.json({ success: true, data: [] });

  const { data } = await supaFetch<any[]>(
    `community_upvotes?fingerprint=eq.${fingerprint}&select=post_id`
  );

  return NextResponse.json({ success: true, data: (data || []).map(d => d.post_id) });
}
