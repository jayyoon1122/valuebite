#!/usr/bin/env node
/**
 * Create menu_suggestions table in Supabase via direct SQL
 */
import { readFileSync } from 'fs';
import https from 'https';

const ENV = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = ENV.SUPABASE_SERVICE_KEY;

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: options.method || 'GET', headers: options.headers || {} };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data, json: () => JSON.parse(data) }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

const SQL = `
-- Create menu_suggestions table
CREATE TABLE IF NOT EXISTS menu_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    suggestion_type VARCHAR(20) NOT NULL CHECK (suggestion_type IN ('price_update', 'new_item', 'remove_item')),
    current_price DECIMAL(10,2),
    suggested_price DECIMAL(10,2),
    suggested_name JSONB,
    suggested_category VARCHAR(100),
    suggested_currency VARCHAR(3),
    removal_reason VARCHAR(200),
    submitter_fingerprint VARCHAR(64) NOT NULL,
    submitter_note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_menu_suggestions_status ON menu_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_menu_suggestions_restaurant ON menu_suggestions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_suggestions_fingerprint ON menu_suggestions(submitter_fingerprint);

-- Enable RLS
ALTER TABLE menu_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY IF NOT EXISTS "service_role_all" ON menu_suggestions
    FOR ALL USING (true) WITH CHECK (true);
`;

async function main() {
  console.log('Creating menu_suggestions table...');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: SQL }),
  });

  // If rpc doesn't work, try the SQL endpoint
  if (res.status >= 400) {
    console.log('RPC failed, trying direct SQL via pg...');

    // Use pg module or fall back to manual approach
    // For now, output the SQL for manual execution
    console.log('\nPlease run this SQL in Supabase Dashboard > SQL Editor:\n');
    console.log(SQL);
    console.log('\nOr run: node -e "...' );

    // Try via the Supabase management API
    const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
    });

    // Just output the SQL
    process.exit(0);
  }

  console.log('Done!', res.data);
}

main().catch(console.error);
