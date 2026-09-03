const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export async function fetchCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/Categories`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch categories from API:', error);
    return [];
  }
}

export async function fetchShops(lat?: number, lon?: number): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const url = `${API_BASE_URL}/Shops${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch shops from API:', error);
    return [];
  }
}

export async function sendLiveRequest(requestData: {
  productName: string;
  specifications?: string;
  budgetMin?: number;
  budgetMax?: number;
  radiusKm: number;
  latitude: number;
  longitude: number;
}): Promise<any | null> {
  try {
    const token = localStorage.getItem('zooner_token');
    const res = await fetch(`${API_BASE_URL}/Requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(requestData)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to send live request:', error);
    return null;
  }
}

export async function fetchTargetedAds(lat = 11.0168, lon = 76.9558, category = 'all'): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      userLat: lat.toString(),
      userLon: lon.toString(),
      category: category
    });
    const res = await fetch(`${API_BASE_URL}/Advertisements/targeted?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch targeted ads:', error);
    return [];
  }
}
