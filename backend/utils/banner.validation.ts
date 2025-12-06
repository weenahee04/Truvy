// =====================================================
// US PRIME - Banner Validation Utilities
// Used by both Frontend and Backend
// =====================================================

import {
  BannerPosition,
  BANNER_POSITIONS,
  FILE_LIMITS,
  FileValidationResult,
  FileValidationError
} from '../types/banner.types';

// =====================================================
// 1. FILE TYPE VALIDATION
// =====================================================

export function validateFileType(
  mimeType: string,
  allowedTypes: string[] = FILE_LIMITS.ALLOWED_TYPES
): FileValidationError | null {
  if (!allowedTypes.includes(mimeType)) {
    return {
      type: 'format',
      message: 'รูปแบบไฟล์ไม่ถูกต้อง',
      expected: allowedTypes.join(', '),
      actual: mimeType
    };
  }
  return null;
}

// =====================================================
// 2. FILE SIZE VALIDATION
// =====================================================

export function validateFileSize(
  sizeBytes: number,
  maxSizeBytes: number = FILE_LIMITS.MAX_SIZE_BYTES
): FileValidationError | null {
  if (sizeBytes > maxSizeBytes) {
    return {
      type: 'size',
      message: 'ขนาดไฟล์ใหญ่เกินไป',
      expected: `ไม่เกิน ${formatBytes(maxSizeBytes)}`,
      actual: formatBytes(sizeBytes)
    };
  }
  return null;
}

// =====================================================
// 3. IMAGE DIMENSIONS VALIDATION
// =====================================================

export function validateImageDimensions(
  width: number,
  height: number,
  requiredWidth: number,
  requiredHeight: number,
  strict: boolean = true
): FileValidationError | null {
  if (strict) {
    // Exact match required
    if (width !== requiredWidth || height !== requiredHeight) {
      return {
        type: 'dimensions',
        message: 'ขนาดรูปภาพไม่ตรงกับที่กำหนด',
        expected: `${requiredWidth} x ${requiredHeight} px`,
        actual: `${width} x ${height} px`
      };
    }
  } else {
    // Check aspect ratio instead
    const expectedRatio = requiredWidth / requiredHeight;
    const actualRatio = width / height;
    const tolerance = 0.01; // 1% tolerance
    
    if (Math.abs(expectedRatio - actualRatio) > tolerance) {
      return {
        type: 'aspect_ratio',
        message: 'สัดส่วนรูปภาพไม่ถูกต้อง',
        expected: `${requiredWidth}:${requiredHeight}`,
        actual: `${width}:${height}`
      };
    }
  }
  return null;
}

// =====================================================
// 4. COMPLETE FILE VALIDATION
// =====================================================

export async function validateBannerFile(
  file: File,
  position: BannerPosition,
  strictDimensions: boolean = true
): Promise<FileValidationResult> {
  const errors: FileValidationError[] = [];
  const positionSpec = BANNER_POSITIONS[position];
  
  // 1. Validate file type
  const typeError = validateFileType(file.type);
  if (typeError) errors.push(typeError);
  
  // 2. Validate file size
  const sizeError = validateFileSize(file.size);
  if (sizeError) errors.push(sizeError);
  
  // 3. Get image dimensions and validate (skip for SVG)
  let width: number | undefined;
  let height: number | undefined;
  
  // Skip dimension check for SVG files
  const isSvg = file.type === 'image/svg+xml';
  
  if (!isSvg) {
    try {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
      
      const dimensionError = validateImageDimensions(
        width,
        height,
        positionSpec.width,
        positionSpec.height,
        strictDimensions
      );
      if (dimensionError) errors.push(dimensionError);
    } catch (err) {
      errors.push({
        type: 'format',
        message: 'ไม่สามารถอ่านไฟล์รูปภาพได้'
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    file_info: {
      name: file.name,
      size: file.size,
      type: file.type,
      width,
      height
    }
  };
}

// =====================================================
// 5. BACKEND FILE VALIDATION (Buffer)
// =====================================================

export function validateBannerBuffer(
  buffer: Buffer,
  mimeType: string,
  position: BannerPosition
): { typeError: FileValidationError | null; sizeError: FileValidationError | null } {
  const typeError = validateFileType(mimeType);
  const sizeError = validateFileSize(buffer.length);
  
  return { typeError, sizeError };
}

// =====================================================
// 6. HELPER FUNCTIONS
// =====================================================

/**
 * Get image dimensions from a File object (browser)
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Generate unique filename for upload
 */
export function generateUniqueFilename(
  originalFilename: string,
  position: BannerPosition
): string {
  const ext = originalFilename.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${position}/${timestamp}-${random}.${ext}`;
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if position allows multiple banners
 */
export function positionAllowsMultiple(position: BannerPosition): boolean {
  return BANNER_POSITIONS[position]?.allow_multiple ?? false;
}

/**
 * Get max items for a position
 */
export function getPositionMaxItems(position: BannerPosition): number {
  return BANNER_POSITIONS[position]?.max_items ?? 1;
}

/**
 * Get required dimensions for a position
 */
export function getPositionDimensions(position: BannerPosition): { width: number; height: number } {
  const spec = BANNER_POSITIONS[position];
  return {
    width: spec?.width ?? 1920,
    height: spec?.height ?? 600
  };
}

// =====================================================
// 7. VALIDATION RULES SUMMARY
// =====================================================

export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 255
  },
  description: {
    required: false,
    maxLength: 1000
  },
  alt_text: {
    required: false,
    maxLength: 500
  },
  link_url: {
    required: false,
    maxLength: 2000,
    pattern: /^(\/|https?:\/\/)/  // Must start with / or http(s)://
  }
};

/**
 * Validate banner form data (excluding file)
 */
export function validateBannerFormData(data: {
  name?: string;
  description?: string;
  alt_text?: string;
  link_url?: string;
  link_type?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'กรุณากรอกชื่อแบนเนอร์';
  } else if (data.name.length > VALIDATION_RULES.name.maxLength) {
    errors.name = `ชื่อต้องไม่เกิน ${VALIDATION_RULES.name.maxLength} ตัวอักษร`;
  }
  
  // Description validation
  if (data.description && data.description.length > VALIDATION_RULES.description.maxLength) {
    errors.description = `คำอธิบายต้องไม่เกิน ${VALIDATION_RULES.description.maxLength} ตัวอักษร`;
  }
  
  // Alt text validation
  if (data.alt_text && data.alt_text.length > VALIDATION_RULES.alt_text.maxLength) {
    errors.alt_text = `Alt text ต้องไม่เกิน ${VALIDATION_RULES.alt_text.maxLength} ตัวอักษร`;
  }
  
  // Link URL validation
  if (data.link_url && data.link_type !== 'none') {
    if (data.link_url.length > VALIDATION_RULES.link_url.maxLength) {
      errors.link_url = `URL ต้องไม่เกิน ${VALIDATION_RULES.link_url.maxLength} ตัวอักษร`;
    } else if (!VALIDATION_RULES.link_url.pattern.test(data.link_url)) {
      errors.link_url = 'URL ต้องขึ้นต้นด้วย / หรือ http:// หรือ https://';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
