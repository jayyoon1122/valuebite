/**
 * Ad placements simulating Google AdMob + Meta Audience Network
 * In production, these would be served by the AdMob/Meta SDKs
 * Instagram-style native ads that blend with the feed
 */

export interface NativeAdData {
  id: string;
  type: 'native_feed' | 'native_banner';
  headline: string;
  body: string;
  callToAction: string;
  targetUrl: string;
  advertiser: string;
  adNetwork: 'google' | 'meta';
  imageUrl: string;
  logoUrl?: string;
}

// Feed ads — appear between restaurant cards (Instagram-style)
export const FEED_ADS: NativeAdData[] = [
  {
    id: 'ad-feed-1',
    type: 'native_feed',
    headline: 'HelloFresh — Budget Meals Delivered',
    body: 'Fresh ingredients, easy recipes. 50% off your first box. Plans from $3.99/serving.',
    callToAction: 'Get 50% Off',
    targetUrl: '#',
    advertiser: 'HelloFresh',
    adNetwork: 'google',
    imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=300&fit=crop',
  },
  {
    id: 'ad-feed-2',
    type: 'native_feed',
    headline: 'Uber Eats — Free Delivery This Week',
    body: 'Order from your favorite budget restaurants. Free delivery on orders over $10.',
    callToAction: 'Order Now',
    targetUrl: '#',
    advertiser: 'Uber Eats',
    adNetwork: 'meta',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=300&fit=crop',
  },
  {
    id: 'ad-feed-3',
    type: 'native_feed',
    headline: 'Too Good To Go — Save Food, Save Money',
    body: 'Rescue surprise bags from local restaurants for 1/3 of the price. Download free.',
    callToAction: 'Download App',
    targetUrl: '#',
    advertiser: 'Too Good To Go',
    adNetwork: 'google',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=300&fit=crop',
  },
  {
    id: 'ad-feed-4',
    type: 'native_feed',
    headline: 'Costco Gold Star Membership',
    body: 'Bulk groceries at wholesale prices. Save up to 30% on weekly grocery runs.',
    callToAction: 'Join Now',
    targetUrl: '#',
    advertiser: 'Costco',
    adNetwork: 'meta',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop',
  },
];

// Banner ads — appear at bottom of restaurant detail pages
export const DETAIL_BANNER_ADS: NativeAdData[] = [
  {
    id: 'ad-banner-1',
    type: 'native_banner',
    headline: 'Track your spending with Mint',
    body: 'Free budgeting app. See where your dining money goes.',
    callToAction: 'Get Mint Free',
    targetUrl: '#',
    advertiser: 'Mint',
    adNetwork: 'google',
    imageUrl: '',
  },
  {
    id: 'ad-banner-2',
    type: 'native_banner',
    headline: 'Rakuten — Cash Back on Dining',
    body: 'Earn up to 5% cash back at partner restaurants.',
    callToAction: 'Start Earning',
    targetUrl: '#',
    advertiser: 'Rakuten',
    adNetwork: 'google',
    imageUrl: '',
  },
];

// Community feed ads
export const COMMUNITY_ADS: NativeAdData[] = [
  {
    id: 'ad-community-1',
    type: 'native_feed',
    headline: 'Grammarly — Write Better Reviews',
    body: 'Free writing assistant. Make your restaurant reviews clear and helpful.',
    callToAction: 'Add to Browser',
    targetUrl: '#',
    advertiser: 'Grammarly',
    adNetwork: 'meta',
    imageUrl: '',
  },
];

// Helper to get a random feed ad
export function getNextFeedAd(index: number): NativeAdData {
  return FEED_ADS[index % FEED_ADS.length];
}
