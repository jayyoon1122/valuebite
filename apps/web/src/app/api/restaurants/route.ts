import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/restaurants — List restaurants
 *
 * In production, this queries Supabase.
 * For now, returns a success response to verify the API works.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId') || 'tokyo';
  const purpose = searchParams.get('purpose');
  const q = searchParams.get('q');

  // TODO: Connect to Supabase when database is seeded
  // For now, return API status
  return NextResponse.json({
    success: true,
    message: 'API is live. Restaurant data currently served from frontend seed data.',
    params: { cityId, purpose, q },
    note: 'Connect Google Places API to populate database with real restaurant data.',
  });
}
