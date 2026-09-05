import type { Product, Store, LocationArea, RetailerResponse } from '../types';

export const DEFAULT_LOCATION: LocationArea = {
  id: 'cbe-rspuram',
  name: 'RS Puram, Coimbatore',
  city: 'Coimbatore',
  storesCount: 48,
  activeRequests: 14,
  lat: 11.0168,
  lng: 76.9558
};

export const LOCATIONS: LocationArea[] = [
  { id: 'cbe-rspuram', name: 'RS Puram, Coimbatore', city: 'Coimbatore', storesCount: 48, activeRequests: 14, lat: 11.0168, lng: 76.9558 },
  { id: 'cbe-dbroad', name: 'DB Road, Coimbatore', city: 'Coimbatore', storesCount: 62, activeRequests: 21, lat: 11.0125, lng: 76.9512 },
  { id: 'cbe-racecourse', name: 'Race Course, Coimbatore', city: 'Coimbatore', storesCount: 35, activeRequests: 9, lat: 11.0028, lng: 76.9715 },
  { id: 'cbe-gandhipuram', name: 'Gandhipuram, Coimbatore', city: 'Coimbatore', storesCount: 84, activeRequests: 32, lat: 11.0183, lng: 76.9644 },
  { id: 'cbe-peelamedu', name: 'Peelamedu, Coimbatore', city: 'Coimbatore', storesCount: 41, activeRequests: 11, lat: 11.0264, lng: 77.0121 },
  { id: 'cbe-saibaba', name: 'Saibaba Colony, Coimbatore', city: 'Coimbatore', storesCount: 29, activeRequests: 8, lat: 11.0321, lng: 76.9452 }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Nearby', icon: 'Sparkles' },
  { id: 'footwear', label: 'Footwear & Sports', icon: 'Footprints' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: 'Shirt' },
  { id: 'electronics', label: 'Electronics & Gadgets', icon: 'Smartphone' },
  { id: 'watches', label: 'Watches & Jewelry', icon: 'Watch' },
  { id: 'home', label: 'Smart Home & Lighting', icon: 'Home' },
  { id: 'beauty', label: 'Beauty & Wellness', icon: 'Sparkle' },
  { id: 'grocery', label: 'Artisan Grocery', icon: 'ShoppingBag' }
];

export const PHYSICAL_STORES: Store[] = [];

export const PRODUCTS: Product[] = [];

export const SAMPLE_RETAILER_RESPONSES: RetailerResponse[] = [];

