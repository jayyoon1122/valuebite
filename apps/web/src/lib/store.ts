import { create } from 'zustand';
import type { PurposeKey } from '@valuebite/types';

interface AppState {
  // Location
  userLat: number;
  userLng: number;
  setUserLocation: (lat: number, lng: number) => void;

  // Region & Language
  locale: string;
  setLocale: (locale: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  cityId: string | null;
  cityName: string;
  setCityId: (id: string | null, name?: string) => void;

  // Filters
  selectedPurpose: PurposeKey | null;
  setSelectedPurpose: (purpose: PurposeKey | null) => void;
  priceMax: number | null;
  setPriceMax: (price: number | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showChains: boolean;
  toggleShowChains: () => void;

  // UI
  isMapView: boolean;
  toggleMapView: () => void;
  darkMode: boolean;
  setDarkMode: (on: boolean) => void;
}

// Detect system preference for dark mode
function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
}

// Load persisted state from localStorage
function loadPersistedState(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('valuebite-prefs');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

function persistState(state: Partial<AppState>) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      locale: state.locale,
      countryCode: state.countryCode,
      cityId: state.cityId,
      cityName: state.cityName,
      userLat: state.userLat,
      userLng: state.userLng,
      showChains: state.showChains,
      darkMode: state.darkMode,
    };
    localStorage.setItem('valuebite-prefs', JSON.stringify(toSave));
  } catch {}
}

const persisted = loadPersistedState();

export const useAppStore = create<AppState>((set, get) => ({
  // Default to Tokyo, but restore from persisted prefs if available
  userLat: persisted.userLat || 35.6762,
  userLng: persisted.userLng || 139.6503,
  setUserLocation: (lat, lng) => {
    set({ userLat: lat, userLng: lng });
    persistState({ ...get(), userLat: lat, userLng: lng });
  },

  // Region & Language
  locale: persisted.locale || 'en',
  setLocale: (locale) => {
    set({ locale });
    persistState({ ...get(), locale });
  },
  countryCode: persisted.countryCode || 'JP',
  setCountryCode: (code) => {
    set({ countryCode: code });
    persistState({ ...get(), countryCode: code });
  },
  cityId: persisted.cityId || 'tokyo',
  cityName: persisted.cityName || 'Tokyo',
  setCityId: (id, name) => {
    set({ cityId: id, cityName: name || id || '' });
    persistState({ ...get(), cityId: id, cityName: name || id || '' });
  },

  // Filters
  selectedPurpose: null,
  setSelectedPurpose: (purpose) => set({ selectedPurpose: purpose }),
  priceMax: null,
  setPriceMax: (price) => set({ priceMax: price }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  showChains: persisted.showChains ?? true,
  toggleShowChains: () => {
    const next = !get().showChains;
    set({ showChains: next });
    persistState({ ...get(), showChains: next });
  },

  // UI
  isMapView: true,
  toggleMapView: () => set((s) => ({ isMapView: !s.isMapView })),
  darkMode: persisted.darkMode ?? getSystemDarkMode(), // auto-detect from system preference
  setDarkMode: (on) => {
    set({ darkMode: on });
    persistState({ ...get(), darkMode: on });
    // Apply to DOM immediately
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', on);
      document.documentElement.classList.toggle('light', !on);
    }
  },
}));
