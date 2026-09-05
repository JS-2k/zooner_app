export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  storeArea: string;
  distance: string;
  inStock: boolean;
  stockCount?: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  offerTag?: string;
  badge?: 'Trending' | 'Low Stock' | 'New Arrival' | 'Exclusive';
}

export interface Store {
  id: string;
  name: string;
  category: string;
  area: string;
  distance: string;
  rating: number;
  verified: boolean;
  openStatus: string;
  address: string;
  featuredProductsCount?: number;
  tags: string[];
  avatarUrl?: string;
  lat?: number;
  lng?: number;
}

export interface ProductRequestItem {
  product: string;
  size: string;
  budget: string;
  location: string;
}

export interface RetailerResponse {
  id: string;
  storeName: string;
  storeArea: string;
  distance: string;
  price: number;
  available: boolean;
  conditionNote: string;
  rating: number;
  verified: boolean;
  avatar: string;
}

export interface LocationArea {
  id: string;
  name: string;
  city: string;
  storesCount: number;
  activeRequests: number;
  lat?: number;
  lng?: number;
}
