
export interface Product {
  id: string;
  title: string;
  priceUSD: number;
  priceTHB: number;
  originalPriceTHB?: number;
  image: string;
  rating: number;
  sold: number;
  isFlashSale?: boolean;
  isUSImport?: boolean;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: string;
}

export interface LottoTicket {
  id: number | string;
  numbers: number[];
  special: number;
  type?: 'Powerball' | 'Mega Millions';
  drawDate?: string;
  status?: 'pending' | 'won' | 'lost';
  price?: number;
  multiplier?: boolean;
  purchaseDate?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[] | LottoTicket[];
  total: number;
  status: string;
  type: 'marketplace' | 'lotto';
  paymentMethod: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  role?: UserRole;
}

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

// Notification System
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// CMS Types
export interface Banner {
  id: number | string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

// Hero Display Mode
export type HeroDisplayMode = 'text' | 'image' | 'overlay';

// Overlay Position
export type OverlayPosition = 'left' | 'center' | 'right';

// CTA Button
export interface CTAButton {
  text: string;
  link: string;
  variant: 'primary' | 'secondary' | 'outline';
  show: boolean;
}

export interface HeroContent {
  displayMode: HeroDisplayMode;
  // Text Mode Fields
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  // Image Mode Fields
  bannerImageDesktop?: string;
  bannerImageMobile?: string;
  bannerLink?: string;
  bannerAltText?: string;
  // Overlay Mode Fields (รูป + ข้อความซ้อน)
  overlay?: {
    enabled: boolean;
    position: OverlayPosition;
    backgroundColor: string;
    backgroundOpacity: number;
    showBadge: boolean;
    showTitle: boolean;
    showDescription: boolean;
    textColor: string;
  };
  // CTA Buttons
  ctaButtons?: CTAButton[];
}

export interface SiteContent {
  hero: HeroContent;
  promoBanners: Banner[];
  categoryBanners: Banner[];
}

// ==========================================
// Banner Management System Types
// ==========================================

// Banner Size Specifications (Fixed Sizes)
export interface BannerSizeSpec {
  width: number;
  height: number;
  label: string;
  description: string;
}

export const BANNER_SIZES: Record<string, BannerSizeSpec> = {
  HERO_DESKTOP: { width: 1920, height: 600, label: 'Desktop Hero', description: 'แบนเนอร์หลักหน้าแรก (Desktop)' },
  HERO_MOBILE: { width: 1080, height: 1080, label: 'Mobile Hero', description: 'แบนเนอร์หลักหน้าแรก (Mobile)' },
  PROMO_CAROUSEL: { width: 1600, height: 600, label: 'Promotion Carousel', description: 'แบนเนอร์สไลด์โปรโมชัน' },
  SPECIAL_BANNER: { width: 1200, height: 400, label: 'Special Banner', description: 'แบนเนอร์พิเศษกลางหน้า (Flash Sale, US Deals)' },
  LOTTO_BANNER: { width: 1200, height: 500, label: 'Lotto Banner', description: 'แบนเนอร์หน้า Lotto' },
  FOOTER_BANNER: { width: 1920, height: 300, label: 'Footer Banner', description: 'แบนเนอร์ท้ายเว็บ' },
  CATEGORY_CARD: { width: 800, height: 500, label: 'Category Card', description: 'การ์ดหมวดหมู่สินค้า' },
};

// Banner Position Types
export type BannerPosition =
  | 'HOME_HERO'
  | 'HOME_HERO_MOBILE'
  | 'HOME_PROMO_CAROUSEL'
  | 'HOME_FLASH_SALE'
  | 'HOME_US_DEALS'
  | 'LOTTO_POWERBALL'
  | 'LOTTO_MEGA_MILLIONS'
  | 'FOOTER_MAIN';

// Enhanced Banner with Full Management Features
export interface ManagedBanner {
  id: string;
  position: BannerPosition;
  name: string;
  description: string;
  imageUrl: string;
  imageUrlMobile?: string; // Optional mobile version
  link: string;
  linkType: 'internal' | 'external' | 'none';
  isActive: boolean;
  sizeSpec: keyof typeof BANNER_SIZES;
  order: number; // For carousel/slider ordering
  createdAt: string;
  updatedAt: string;
  altText: string;
}

// Banner Category for Admin Sidebar
export interface BannerCategory {
  id: string;
  name: string;
  icon: string;
  positions: BannerPosition[];
  description: string;
}

// Predefined Banner Categories
export const BANNER_CATEGORIES: BannerCategory[] = [
  {
    id: 'home',
    name: 'หน้าแรก (Home)',
    icon: 'Home',
    positions: ['HOME_HERO', 'HOME_HERO_MOBILE', 'HOME_PROMO_CAROUSEL', 'HOME_FLASH_SALE', 'HOME_US_DEALS'],
    description: 'จัดการแบนเนอร์ทั้งหมดในหน้าแรก'
  },
  {
    id: 'lotto',
    name: 'หน้า Lotto',
    icon: 'Ticket',
    positions: ['LOTTO_POWERBALL', 'LOTTO_MEGA_MILLIONS'],
    description: 'จัดการแบนเนอร์หน้า Powerball และ Mega Millions'
  },
  {
    id: 'footer',
    name: 'Footer Banner',
    icon: 'PanelBottom',
    positions: ['FOOTER_MAIN'],
    description: 'แบนเนอร์ส่วนท้ายของเว็บไซต์'
  }
];

// Banner Position Metadata
export const BANNER_POSITION_META: Record<BannerPosition, {
  name: string;
  description: string;
  sizeSpec: keyof typeof BANNER_SIZES;
  maxItems: number;
  allowMultiple: boolean;
}> = {
  HOME_HERO: {
    name: 'Hero Banner (Desktop)',
    description: 'แบนเนอร์หลักหน้าแรกสำหรับ Desktop',
    sizeSpec: 'HERO_DESKTOP',
    maxItems: 1,
    allowMultiple: false
  },
  HOME_HERO_MOBILE: {
    name: 'Hero Banner (Mobile)',
    description: 'แบนเนอร์หลักหน้าแรกสำหรับ Mobile',
    sizeSpec: 'HERO_MOBILE',
    maxItems: 1,
    allowMultiple: false
  },
  HOME_PROMO_CAROUSEL: {
    name: 'Promo Slider',
    description: 'แบนเนอร์สไลด์โปรโมชัน (สูงสุด 5 รูป)',
    sizeSpec: 'PROMO_CAROUSEL',
    maxItems: 5,
    allowMultiple: true
  },
  HOME_FLASH_SALE: {
    name: 'Flash Sale Banner',
    description: 'แบนเนอร์ Flash Sale กลางหน้า',
    sizeSpec: 'SPECIAL_BANNER',
    maxItems: 1,
    allowMultiple: false
  },
  HOME_US_DEALS: {
    name: 'US Deals Banner',
    description: 'แบนเนอร์ US Deals กลางหน้า',
    sizeSpec: 'SPECIAL_BANNER',
    maxItems: 1,
    allowMultiple: false
  },
  LOTTO_POWERBALL: {
    name: 'Powerball Banner',
    description: 'แบนเนอร์สำหรับ Powerball',
    sizeSpec: 'LOTTO_BANNER',
    maxItems: 1,
    allowMultiple: false
  },
  LOTTO_MEGA_MILLIONS: {
    name: 'Mega Millions Banner',
    description: 'แบนเนอร์สำหรับ Mega Millions',
    sizeSpec: 'LOTTO_BANNER',
    maxItems: 1,
    allowMultiple: false
  },
  FOOTER_MAIN: {
    name: 'Footer Banner',
    description: 'แบนเนอร์ส่วนท้ายเว็บไซต์',
    sizeSpec: 'FOOTER_BANNER',
    maxItems: 1,
    allowMultiple: false
  }
};

// File Validation Constants
export const BANNER_FILE_LIMITS = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  maxSizeMB: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
};

// Validation Error Types
export interface BannerValidationError {
  type: 'size' | 'dimension' | 'format' | 'required';
  message: string;
  expected?: string;
  actual?: string;
}

// Banner Upload State
export interface BannerUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  progress: number;
  errors: BannerValidationError[];
}

// All Site Banners State
export interface AllBannersState {
  banners: ManagedBanner[];
  lastUpdated: string;
}
