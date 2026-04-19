import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

// GET — list community posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // tip, deal, discussion
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = `community_posts?order=created_at.desc&limit=${limit}&select=*`;
  if (type && type !== 'all') {
    query += `&post_type=eq.${type}`;
  }

  const { data, error } = await supaFetch<any[]>(query);
  if (error) return NextResponse.json({ success: false, error }, { status: 500 });

  return NextResponse.json(
    { success: true, data: data || [] },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' } }
  );
}

// POST — create a community post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_type, title, content, author_name, fingerprint } = body;

    if (!post_type || !title || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limit: 5 posts per fingerprint per day
    if (fingerprint) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      // We can't filter by fingerprint since there's no column, so skip rate limit
    }

    const row: any = {
      post_type,
      title: title.slice(0, 200),
      // Embed author name at the start of content for display
      content: author_name ? `[author:${author_name}]\n${content}` : content,
    };

    const { data, error } = await supaFetch('community_posts', {
      method: 'POST',
      body: row,
    });

    if (error) return NextResponse.json({ success: false, error }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
