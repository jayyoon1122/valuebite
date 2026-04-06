import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

/**
 * POST /api/menu-analyze
 * Analyzes a menu photo using Claude Vision API and extracts menu items + prices
 *
 * Body: { restaurantId: string, photoUrl: string }
 * OR: { restaurantId: string, imageBase64: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, photoUrl, imageBase64 } = body;

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'restaurantId required' }, { status: 400 });
    }

    if (!photoUrl && !imageBase64) {
      return NextResponse.json({ success: false, error: 'photoUrl or imageBase64 required' }, { status: 400 });
    }

    // If no Anthropic key, return a helpful message
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'AI menu analysis not configured. Set ANTHROPIC_API_KEY environment variable.',
        hint: 'Menu analysis requires Claude Vision API. Add your Anthropic API key to use this feature.',
      }, { status: 503 });
    }

    // Build the image content for Claude Vision
    let imageContent: any;
    if (imageBase64) {
      imageContent = {
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
      };
    } else {
      // Fetch the image and convert to base64
      const imgRes = await fetch(photoUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      const base64 = Buffer.from(imgBuffer).toString('base64');
      imageContent = {
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
      };
    }

    // Call Claude Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: [
            imageContent,
            {
              type: 'text',
              text: `Analyze this restaurant menu photo. Extract ALL visible menu items with their names, descriptions (if visible), and prices.

Return a JSON object:
{
  "items": [
    { "name": "Item Name", "name_local": "ローカル名", "price": 450, "currency": "JPY", "category": "main" }
  ],
  "language": "ja",
  "confidence": 0.92,
  "warnings": []
}

Rules:
- Extract EVERY visible item with price
- Detect language, translate names to English if not already English
- Category: appetizer, main, side, drink, dessert, set_meal, combo
- Price as number without currency symbol
- Detect currency from context
- Set confidence 0-1 based on readability
- Add warnings for blurry/partial items`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ success: false, error: `Claude API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: 'Failed to parse menu analysis' }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Store extracted menu items in Supabase
    if (SUPABASE_KEY && analysis.items?.length > 0) {
      for (const item of analysis.items) {
        await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            name: { en: item.name, original: item.name_local || item.name },
            price: item.price,
            currency: item.currency || 'USD',
            category: item.category || 'main',
            source: 'ai_photo_extract',
            last_verified: new Date().toISOString(),
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        itemsExtracted: analysis.items?.length || 0,
        language: analysis.language,
        confidence: analysis.confidence,
        warnings: analysis.warnings || [],
        items: analysis.items,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/menu-analyze?restaurantId=xxx
 * Returns stored menu items for a restaurant
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (!restaurantId) {
    return NextResponse.json({ success: false, error: 'restaurantId required' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${restaurantId}&select=*&order=category,price`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );

    const items = await res.json();

    return NextResponse.json({
      success: true,
      data: (items || []).map((item: any) => ({
        name: item.name?.en || item.name?.original || 'Unknown',
        nameLocal: item.name?.original,
        price: parseFloat(item.price),
        currency: item.currency,
        category: item.category,
        lastVerified: item.last_verified,
        source: item.source,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
