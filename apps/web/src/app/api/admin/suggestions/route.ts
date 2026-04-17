import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

function checkAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${ADMIN_SECRET}` && ADMIN_SECRET.length > 0;
}

// GET — list suggestions with filtering (admin only)
export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '50');

  // Build query — join restaurant name for context
  let query = `menu_suggestions?status=eq.${status}&order=created_at.desc&offset=${offset}&limit=${limit}&select=*,restaurants(id,name,price_currency),menu_items(id,name,price,category)`;

  const { data, error } = await supaFetch<any[]>(query);

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  // Get counts per status
  const [pending, approved, rejected] = await Promise.all(
    ['pending', 'approved', 'rejected'].map(async (s) => {
      const { data } = await supaFetch<any[]>(`menu_suggestions?status=eq.${s}&select=id`, { headers: { 'Prefer': 'count=exact' } });
      return data?.length || 0;
    })
  );

  return NextResponse.json({
    success: true,
    data: data || [],
    counts: { pending, approved, rejected },
  });
}
