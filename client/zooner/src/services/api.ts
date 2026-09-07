import { Capacitor } from '@capacitor/core';
import type {
  CategoryDto,
  StoreInventoryItem,
  ProductSearchResult,
  LiveRequestSummary,
  AuthResponse,
  UserDto,
  InventoryHoldDto
} from '../types';

const isNative = Capacitor.isNativePlatform();
const isProd = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  isProd ? (isNative ? 'https://api.zooner.app/api' : '/api') : (isNative ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api')
);

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  const isNative = Capacitor.isNativePlatform();
  const refreshToken = isNative ? localStorage.getItem('zooner_refresh_token') : null;
  const currentToken = localStorage.getItem('zooner_token');

  // In browser, if we don't have an active or recent token session, avoid redundant refresh attempts
  if (!isNative && !currentToken) {
    return null;
  }
  if (isNative && !refreshToken) {
    return null;
  }

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isNative) {
        headers['X-Client-Platform'] = 'native';
      }

      const res = await fetch(`${API_BASE_URL}/Auth/refresh-token`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(refreshToken ? { refreshToken } : {})
      });

      if (!res.ok) {
        logoutUser();
        return null;
      }

      const body: ApiResponse<AuthResponse> = await res.json();
      if (body.success && body.data) {
        localStorage.setItem('zooner_token', body.data.accessToken);
        if (isNative && body.data.refreshToken) {
          localStorage.setItem('zooner_refresh_token', body.data.refreshToken);
        } else {
          // Never store refresh token in browser localStorage; rely strictly on HttpOnly cookie
          localStorage.removeItem('zooner_refresh_token');
        }
        return body.data.accessToken;
      }

      logoutUser();
      return null;
    } catch {
      logoutUser();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('zooner_token');
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (Capacitor.isNativePlatform() && !headers.has('X-Client-Platform')) {
    headers.set('X-Client-Platform', 'native');
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || 'include'
  };

  let res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...fetchOptions, headers });
    }
  }

  return res;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('zooner_token');
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  if (Capacitor.isNativePlatform()) {
    headers['X-Client-Platform'] = 'native';
  }
  return headers;
}

async function responseData<T>(response: Response): Promise<T | null> {
  if (!response.ok) return null;
  const body: ApiResponse<T> = await response.json();
  return body.data ?? null;
}

// ── AUTHENTICATION API METHODS ──

export async function syncUserProfile(): Promise<{
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVendor: boolean;
  shops: ShopProfileDto[];
  loggedInAt: number;
} | null> {
  try {
    const token = localStorage.getItem('zooner_token');
    if (!token) return null;
    const user = await getCurrentUser();
    const myShops = await getMyShops();
    const isVendor = (myShops && myShops.length > 0) || (user && (user.role === 'ShopOwner' || user.role === 'Admin' || user.role === 'VC' || user.role === 'Both'));
    if (user) {
      const profile = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phoneNumber || '',
        role: user.role,
        isVendor: Boolean(isVendor),
        shops: myShops || [],
        loggedInAt: Date.now()
      };
      localStorage.setItem('zooner_user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('storage'));
      return profile;
    }
    return null;
  } catch {
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const isNative = Capacitor.isNativePlatform();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isNative) {
      headers['X-Client-Platform'] = 'native';
    }

    const res = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return null;
    const body: ApiResponse<AuthResponse> = await res.json();
    if (body.success && body.data) {
      localStorage.setItem('zooner_token', body.data.accessToken);
      if (isNative && body.data.refreshToken) {
        localStorage.setItem('zooner_refresh_token', body.data.refreshToken);
      } else {
        localStorage.removeItem('zooner_refresh_token');
      }
      
      // Save initial profile
      localStorage.setItem('zooner_user_profile', JSON.stringify({
        id: body.data.user.id,
        name: body.data.user.fullName,
        email: body.data.user.email,
        phone: body.data.user.phoneNumber || '',
        role: body.data.user.role,
        isVendor: body.data.user.role === 'ShopOwner' || body.data.user.role === 'Admin',
        shops: [],
        loggedInAt: Date.now()
      }));
      window.dispatchEvent(new Event('storage'));

      // Asynchronously enrich with user's shops
      syncUserProfile();
      return body.data;
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}): Promise<AuthResponse | null> {
  try {
    const isNative = Capacitor.isNativePlatform();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isNative) {
      headers['X-Client-Platform'] = 'native';
    }

    const res = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    if (!res.ok) return null;
    const body: ApiResponse<AuthResponse> = await res.json();
    if (body.success && body.data) {
      localStorage.setItem('zooner_token', body.data.accessToken);
      if (isNative && body.data.refreshToken) {
        localStorage.setItem('zooner_refresh_token', body.data.refreshToken);
      } else {
        localStorage.removeItem('zooner_refresh_token');
      }
      localStorage.setItem('zooner_user_profile', JSON.stringify({
        id: body.data.user.id,
        name: body.data.user.fullName,
        email: body.data.user.email,
        phone: body.data.user.phoneNumber || '',
        role: body.data.user.role,
        isVendor: body.data.user.role === 'ShopOwner' || body.data.user.role === 'Admin',
        shops: [],
        loggedInAt: Date.now()
      }));
      window.dispatchEvent(new Event('storage'));

      syncUserProfile();
      return body.data;
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<UserDto | null> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Auth/me`);
    return responseData<UserDto>(res);
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  const isNative = Capacitor.isNativePlatform();
  const refreshToken = isNative ? localStorage.getItem('zooner_refresh_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isNative) {
    headers['X-Client-Platform'] = 'native';
  }

  fetch(`${API_BASE_URL}/Auth/logout`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(refreshToken ? { refreshToken } : {})
  }).catch(() => {});

  localStorage.removeItem('zooner_token');
  localStorage.removeItem('zooner_refresh_token');
  localStorage.removeItem('zooner_user_profile');
  window.dispatchEvent(new Event('storage'));
}


// ── SHOPS & STORES API METHODS ──

export interface ShopProfileDto {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  isLiveEnabled: boolean;
  isOpen: boolean;
  isVerified?: boolean;
  categoryName?: string;
  categories?: { id: string; name: string }[];
  products?: { id: string; name: string; price: number; originalPrice?: number; inStock?: boolean; stockCount?: number; imageUrl?: string }[];
}

export async function createShop(shopData: {
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  categoryIds: string[];
}): Promise<ShopProfileDto | null> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Shops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });
    const result = await responseData<ShopProfileDto>(res);
    if (result) {
      await syncUserProfile();
    }
    return result;
  } catch (error) {
    console.error('Create shop error:', error);
    return null;
  }
}

export async function getMyShops(): Promise<ShopProfileDto[]> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/Shops/my-shops`);
    return (await responseData<ShopProfileDto[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function updateShop(shopId: string, shop: {
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
}): Promise<ShopProfileDto | null> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/Shops/${shopId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shop)
    });
    return responseData<ShopProfileDto>(response);
  } catch {
    return null;
  }
}

export async function setShopLiveStatus(shopId: string, isLiveEnabled: boolean): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/Shops/${shopId}/live-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLiveEnabled })
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getIncomingRequests(shopId: string): Promise<LiveRequestSummary[]> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/Shops/${shopId}/incoming-requests`);
    return (await responseData<LiveRequestSummary[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function respondToLiveRequest(requestId: string, shopId: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/Requests/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId })
    });
    return responseData<Record<string, unknown>>(response);
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/Categories`);
    if (!res.ok) return [];
    const json: ApiResponse<CategoryDto[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch categories from API:', error);
    return [];
  }
}

export async function fetchShops(lat?: number, lon?: number): Promise<ShopProfileDto[]> {
  try {
    const params = new URLSearchParams();
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const url = `${API_BASE_URL}/Shops${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json: ApiResponse<ShopProfileDto[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch shops from API:', error);
    return [];
  }
}

export async function sendLiveRequest(requestData: {
  requestText: string;
  categoryId: string;
  subCategoryId?: string;
  searchRadiusKm: number;
  latitude: number;
  longitude: number;
}): Promise<LiveRequestSummary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/Requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(requestData)
    });
    if (!res.ok) return null;
    const json: ApiResponse<LiveRequestSummary> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to send live request:', error);
    return null;
  }
}

export async function fetchTargetedAds(lat = 11.0168, lon = 76.9558, category = 'all'): Promise<Record<string, unknown>[]> {
  try {
    const params = new URLSearchParams({
      userLat: lat.toString(),
      userLon: lon.toString(),
      category: category
    });
    const res = await fetch(`${API_BASE_URL}/Advertisements/targeted?${params.toString()}`);
    if (!res.ok) return [];
    const json: ApiResponse<Record<string, unknown>[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch targeted ads:', error);
    return [];
  }
}

// ── GLOBAL PRODUCT CATALOG API METHODS ──

export async function searchProducts(q?: string, category?: string, lat?: number, lon?: number): Promise<ProductSearchResult[]> {
  try {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category && category !== 'all') params.append('category', category);
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const res = await fetch(`${API_BASE_URL}/Products/search?${params.toString()}`);
    if (!res.ok) return [];
    const json: ApiResponse<ProductSearchResult[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export async function getProductById(productId: string, lat?: number, lon?: number): Promise<ProductSearchResult | null> {
  try {
    const params = new URLSearchParams();
    if (lat) params.append('userLat', lat.toString());
    if (lon) params.append('userLon', lon.toString());

    const res = await fetch(`${API_BASE_URL}/Products/${productId}?${params.toString()}`);
    if (!res.ok) return null;
    const json: ApiResponse<ProductSearchResult> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return null;
  }
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  possibleDuplicateFound?: boolean;
  reason?: string;
  matchedProduct?: ProductSearchResult;
  matchingProduct?: ProductSearchResult;
}

export async function checkDuplicateProduct(gtin?: string, brandName?: string, modelNumber?: string, name?: string): Promise<DuplicateCheckResult | null> {
  try {
    const params = new URLSearchParams();
    if (gtin) params.append('gtin', gtin);
    if (brandName) params.append('brandName', brandName);
    if (modelNumber) params.append('modelNumber', modelNumber);
    if (name) params.append('name', name);

    const res = await fetch(`${API_BASE_URL}/Products/check-duplicate?${params.toString()}`);
    if (!res.ok) return null;
    const json: ApiResponse<DuplicateCheckResult> = await res.json();
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
}): Promise<ProductSearchResult | null> {
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
    const json: ApiResponse<ProductSearchResult> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to create global product:', error);
    return null;
  }
}

// ── STORE INVENTORY MANAGEMENT API METHODS ──

export async function getStoreInventory(storeId: string, search?: string): Promise<StoreInventoryItem[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/Stores/${storeId}/Inventory?${params.toString()}`);
    if (!res.ok) return [];
    const json: ApiResponse<StoreInventoryItem[]> = await res.json();
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
}): Promise<StoreInventoryItem | null> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Stores/${storeId}/Inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) return null;
    const json: ApiResponse<StoreInventoryItem> = await res.json();
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
}): Promise<StoreInventoryItem | null> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) return null;
    const json: ApiResponse<StoreInventoryItem> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Failed to update store inventory:', error);
    return null;
  }
}

export async function deleteStoreInventory(storeId: string, inventoryId: string): Promise<boolean> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to delete store inventory:', error);
    return false;
  }
}

export async function reserveInventoryHold(storeId: string, inventoryId: string, quantity = 1): Promise<{
  success: boolean;
  hold?: InventoryHoldDto;
  error?: string;
}> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });

    const json: ApiResponse<InventoryHoldDto> = await res.json();
    if (res.ok && json.success) {
      return { success: true, hold: json.data };
    }
    return { success: false, error: json.message || 'Failed to reserve hold' };
  } catch (error) {
    console.error('Failed to reserve inventory hold:', error);
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
}

export async function releaseInventoryHold(storeId: string, inventoryId: string, holdId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/Stores/${storeId}/Inventory/${inventoryId}/holds/${holdId}/release`, {
      method: 'POST'
    });

    const json: ApiResponse<boolean> = await res.json();
    if (res.ok && json.success) {
      return { success: true };
    }
    return { success: false, error: json.message || 'Failed to release hold pass' };
  } catch (error) {
    console.error('Failed to release inventory hold:', error);
    return { success: false, error: 'Unable to connect to server.' };
  }
}

export async function fetchMyActiveHolds(): Promise<InventoryHoldDto[]> {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/holds/my-holds`);
    if (!res.ok) return [];
    const json: ApiResponse<InventoryHoldDto[]> = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function becomeVendor(): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
  try {
    const isNative = Capacitor.isNativePlatform();
    const res = await authenticatedFetch(`${API_BASE_URL}/Auth/become-vendor`, {
      method: 'POST'
    });
    const json: ApiResponse<AuthResponse> = await res.json();
    if (res.ok && json.success && json.data) {
      localStorage.setItem('zooner_token', json.data.accessToken);
      if (isNative && json.data.refreshToken) {
        localStorage.setItem('zooner_refresh_token', json.data.refreshToken);
      } else {
        localStorage.removeItem('zooner_refresh_token');
      }
      if (json.data.user) {
        localStorage.setItem('zooner_user', JSON.stringify(json.data.user));
      }
      await syncUserProfile();
      return { success: true, data: json.data };
    }
    return { success: false, error: json.message || 'Failed to activate vendor capability.' };
  } catch (error) {
    console.error('becomeVendor error:', error);
    return { success: false, error: 'Network error activating vendor capability.' };
  }
}



