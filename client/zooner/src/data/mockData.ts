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

export const PHYSICAL_STORES: Store[] = [
  {
    id: 'store-nike-dbroad',
    name: 'Nike Store · DB Road',
    category: 'Footwear & Sports',
    area: 'RS Puram',
    distance: '350m',
    rating: 4.9,
    verified: true,
    openStatus: 'Open until 9:30 PM',
    address: '142 DB Road, RS Puram, Coimbatore - 641002',
    featuredProductsCount: 184,
    tags: ['Sneakers', 'Running Shoes', 'Sportswear', 'Air Max'],
    avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
    lat: 11.0125,
    lng: 76.9512
  },
  {
    id: 'store-titan-world',
    name: 'Titan World · Cross Cut Road',
    category: 'Watches & Jewelry',
    area: 'Gandhipuram',
    distance: '1.2 km',
    rating: 4.8,
    verified: true,
    openStatus: 'Open until 9:00 PM',
    address: '88 Cross Cut Road, Gandhipuram, Coimbatore - 641012',
    featuredProductsCount: 96,
    tags: ['Edge Ceramic', 'Raga', 'Smartwatches', 'Fastrack'],
    avatarUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80',
    lat: 11.0183,
    lng: 76.9644
  },
  {
    id: 'store-philips-smart',
    name: 'Philips Smart Lighting Gallery',
    category: 'Smart Home & Lighting',
    area: 'Race Course',
    distance: '850m',
    rating: 4.7,
    verified: true,
    openStatus: 'Open until 8:30 PM',
    address: '24 Race Course Road, Coimbatore - 641018',
    featuredProductsCount: 64,
    tags: ['Hue Smart Bulbs', 'Ambient Strip Lights', 'Downlights', 'Ceiling Fixtures'],
    avatarUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&q=80',
    lat: 11.0028,
    lng: 76.9715
  },
  {
    id: 'store-croma-rspuram',
    name: 'Croma Electronics · RS Puram',
    category: 'Electronics & Gadgets',
    area: 'RS Puram',
    distance: '500m',
    rating: 4.8,
    verified: true,
    openStatus: 'Open until 10:00 PM',
    address: '76 Thiruvenkataswamy Road, RS Puram, Coimbatore - 641002',
    featuredProductsCount: 320,
    tags: ['iPhone 16', 'MacBook M3', 'Sony Headphones', 'Smart TVs'],
    avatarUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80',
    lat: 11.0168,
    lng: 76.9558
  },
  {
    id: 'store-linen-club',
    name: 'Linen Club Boutique',
    category: 'Fashion & Apparel',
    area: 'DB Road',
    distance: '400m',
    rating: 4.9,
    verified: true,
    openStatus: 'Open until 9:00 PM',
    address: '92 DB Road, RS Puram, Coimbatore - 641002',
    featuredProductsCount: 142,
    tags: ['Pure Linen Shirts', 'Kurtas', 'Trousers', 'Suits'],
    avatarUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80',
    lat: 11.0135,
    lng: 76.9520
  },
  {
    id: 'store-sony-center',
    name: 'Sony Center Audio Hub',
    category: 'Electronics & Gadgets',
    area: 'Gandhipuram',
    distance: '1.4 km',
    rating: 4.9,
    verified: true,
    openStatus: 'Open until 9:30 PM',
    address: '112 100 Feet Road, Gandhipuram, Coimbatore - 641012',
    featuredProductsCount: 88,
    tags: ['WH-1000XM5', 'Bravia OLED', 'PlayStation 5', 'Alpha Cameras'],
    avatarUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    lat: 11.0195,
    lng: 76.9660
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-nike-airmax',
    name: 'Nike Air Max 270 (UK 9)',
    category: 'Footwear & Sports',
    price: 6499,
    originalPrice: 7995,
    storeName: 'Nike Store · DB Road',
    storeArea: 'RS Puram',
    distance: '350m',
    inStock: true,
    stockCount: 2,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 42,
    offerTag: '₹1,496 OFF',
    badge: 'Trending'
  },
  {
    id: 'prod-titan-edge',
    name: 'Titan Edge Ceramic Slim Watch',
    category: 'Watches & Jewelry',
    price: 18995,
    originalPrice: 21995,
    storeName: 'Titan World · Cross Cut Road',
    storeArea: 'Gandhipuram',
    distance: '1.2 km',
    inStock: true,
    stockCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 29,
    offerTag: 'Direct Store Deal',
    badge: 'Exclusive'
  },
  {
    id: 'prod-philips-hue',
    name: 'Philips Smart Hue Starter Kit (3 Bulbs + Hub)',
    category: 'Smart Home & Lighting',
    price: 8499,
    originalPrice: 9999,
    storeName: 'Philips Smart Lighting Gallery',
    storeArea: 'Race Course',
    distance: '850m',
    inStock: true,
    stockCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 18,
    offerTag: 'In Stock',
    badge: 'New Arrival'
  },
  {
    id: 'prod-sony-xm5',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    category: 'Electronics & Gadgets',
    price: 26990,
    originalPrice: 34990,
    storeName: 'Sony Center Audio Hub',
    storeArea: 'Gandhipuram',
    distance: '1.4 km',
    inStock: true,
    stockCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 64,
    offerTag: 'Special In-Store Price',
    badge: 'Trending'
  },
  {
    id: 'prod-linen-shirt',
    name: 'Pure Linen Mandarin Collar Shirt (Size 42)',
    category: 'Fashion & Apparel',
    price: 1899,
    originalPrice: 2499,
    storeName: 'Linen Club Boutique',
    storeArea: 'DB Road',
    distance: '400m',
    inStock: true,
    stockCount: 7,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 31,
    offerTag: '₹600 OFF',
    badge: 'Exclusive'
  },
  {
    id: 'prod-iphone-16',
    name: 'Apple iPhone 16 Pro 256GB Natural Titanium',
    category: 'Electronics & Gadgets',
    price: 129900,
    originalPrice: 134900,
    storeName: 'Croma Electronics · RS Puram',
    storeArea: 'RS Puram',
    distance: '500m',
    inStock: true,
    stockCount: 3,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 95,
    offerTag: 'Hold Available',
    badge: 'Trending'
  }
];

export const SAMPLE_RETAILER_RESPONSES: RetailerResponse[] = [
  {
    id: 'resp-1',
    storeName: 'Nike Store · DB Road',
    storeArea: 'RS Puram',
    distance: '350m',
    price: 6499,
    available: true,
    conditionNote: 'In stock! We have 2 pairs in UK 9. Reserved 1 pair for 30 mins — walk in anytime!',
    rating: 4.9,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'resp-2',
    storeName: 'Sprint Sports Hub',
    storeArea: 'Race Course',
    distance: '900m',
    price: 6299,
    available: true,
    conditionNote: 'In stock in Black and White colorways. We can hold it for 2 hours for you.',
    rating: 4.8,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=120&q=80',
  }
];

