import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

// GET — list comments for a post
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const postId = new URL(request.url).searchParams.get('post_id');
  if (!postId) return NextResponse.json({ success: false, error: 'post_id required' }, { status: 400 });
  if (!UUID_RE.test(postId)) return NextResponse.json({ success: true, data: [] });

  const { data, error } = await supaFetch<any[]>(
    `community_comments?post_id=eq.${postId}&order=created_at.asc&select=id,content,author_name,created_at`
  );

  if (error) return NextResponse.json({ success: false, error: 'Failed to load comments' }, { status: 500 });
  return NextResponse.json({ success: true, data: data || [] });
}

// POST — add a comment
export async function POST(request: NextRequest) {
  try {
    const { post_id, content, author_name, fingerprint } = await request.json();
    if (!post_id || !content?.trim() || !fingerprint) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const { data, error } = await supaFetch('community_comments', {
      method: 'POST',
      body: {
        post_id,
        content: content.trim().slice(0, 1000),
        author_name: (author_name || 'Anonymous').slice(0, 50),
        author_fingerprint: fingerprint,
      },
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 500 });

    // Increment comment_count on the post
    const { data: post } = await supaFetch<any[]>(`community_posts?id=eq.${post_id}&select=comment_count`);
    if (post?.[0]) {
      await supaFetch(`community_posts?id=eq.${post_id}`, {
        method: 'PATCH',
        body: { comment_count: (post[0].comment_count || 0) + 1 },
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
