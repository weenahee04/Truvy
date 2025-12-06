// =====================================================
// US PRIME - Banner Management API Types
// Shared between Frontend and Backend
// =====================================================

// =====================================================
// 1. ENUMS
// =====================================================

export type BannerPosition =
  | 'home_hero'
  | 'home_hero_mobile'
  | 'home_promo_slider'
  | 'home_flash_sale'
  | 'home_us_deals'
  | 'lotto_powerball'
  | 'lotto_megamillions'
  | 'footer_main'
  | 'category_electronics'
  | 'category_fashion'
  | 'category_vitamins';

export type BannerLinkType = 'internal' | 'external' | 'none';

// =====================================================
// 2. DATABASE MODELS
// =====================================================

export interface Banner {
  id: string;
  name: string;
  description: string | null;
  position: BannerPosition;
  
  // Image
  image_url: string;
  image_url_mobile: string | null;
  image_filename: string | null;
  image_size_bytes: number | null;
  image_width: number | null;
  image_height: number | null;
  alt_text: string | null;
  
  // Link
  link_url: string | null;
  link_type: BannerLinkType;
  open_in_new_tab: boolean;
  
  // Display
  is_active: boolean;
  sort_order: number;
  
  // Schedule
  start_date: string | null;
  end_date: string | null;
  
  // Metadata
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BannerSizeSpec {
  id: number;
  position: BannerPosition;
  required_width: number;
  required_height: number;
  max_file_size_bytes: number;
  allowed_formats: string[];
  allow_multiple: boolean;
  max_items: number;
  display_name: string;
  description: string | null;
}

// =====================================================
// 3. API REQUEST TYPES
// =====================================================

// GET /admin/banners query params
export interface GetBannersQuery {
  position?: BannerPosition;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'updated_at' | 'sort_order' | 'name';
  sort_order?: 'asc' | 'desc';
}

// POST /admin/banners body (multipart/form-data)
export interface CreateBannerRequest {
  name: string;
  description?: string;
  position: BannerPosition;
  link_url?: string;
  link_type?: BannerLinkType;
  open_in_new_tab?: boolean;
  alt_text?: string;
  is_active?: boolean;
  sort_order?: number;
  start_date?: string;
  end_date?: string;
  // File will be in multipart form-data as 'image'
}

// PUT /admin/banners/:id body
export interface UpdateBannerRequest {
  name?: string;
  description?: string;
  link_url?: string;
  link_type?: BannerLinkType;
  open_in_new_tab?: boolean;
  alt_text?: string;
  is_active?: boolean;
  sort_order?: number;
  start_date?: string;
  end_date?: string;
  // Optional new image in multipart form-data as 'image'
}

// PATCH /admin/banners/:id/toggle-active
export interface ToggleActiveBannerRequest {
  is_active: boolean;
}

// PATCH /admin/banners/reorder
export interface ReorderBannersRequest {
  position: BannerPosition;
  banner_ids: string[]; // Ordered array of banner IDs
}

// =====================================================
// 4. API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// GET /admin/banners response
export interface GetBannersResponse extends PaginatedResponse<Banner> {
  size_specs: Record<BannerPosition, BannerSizeSpec>;
}

// GET /admin/banners/:id response
export interface GetBannerResponse extends ApiResponse<Banner> {
  size_spec: BannerSizeSpec;
}

// POST /admin/banners response
export interface CreateBannerResponse extends ApiResponse<Banner> {}

// PUT /admin/banners/:id response
export interface UpdateBannerResponse extends ApiResponse<Banner> {}

// DELETE /admin/banners/:id response
export interface DeleteBannerResponse extends ApiResponse<{ id: string }> {}

// GET /admin/banners/size-specs response
export interface GetSizeSpecsResponse extends ApiResponse<BannerSizeSpec[]> {}

// =====================================================
// 5. FILE UPLOAD TYPES
// =====================================================

export interface FileValidationResult {
  valid: boolean;
  errors: FileValidationError[];
  file_info?: {
    name: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
  };
}

export interface FileValidationError {
  type: 'size' | 'format' | 'dimensions' | 'aspect_ratio';
  message: string;
  expected?: string;
  actual?: string;
}

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  mime_type: string;
}

// =====================================================
// 6. CONSTANTS
// =====================================================

export const BANNER_POSITIONS: Record<BannerPosition, {
  display_name: string;
  category: string;
  width: number;
  height: number;
  allow_multiple: boolean;
  max_items: number;
}> = {
  home_hero: {
    display_name: 'Hero Banner (Desktop)',
    category: 'home',
    width: 1920,
    height: 600,
    allow_multiple: false,
    max_items: 1
  },
  home_hero_mobile: {
    display_name: 'Hero Banner (Mobile)',
    category: 'home',
    width: 1080,
    height: 1080,
    allow_multiple: false,
    max_items: 1
  },
  home_promo_slider: {
    display_name: 'Promo Slider',
    category: 'home',
    width: 1600,
    height: 600,
    allow_multiple: true,
    max_items: 5
  },
  home_flash_sale: {
    display_name: 'Flash Sale Banner',
    category: 'home',
    width: 1200,
    height: 400,
    allow_multiple: false,
    max_items: 1
  },
  home_us_deals: {
    display_name: 'US Deals Banner',
    category: 'home',
    width: 1200,
    height: 400,
    allow_multiple: false,
    max_items: 1
  },
  lotto_powerball: {
    display_name: 'Powerball Banner',
    category: 'lotto',
    width: 1200,
    height: 500,
    allow_multiple: false,
    max_items: 1
  },
  lotto_megamillions: {
    display_name: 'Mega Millions Banner',
    category: 'lotto',
    width: 1200,
    height: 500,
    allow_multiple: false,
    max_items: 1
  },
  footer_main: {
    display_name: 'Footer Banner',
    category: 'footer',
    width: 1920,
    height: 300,
    allow_multiple: false,
    max_items: 1
  },
  category_electronics: {
    display_name: 'Electronics Category',
    category: 'category',
    width: 800,
    height: 400,
    allow_multiple: false,
    max_items: 1
  },
  category_fashion: {
    display_name: 'Fashion Category',
    category: 'category',
    width: 800,
    height: 400,
    allow_multiple: false,
    max_items: 1
  },
  category_vitamins: {
    display_name: 'Vitamins Category',
    category: 'category',
    width: 800,
    height: 400,
    allow_multiple: false,
    max_items: 1
  }
};

export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
};

// =====================================================
// 7. ERROR CODES
// =====================================================

export const ERROR_CODES = {
  // Validation
  INVALID_POSITION: 'INVALID_POSITION',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_DIMENSIONS: 'INVALID_DIMENSIONS',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource
  BANNER_NOT_FOUND: 'BANNER_NOT_FOUND',
  POSITION_LIMIT_REACHED: 'POSITION_LIMIT_REACHED',
  
  // Upload
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  
  // Auth
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN'
};
