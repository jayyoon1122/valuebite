/**
 * AI Menu Photo Analysis Pipeline
 * Uses Claude Vision API to extract menu items from photos
 */

interface ExtractedMenuItem {
  name: { original: string; en?: string };
  description?: { original: string; en?: string };
  price: number;
  currency: string;
  category?: string;
  isLunchSpecial?: boolean;
  isSeasonal?: boolean;
  estimatedCalories?: number;
  hasProtein?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

interface MenuAnalysisResult {
  items: ExtractedMenuItem[];
  language: string;
  confidence: number;
  restaurantNameDetected?: string;
  warnings: string[];
}

const MENU_ANALYSIS_PROMPT = `You are analyzing a restaurant menu photo. Extract ALL menu items with their names, descriptions, and prices.

Return a JSON object with this exact structure:
{
  "items": [
    {
      "name": {"original": "牛丼並盛", "en": "Regular Beef Bowl"},
      "description": {"original": "...", "en": "..."},
      "price": 450,
      "currency": "JPY",
      "category": "main",
      "isLunchSpecial": false,
      "isSeasonal": false,
      "estimatedCalories": 650,
      "hasProtein": true,
      "isVegetarian": false,
      "isVegan": false
    }
  ],
  "language": "ja",
  "confidence": 0.92,
  "restaurantNameDetected": "松屋",
  "warnings": []
}

Rules:
- Extract EVERY visible menu item with its price
- Detect the language of the menu
- Translate names and descriptions to English if not already in English
- Category should be one of: appetizer, main, side, drink, dessert, set_meal, combo
- Flag items that appear to be lunch-only specials or seasonal items
- Estimate calories and nutritional flags (hasProtein, isVegetarian, isVegan) if possible
- Set confidence between 0 and 1 based on image quality and readability
- Add warnings for any issues (blurry text, partially visible items, etc.)
- Prices must be numbers without currency symbols
- Detect currency from context (¥ = JPY, $ = USD, £ = GBP, € = EUR, ₩ = KRW)`;

export async function analyzeMenuPhoto(
  imageBase64: string,
  apiKey: string,
): Promise<MenuAnalysisResult> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            { type: 'text', text: MENU_ANALYSIS_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse menu analysis response');
  }

  const result: MenuAnalysisResult = JSON.parse(jsonMatch[0]);

  // Validate and clean results
  result.items = result.items.filter(
    (item) => item.name && item.price > 0 && item.currency,
  );
  result.confidence = Math.min(1, Math.max(0, result.confidence));

  return result;
}

/**
 * Check if a menu photo is stale based on EXIF date or upload date
 */
export function checkPhotoStaleness(photoDate: Date | null): {
  isStale: boolean;
  warning?: string;
  daysOld: number;
} {
  if (!photoDate) {
    return { isStale: false, daysOld: 0 };
  }

  const daysOld = Math.floor(
    (Date.now() - photoDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysOld > 180) {
    return {
      isStale: true,
      warning: `Photo is ${Math.floor(daysOld / 30)} months old. Prices may have changed significantly.`,
      daysOld,
    };
  }
  if (daysOld > 90) {
    return {
      isStale: false,
      warning: `Photo is ${Math.floor(daysOld / 30)} months old. Prices may have changed.`,
      daysOld,
    };
  }
  return { isStale: false, daysOld };
}
