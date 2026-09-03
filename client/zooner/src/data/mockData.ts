import type { Product, Store, LocationArea, RetailerResponse } from '../types';

export const DEFAULT_LOCATION: LocationArea = {
  id: 'live-gps',
  name: 'Current Location (GPS)',
  city: 'Coimbatore',
  storesCount: 0,
  activeRequests: 0,
  lat: 11.0168,
  lng: 76.9558
};

export const LOCATIONS: LocationArea[] = [];

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
