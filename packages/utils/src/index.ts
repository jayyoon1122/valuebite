// Country config for formatting and display
export const COUNTRY_CONFIG: Record<string, {
  locale: string;
  currencyCode: string;
  currencySymbol: string;
  fractionDigits: number;
}> = {
  US: { locale: 'en-US', currencyCode: 'USD', currencySymbol: '$', fractionDigits: 2 },
  JP: { locale: 'ja-JP', currencyCode: 'JPY', currencySymbol: '¥', fractionDigits: 0 },
  KR: { locale: 'ko-KR', currencyCode: 'KRW', currencySymbol: '₩', fractionDigits: 0 },
  GB: { locale: 'en-GB', currencyCode: 'GBP', currencySymbol: '£', fractionDigits: 2 },
  DE: { locale: 'de-DE', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  FR: { locale: 'fr-FR', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  AU: { locale: 'en-AU', currencyCode: 'AUD', currencySymbol: 'A$', fractionDigits: 2 },
  CA: { locale: 'en-CA', currencyCode: 'CAD', currencySymbol: 'C$', fractionDigits: 2 },
  AE: { locale: 'en-AE', currencyCode: 'AED', currencySymbol: 'د.إ', fractionDigits: 2 },
  SG: { locale: 'en-SG', currencyCode: 'SGD', currencySymbol: 'S$', fractionDigits: 2 },
  HK: { locale: 'en-HK', currencyCode: 'HKD', currencySymbol: 'HK$', fractionDigits: 0 },
  TW: { locale: 'zh-TW', currencyCode: 'TWD', currencySymbol: 'NT$', fractionDigits: 0 },
  NL: { locale: 'nl-NL', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  ES: { locale: 'es-ES', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  IT: { locale: 'it-IT', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  NZ: { locale: 'en-NZ', currencyCode: 'NZD', currencySymbol: 'NZ$', fractionDigits: 2 },
  PT: { locale: 'pt-PT', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  CH: { locale: 'de-CH', currencyCode: 'CHF', currencySymbol: 'CHF', fractionDigits: 2 },
  LU: { locale: 'fr-LU', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  CZ: { locale: 'cs-CZ', currencyCode: 'CZK', currencySymbol: 'Kč', fractionDigits: 0 },
  AT: { locale: 'de-AT', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  HU: { locale: 'hu-HU', currencyCode: 'HUF', currencySymbol: 'Ft', fractionDigits: 0 },
  PL: { locale: 'pl-PL', currencyCode: 'PLN', currencySymbol: 'zł', fractionDigits: 2 },
  TR: { locale: 'tr-TR', currencyCode: 'TRY', currencySymbol: '₺', fractionDigits: 2 },
  GR: { locale: 'el-GR', currencyCode: 'EUR', currencySymbol: '€', fractionDigits: 2 },
  IL: { locale: 'he-IL', currencyCode: 'ILS', currencySymbol: '₪', fractionDigits: 2 },
  QA: { locale: 'en-QA', currencyCode: 'QAR', currencySymbol: 'QR', fractionDigits: 2 },
  KW: { locale: 'en-KW', currencyCode: 'KWD', currencySymbol: 'KD', fractionDigits: 3 },
  IN: { locale: 'en-IN', currencyCode: 'INR', currencySymbol: '₹', fractionDigits: 0 },
  MX: { locale: 'es-MX', currencyCode: 'MXN', currencySymbol: 'MX$', fractionDigits: 0 },
};

export function formatPrice(amount: number, countryCode: string): string {
  const config = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG.US;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currencyCode,
    minimumFractionDigits: config.fractionDigits,
    maximumFractionDigits: config.fractionDigits,
  }).format(amount);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getFreshnessIndicator(lastVerified: Date | null) {
  if (!lastVerified) {
    return { label: 'unverified', color: 'red' as const, icon: '?', cta: 'Upload current menu photo' };
  }
  const days = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 30) return { label: 'recentlyVerified', color: 'green' as const, icon: 'check' };
  if (days <= 90) return { label: 'verified1to3', color: 'yellow' as const, icon: 'clock' };
  if (days <= 180) return { label: 'mayBeOutdated', color: 'orange' as const, icon: 'alert' };
  return { label: 'unverified', color: 'red' as const, icon: '?', cta: 'Upload current menu photo' };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

// Haversine distance in meters
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
