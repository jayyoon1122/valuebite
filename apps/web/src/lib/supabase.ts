/**
 * Shared Supabase REST helper for server-side API routes
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export async function supaFetch<T = any>(
  path: string,
  options: { method?: string; body?: any; headers?: Record<string, string> } = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    return { data: null, error: text.slice(0, 300), status: res.status };
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { data, error: null, status: res.status };
}
