import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId') || 'tokyo';
  const purpose = searchParams.get('purpose');
  const q = searchParams.get('q');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'API is live. Use /api/restaurants/nearby for location-based queries.',
    params: { cityId, purpose, q },
  });
}
