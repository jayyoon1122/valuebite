import { NextRequest, NextResponse } from 'next/server';
import { supaFetch } from '@/lib/supabase';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

function checkAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${ADMIN_SECRET}` && ADMIN_SECRET.length > 0;
}

// PATCH — approve or reject a suggestion (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action, admin_note } = body; // action: 'approve' | 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  }

  // Get the suggestion first
  const { data: suggestions } = await supaFetch<any[]>(
    `menu_suggestions?id=eq.${id}&select=*`
  );
  if (!suggestions || suggestions.length === 0) {
    return NextResponse.json({ success: false, error: 'Suggestion not found' }, { status: 404 });
  }
  const suggestion = suggestions[0];

  if (suggestion.status !== 'pending') {
    return NextResponse.json({ success: false, error: 'Already reviewed' }, { status: 400 });
  }

  // If approving, apply the change to menu_items
  if (action === 'approve') {
    const applyError = await applySuggestion(suggestion);
    if (applyError) {
      return NextResponse.json({ success: false, error: applyError }, { status: 500 });
    }
  }

  // Update suggestion status
  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  const { error } = await supaFetch(
    `menu_suggestions?id=eq.${id}`,
    {
      method: 'PATCH',
      body: {
        status: newStatus,
        admin_note: admin_note || null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  );

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: newStatus });
}

async function applySuggestion(s: any): Promise<string | null> {
  try {
    switch (s.suggestion_type) {
      case 'price_update': {
        if (!s.menu_item_id || s.suggested_price == null) return 'Missing data for price update';
        const { error } = await supaFetch(
          `menu_items?id=eq.${s.menu_item_id}`,
          { method: 'PATCH', body: { price: s.suggested_price } }
        );
        if (error) return error;

        // Also update restaurant avg_meal_price
        await recalcAvgPrice(s.restaurant_id);
        break;
      }
      case 'new_item': {
        const { error } = await supaFetch('menu_items', {
          method: 'POST',
          body: {
            restaurant_id: s.restaurant_id,
            name: s.suggested_name || { en: 'Unknown' },
            price: s.suggested_price,
            currency: s.suggested_currency || 'USD',
            category: s.suggested_category || 'main',
            source: 'user_suggestion',
          },
        });
        if (error) return error;
        await recalcAvgPrice(s.restaurant_id);
        break;
      }
      case 'remove_item': {
        if (!s.menu_item_id) return 'Missing menu_item_id for removal';
        const { error } = await supaFetch(
          `menu_items?id=eq.${s.menu_item_id}`,
          { method: 'DELETE' }
        );
        if (error) return error;
        await recalcAvgPrice(s.restaurant_id);
        break;
      }
    }
    return null;
  } catch (err: any) {
    return err.message;
  }
}

async function recalcAvgPrice(restaurantId: string) {
  const { data: items } = await supaFetch<any[]>(
    `menu_items?restaurant_id=eq.${restaurantId}&select=price,category`
  );
  if (!items || items.length === 0) return;

  const mealItems = items.filter(i => ['main', 'set_meal', 'combo'].includes(i.category));
  const prices = (mealItems.length >= 3 ? mealItems : items)
    .map(i => parseFloat(i.price)).filter(p => p > 0).sort((a, b) => a - b);
  if (prices.length === 0) return;

  const mid = Math.floor(prices.length / 2);
  const median = prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

  await supaFetch(`restaurants?id=eq.${restaurantId}`, {
    method: 'PATCH',
    body: { avg_meal_price: median },
  });
}
