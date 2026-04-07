/**
 * ValueBite Data Layer — Single source of truth: Supabase
 * NO seed data, NO mock data, NO fallbacks.
 * Every piece of data comes from the database.
 */

// ==================
// Restaurant List (for home page, search, purpose)
// ==================

export async function fetchNearbyRestaurants(lat: number, lng: number, radius: number = 15): Promise<any[]> {
  const res = await fetch(`/api/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  const data = await res.json();
  return data.success ? data.data : [];
}

// ==================
// Restaurant Detail (for detail page)
// ==================

export async function fetchRestaurantDetail(id: string): Promise<any | null> {
  const res = await fetch(`/api/restaurants/${id}`);
  const data = await res.json();
  return data.success ? data.data : null;
}

// ==================
// Menu Items
// ==================

export async function fetchMenuItems(restaurantId: string): Promise<any[]> {
  const res = await fetch(`/api/menu-analyze?restaurantId=${restaurantId}`);
  const data = await res.json();
  return data.success ? data.data : [];
}
