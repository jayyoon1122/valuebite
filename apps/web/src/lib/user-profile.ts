/**
 * User profile persistence via localStorage
 * No auth needed — all data stored locally on device
 */

export interface UserProfile {
  displayName: string;
  homeCity: string;
  preferredLanguage: string;
  dietaryPreferences: string[];
  monthlyBudget: string;
  avatarDataUrl: string | null;
}

const STORAGE_KEY = 'valuebite-profile';

const DEFAULTS: UserProfile = {
  displayName: '',
  homeCity: '',
  preferredLanguage: 'en',
  dietaryPreferences: [],
  monthlyBudget: '',
  avatarDataUrl: null,
};

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveProfile(profile: Partial<UserProfile>): UserProfile {
  const current = loadProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getDisplayName(): string {
  const profile = loadProfile();
  return profile.displayName || 'ValueBite User';
}
