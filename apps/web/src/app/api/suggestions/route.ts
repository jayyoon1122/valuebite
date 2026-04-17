import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

// POST — submit a price suggestion (public, no auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurant_id, menu_item_id, suggestion_type,
      current_price, suggested_price, suggested_name,
      suggested_category, suggested_currency, removal_reason,
      submitter_fingerprint, submitter_note,
    } = body;

    // Validate required fields
    if (!restaurant_id || !suggestion_type || !submitter_fingerprint) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!['price_update', 'new_item', 'remove_item', 'quick_rating'].includes(suggestion_type)) {
      return NextResponse.json({ success: false, error: 'Invalid suggestion type' }, { status: 400 });
    }
    if (suggestion_type === 'price_update' && (!menu_item_id || !suggested_price)) {
      return NextResponse.json({ success: false, error: 'Price update requires menu_item_id and suggested_price' }, { status: 400 });
    }
    if (suggestion_type === 'new_item' && (!suggested_name || !suggested_price)) {
      return NextResponse.json({ success: false, error: 'New item requires name and price' }, { status: 400 });
    }

    // Rate limit: max 10 suggestions per fingerprint per 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supaFetch<any[]>(
      `menu_suggestions?submitter_fingerprint=eq.${submitter_fingerprint}&created_at=gte.${since}&select=id`
    );
    if (recent && recent.length >= 10) {
      return NextResponse.json({ success: false, error: 'Rate limit: max 10 suggestions per day' }, { status: 429 });
    }

    // Insert suggestion
    const row: any = {
      restaurant_id,
      suggestion_type,
      submitter_fingerprint,
    };
    if (menu_item_id) row.menu_item_id = menu_item_id;
    if (current_price != null) row.current_price = current_price;
    if (suggested_price != null) row.suggested_price = suggested_price;
    if (suggested_name) row.suggested_name = suggested_name;
    if (suggested_category) row.suggested_category = suggested_category;
    if (suggested_currency) row.suggested_currency = suggested_currency;
    if (removal_reason) row.removal_reason = removal_reason;
    if (submitter_note) row.submitter_note = submitter_note;

    const { data, error } = await supaFetch('menu_suggestions', {
      method: 'POST',
      body: row,
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET — get suggestions for a restaurant (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurant_id');

  if (!restaurantId) {
    return NextResponse.json({ success: false, error: 'restaurant_id required' }, { status: 400 });
  }

  const { data, error } = await supaFetch<any[]>(
    `menu_suggestions?restaurant_id=eq.${restaurantId}&order=created_at.desc&limit=50`
  );

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data || [] });
}
