import type { Product, Store, LocationArea, RetailerResponse } from '../types';

export const LOCATIONS: LocationArea[] = [
  { id: 'rs-puram', name: 'RS Puram', city: 'Coimbatore', storesCount: 0, activeRequests: 0 },
  { id: 'race-course', name: 'Race Course', city: 'Coimbatore', storesCount: 0, activeRequests: 0 },
  { id: 'gandhipuram', name: 'Gandhipuram', city: 'Coimbatore', storesCount: 0, activeRequests: 0 },
  { id: 'peelamedu', name: 'Peelamedu / Avinashi Rd', city: 'Coimbatore', storesCount: 0, activeRequests: 0 },
  { id: 'saibaba-colony', name: 'Saibaba Colony', city: 'Coimbatore', storesCount: 0, activeRequests: 0 },
  { id: 'saravanampatti', name: 'Saravanampatti', city: 'Coimbatore', storesCount: 0, activeRequests: 0 }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Nearby', icon: 'Sparkles' },
  { id: 'running-shoes', label: 'Running Shoes', icon: 'Footprints' },
  { id: 'mens-shirts', label: "Men's Shirts", icon: 'Shirt' },
  { id: 'smartphones', label: 'Smartphones', icon: 'Smartphone' },
  { id: 'home-decor', label: 'Home Decor', icon: 'Home' },
  { id: 'beauty-products', label: 'Beauty Products', icon: 'Sparkle' },
  { id: 'sports', label: 'Sports Gear', icon: 'Dumbbell' },
  { id: 'grocery', label: 'Artisan Grocery', icon: 'ShoppingBag' }
];

export const PRODUCTS: Product[] = [];

export const PHYSICAL_STORES: Store[] = [];

export const SAMPLE_RETAILER_RESPONSES: RetailerResponse[] = [];
