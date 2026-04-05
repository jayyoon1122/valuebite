const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  restaurants: {
    nearby: (params: Record<string, string | number>) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return apiFetch<any>(`/api/v1/restaurants/nearby?${qs}`);
    },
    search: (params: Record<string, string | number>) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return apiFetch<any>(`/api/v1/restaurants/search?${qs}`);
    },
    getById: (id: string) => apiFetch<any>(`/api/v1/restaurants/${id}`),
    byPurpose: (purposeKey: string, params: Record<string, string | number>) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return apiFetch<any>(`/api/v1/restaurants/purpose/${purposeKey}?${qs}`);
    },
    trending: (params?: Record<string, string | number>) => {
      const qs = params ? new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString() : '';
      return apiFetch<any>(`/api/v1/restaurants/trending?${qs}`);
    },
  },
  reviews: {
    byRestaurant: (restaurantId: string) =>
      apiFetch<any>(`/api/v1/reviews/restaurant/${restaurantId}`),
  },
  menus: {
    byRestaurant: (restaurantId: string) =>
      apiFetch<any>(`/api/v1/menus/restaurant/${restaurantId}`),
  },
  priceBrackets: {
    byCountry: (code: string) =>
      apiFetch<any>(`/api/v1/price-brackets/country/${code}`),
    countries: () => apiFetch<any>(`/api/v1/price-brackets/countries`),
  },
};
