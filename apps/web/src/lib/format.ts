/**
 * Common display helpers used across cards, detail page, map.
 * Single source of truth so name/address/distance/freshness/hours all behave consistently.
 */

// ─────────── 1. Name picking ───────────
// True if the string is purely non-Latin (Korean/Japanese/Chinese), no Latin letters.
function isPurelyNonLatin(s?: string): boolean {
  if (!s) return false;
  if (/[a-zA-Z]/.test(s)) return false;
  return /[\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(s);
}

/**
 * Pick the best display name for the current locale.
 *  - For en locale: prefer .en (if not pure-CJK), then .romanized, then .ja/.original as last resort
 *  - Strips non-Latin parentheticals like " (中文名)" / "（日本語名）" from the chosen string
 */
export function pickName(name: any, locale: string = 'en'): string {
  if (!name) return '';
  const candidates: string[] = [];
  if (locale === 'ja' && name.ja) candidates.push(name.ja);
  if (locale === 'ko' && name.ko) candidates.push(name.ko);
  if (locale === 'zh-TW' && name.zh) candidates.push(name.zh);
  // Always try en + romanized as fallback chain
  if (name.en && !isPurelyNonLatin(name.en)) candidates.push(name.en);
  if (name.romanized && !isPurelyNonLatin(name.romanized)) candidates.push(name.romanized);
  // Last resort
  if (name.en) candidates.push(name.en);
  if (name.original) candidates.push(name.original);
  const chosen = candidates.find(Boolean) || '';
  return cleanName(chosen, locale);
}

/**
 * Strip parenthetical text in a different script than the chosen locale.
 *   "Halal Wagyu Ramen (ハラル和牛ラーメン)" → "Halal Wagyu Ramen"  (en locale)
 *   "Wagyu Steak ... 新宿 和牛 餐厅"          → "Wagyu Steak ..."   (en locale)
 * Keeps the original if removing parentheticals would empty the string.
 */
export function cleanName(s: string, locale: string = 'en'): string {
  if (!s) return '';
  const isEnglish = locale === 'en' || locale === 'fr' || locale === 'de' || locale === 'es' || locale === 'pt' || locale === 'it' || locale === 'nl' || locale === 'pl' || locale === 'cs' || locale === 'hu' || locale === 'tr';
  if (!isEnglish) return s.trim();
  // Remove anything in parens that contains CJK
  let out = s.replace(/\s*[\(（][^\)）]*[\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF][^\)）]*[\)）]/g, '');
  // Strip trailing standalone CJK runs at the end of name
  out = out.replace(/\s+[\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF][\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\s]*$/, '');
  out = out.trim();
  return out || s.trim(); // never return empty
}

/**
 * Show original/local name as subtitle ONLY if it's actually different from
 * the displayed name AND in a different script the user can read.
 * Returns empty string when original is in a script the user can't read
 * (e.g. Korean name on English UI for a Tokyo restaurant — that's bad data leak).
 */
export function pickSubtitle(name: any, displayedName: string, locale: string = 'en'): string {
  if (!name?.original) return '';
  const orig = String(name.original).trim();
  if (!orig || orig === displayedName) return '';
  // For English UI: only show subtitle if original is in CJK and matches the country's script
  // (Onigiri Specialty Shop showing Korean "오니기리 전문점" is BAD — Korean isn't Japan's script)
  if (locale === 'en') {
    const hasKorean = /[\uAC00-\uD7AF]/.test(orig);
    const hasJapanese = /[\u3040-\u30FF]/.test(orig);
    const hasChinese = /[\u4E00-\u9FFF]/.test(orig);
    // Show only if it looks like it's the local-language name (Japanese/Chinese)
    if (hasKorean && !hasJapanese && !hasChinese) return ''; // pure Korean = bad data, hide
    return orig;
  }
  return orig;
}

// ─────────── 2. Address normalization ───────────
// Strip country suffix when it's in the wrong script for current locale.
// "...Tokyo 111-0042 일본"  → "...Tokyo 111-0042"  (en locale, 일본 = Japan in Korean)
// "...Shibuya, 일본"          → "...Shibuya"
const COUNTRY_SUFFIX_PATTERNS = [
  /[,\s]+일본\s*$/,           // Korean for Japan
  /[,\s]+한국\s*$/,           // Korean for Korea
  /[,\s]+대한민국\s*$/,
  /[,\s]+中国\s*$/,           // Chinese for China
  /[,\s]+台灣\s*$/,
  /[,\s]+香港\s*$/,
  /[,\s]+日本\s*$/,           // Japanese for Japan
  /[,\s]+大韓民国\s*$/,
];

export function normalizeAddress(addr: any, locale: string = 'en'): string {
  if (!addr) return '';
  const s = typeof addr === 'object' ? (addr.en || addr.original || '') : String(addr);
  if (locale === 'en') {
    let out = s;
    for (const re of COUNTRY_SUFFIX_PATTERNS) out = out.replace(re, '');
    return out.trim();
  }
  return s.trim();
}

// ─────────── 3. Walking time ───────────
// Convert distance (km) to human-readable travel time.
//  < 1km  → "X min walk"  (5 km/h walking pace)
//  1-5km  → "X min walk · Y min drive" (compact: just "Y min drive" alone)
//  > 5km  → "X min drive" (35 km/h urban driving avg)
export function travelTime(km: number | null | undefined): string {
  if (km == null) return '';
  if (km < 0.05) return 'Right here';
  if (km < 1.5) {
    const min = Math.max(1, Math.round((km / 5) * 60));
    return `${min} min walk`;
  }
  if (km < 5) {
    const walkMin = Math.round((km / 5) * 60);
    return walkMin <= 30 ? `${walkMin} min walk` : `${Math.round((km / 35) * 60)} min drive`;
  }
  return `${Math.round((km / 35) * 60)} min drive`;
}

// ─────────── 4. Open Now status ───────────
// Parses operatingHours and returns a status with color + label.
// Supports shapes:
//   "11:00 - 22:00"  (string, applies all days)
//   { mon: "11:00-22:00", tue: ..., ... }
//   { mon: { open: "11:00", close: "22:00" }, ... }
//   true (is24h)
export interface OpenStatus {
  state: 'open' | 'closing_soon' | 'closed' | 'unknown';
  label: string;          // e.g. "Open · closes 10:00 PM"
  color: string;          // tailwind color class
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

function parseHHMM(s: string): number | null {
  if (!s) return null;
  const m = s.match(/(\d{1,2}):?(\d{2})?/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  if (isNaN(h) || h < 0 || h > 30) return null;
  return h * 60 + mm;
}

function fmtHHMM(min: number): string {
  const h24 = Math.floor((min / 60) % 24);
  const mm = min % 60;
  const period = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return mm === 0 ? `${h12}${period}` : `${h12}:${String(mm).padStart(2, '0')}${period}`;
}

export function getOpenStatus(operatingHours: any, is24h?: boolean, now: Date = new Date()): OpenStatus {
  if (is24h) return { state: 'open', label: 'Open 24 hours', color: 'text-green-500' };
  if (!operatingHours) return { state: 'unknown', label: '', color: '' };

  const day = DAY_KEYS[now.getDay()];
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Resolve today's range
  let openMin: number | null = null;
  let closeMin: number | null = null;

  const parseRange = (val: any): { open: number; close: number } | null => {
    if (!val) return null;
    if (typeof val === 'object' && val.open && val.close) {
      const o = parseHHMM(val.open);
      const c = parseHHMM(val.close);
      if (o == null || c == null) return null;
      return { open: o, close: c < o ? c + 24 * 60 : c }; // overnight
    }
    if (typeof val === 'string') {
      const parts = val.split(/[-–~〜]/).map(s => s.trim());
      if (parts.length !== 2) return null;
      const o = parseHHMM(parts[0]);
      const c = parseHHMM(parts[1]);
      if (o == null || c == null) return null;
      return { open: o, close: c < o ? c + 24 * 60 : c };
    }
    return null;
  };

  if (typeof operatingHours === 'string') {
    const r = parseRange(operatingHours);
    if (r) { openMin = r.open; closeMin = r.close; }
  } else if (typeof operatingHours === 'object') {
    const r = parseRange(operatingHours[day]);
    if (r) { openMin = r.open; closeMin = r.close; }
  }

  if (openMin == null || closeMin == null) return { state: 'unknown', label: '', color: '' };

  // Allow overnight hours (close < open means crosses midnight)
  const adjustedNow = nowMin < openMin && closeMin >= 24 * 60 ? nowMin + 24 * 60 : nowMin;

  if (adjustedNow >= openMin && adjustedNow < closeMin) {
    const minsUntilClose = closeMin - adjustedNow;
    if (minsUntilClose <= 60) {
      return {
        state: 'closing_soon',
        label: `Closing soon · ${fmtHHMM(closeMin % (24 * 60))}`,
        color: 'text-orange-500',
      };
    }
    return {
      state: 'open',
      label: `Open · closes ${fmtHHMM(closeMin % (24 * 60))}`,
      color: 'text-green-600',
    };
  }
  // Closed
  if (nowMin < openMin) {
    return {
      state: 'closed',
      label: `Closed · opens ${fmtHHMM(openMin)}`,
      color: 'text-red-500',
    };
  }
  return {
    state: 'closed',
    label: 'Closed now',
    color: 'text-red-500',
  };
}

// ─────────── 5. Freshness label ───────────
// Returns "Verified X days ago" / hides if too old.
export function freshnessLabel(verifiedAt: string | Date | null | undefined): { text: string; color: string } | null {
  if (!verifiedAt) return null;
  const d = typeof verifiedAt === 'string' ? new Date(verifiedAt) : verifiedAt;
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / (24 * 3600 * 1000));
  if (isNaN(days) || days < 0) return null;
  if (days > 60) return null; // stale — don't show; misleading
  if (days === 0) return { text: 'Verified today', color: 'text-green-600' };
  if (days === 1) return { text: 'Verified yesterday', color: 'text-green-600' };
  if (days < 7) return { text: `Verified ${days} days ago`, color: 'text-green-600' };
  if (days < 30) return { text: `Verified ${Math.floor(days / 7)} weeks ago`, color: 'text-green-500' };
  return { text: `Verified ${Math.floor(days / 30)} months ago`, color: 'text-yellow-600' };
}

// ─────────── 6. Native share ───────────
// Wraps navigator.share with clipboard fallback.
export async function shareLink(opts: { title: string; text?: string; url: string }): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator === 'undefined') return 'failed';
  if (navigator.share) {
    try {
      await navigator.share(opts);
      return 'shared';
    } catch {
      // user dismissed — fall through to copy
    }
  }
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(opts.url);
      return 'copied';
    } catch {}
  }
  return 'failed';
}
