/**
 * Image Upload Service
 * ใช้ ImgBB API สำหรับ upload รูปภาพ (ฟรี)
 */

// ⚠️ ใส่ API Key ของคุณที่นี่
const IMGBB_API_KEY = '68c0cdc353bb383625a3374f8cec0432';

/**
 * ========================================
 * 📐 ขนาดรูปที่แนะนำ
 * ========================================
 * 
 * 🎨 SVG: ไม่ต้องกำหนดขนาด (Vector ปรับขนาดได้อัตโนมัติ)
 * 
 * 🖼️ รูปอื่นๆ (PNG, JPG, WebP):
 *    - Hero Desktop: 1920 x 600 px
 *    - Hero Mobile:  1080 x 1080 px
 *    - Promo Carousel: 1600 x 600 px
 *    - Special Banner: 1200 x 400 px
 *    - Lotto Banner: 1200 x 500 px
 *    - Footer Banner: 1920 x 300 px
 *    - Category Card: 800 x 500 px
 * 
 * 📋 ขนาดไฟล์: ไม่เกิน 10MB
 * ========================================
 */

export const REQUIRED_SIZES = {
  HERO_DESKTOP: { width: 1920, height: 600, description: 'Hero Banner Desktop' },
  HERO_MOBILE: { width: 1080, height: 1080, description: 'Hero Banner Mobile' },
  PROMO_CAROUSEL: { width: 1600, height: 600, description: 'Promo Carousel' },
  SPECIAL_BANNER: { width: 1200, height: 400, description: 'Special Banner' },
  LOTTO_BANNER: { width: 1200, height: 500, description: 'Lotto Banner' },
  FOOTER_BANNER: { width: 1920, height: 300, description: 'Footer Banner' },
  CATEGORY_CARD: { width: 800, height: 500, description: 'Category Card' },
};

export type ImageSpecType = keyof typeof REQUIRED_SIZES;

export interface UploadResult {
  success: boolean;
  url?: string;
  deleteUrl?: string;
  error?: string;
}

/**
 * Upload รูปภาพไปยัง ImgBB (ไม่มี resize - อัปโหลดตามขนาดเดิม)
 */
export const uploadToImgBB = async (file: File): Promise<UploadResult> => {
  try {
    // ถ้ายังไม่ได้ใส่ API Key ให้ใช้ base64 แทน
    if (!IMGBB_API_KEY || IMGBB_API_KEY.includes('YOUR_')) {
      return await convertToBase64(file);
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        url: data.data.display_url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Upload failed',
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'เกิดข้อผิดพลาดในการอัปโหลด',
    };
  }
};

/**
 * Upload สำหรับ Hero Banner
 */
export const uploadHeroBanner = async (
  file: File,
  type: 'desktop' | 'mobile'
): Promise<UploadResult> => {
  const requiredSize = type === 'desktop' ? REQUIRED_SIZES.HERO_DESKTOP : REQUIRED_SIZES.HERO_MOBILE;
  console.log(`📐 กรุณาใช้รูปขนาด ${requiredSize.width} x ${requiredSize.height} px`);
  return uploadToImgBB(file);
};

/**
 * แปลงไฟล์เป็น Base64 (สำหรับใช้งานแบบไม่ต้องมี API Key)
 */
export const convertToBase64 = (file: File | Blob): Promise<UploadResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result as string,
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'ไม่สามารถอ่านไฟล์ได้',
      });
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Validate ไฟล์ก่อน upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'รองรับเฉพาะไฟล์ JPG, PNG, WebP, GIF, SVG' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' };
  }

  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
