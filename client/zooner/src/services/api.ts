import { Capacitor } from '@capacitor/core';

const API_BASE_URL = import.meta.env.VITE_API_URL || (Capacitor.isNativePlatform() ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api');

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

// ── GLOBAL PRODUCT CATALOG API METHODS ──

export async function searchProducts(q?: string, category?: string, lat?: number, lon?: number): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category && category !== 'all') params.append('category', category);
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const res = await fetch(`${API_BASE_URL}/Products/search?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export async function getProductById(productId: string, lat?: number, lon?: number): Promise<any | null> {
  try {
    const params = new URLSearchParams();
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const res = await fetch(`${API_BASE_URL}/Products/${productId}?${params.toString()}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return null;
  }
}

export async function checkDuplicateProduct(gtin?: string, brandName?: string, modelNumber?: string, name?: string): Promise<any | null> {
  try {
    const params = new URLSearchParams();
    if (gtin) params.append('gtin', gtin);
    if (brandName) params.append('brandName', brandName);
    if (modelNumber) params.append('modelNumber', modelNumber);
    if (name) params.append('name', name);

    const res = await fetch(`${API_BASE_URL}/Products/check-duplicate?${params.toString()}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to check duplicate product:', error);
    return null;
  }
}

export async function createGlobalProduct(productData: {
  name: string;
  brandName?: string;
  categoryId: string;
  description?: string;
  modelNumber?: string;
  gtin?: string;
  mpn?: string;
  imageUrl?: string;
  variantName?: string;
}): Promise<any | null> {
  try {
    const token = localStorage.getItem('zooner_token');
    const res = await fetch(`${API_BASE_URL}/Products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(productData)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to create global product:', error);
    return null;
  }
}

// ── STORE INVENTORY MANAGEMENT API METHODS ──

export async function getStoreInventory(storeId: string, search?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch store inventory:', error);
    return [];
  }
}

export async function addStoreInventory(storeId: string, item: {
  productVariantId: string;
  price: number;
  quantity: number;
  shelfLocation?: string;
  sku?: string;
}): Promise<any | null> {
  try {
    const token = localStorage.getItem('zooner_token');
    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to add store inventory:', error);
    return null;
  }
}

export async function updateStoreInventory(storeId: string, inventoryId: string, item: {
  price: number;
  quantity: number;
  shelfLocation?: string;
  isActive?: boolean;
}): Promise<any | null> {
  try {
    const token = localStorage.getItem('zooner_token');
    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to update store inventory:', error);
    return null;
  }
}

export async function deleteStoreInventory(storeId: string, inventoryId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('zooner_token');
    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to delete store inventory:', error);
    return false;
  }
}

export async function reserveInventoryHold(storeId: string, inventoryId: string, quantity = 1): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}/hold?quantity=${quantity}`, {
      method: 'POST'
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to reserve inventory hold:', error);
    return false;
  }
}

