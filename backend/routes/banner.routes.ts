// =====================================================
// US PRIME - Banner API Routes (Express.js)
// =====================================================

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import {
  Banner,
  BannerPosition,
  CreateBannerRequest,
  UpdateBannerRequest,
  GetBannersQuery,
  ApiResponse,
  PaginatedResponse,
  GetBannersResponse,
  BANNER_POSITIONS,
  FILE_LIMITS,
  ERROR_CODES
} from '../types/banner.types';
import {
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  generateUniqueFilename,
  validateBannerFormData,
  getPositionDimensions,
  getPositionMaxItems
} from '../utils/banner.validation';

const router = express.Router();

// =====================================================
// 1. SUPABASE CLIENT SETUP
// =====================================================

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
);

// =====================================================
// 2. MULTER CONFIGURATION (File Upload)
// =====================================================

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (FILE_LIMITS.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${FILE_LIMITS.ALLOWED_TYPES.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_LIMITS.MAX_SIZE_BYTES
  }
});

// =====================================================
// 3. MIDDLEWARE: Auth Check
// =====================================================

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: [{ field: 'auth', message: 'Missing token', code: ERROR_CODES.UNAUTHORIZED }]
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        errors: [{ field: 'auth', message: 'Invalid or expired token', code: ERROR_CODES.UNAUTHORIZED }]
      });
    }

    // Check admin role (you can customize this based on your auth setup)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        errors: [{ field: 'auth', message: 'Admin access required', code: ERROR_CODES.FORBIDDEN }]
      });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// =====================================================
// 4. GET /admin/banners - List all banners
// =====================================================

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      position,
      is_active,
      page = 1,
      limit = 50,
      sort_by = 'sort_order',
      sort_order = 'asc'
    } = req.query as unknown as GetBannersQuery;

    // Build query
    let query = supabase
      .from('banners')
      .select('*', { count: 'exact' });

    // Filters
    if (position) {
      query = query.eq('position', position);
    }
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active);
    }

    // Sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Pagination
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data: banners, count, error } = await query;

    if (error) throw error;

    // Get size specs
    const { data: sizeSpecs } = await supabase
      .from('banner_size_specs')
      .select('*');

    const sizeSpecsMap: Record<string, any> = {};
    sizeSpecs?.forEach(spec => {
      sizeSpecsMap[spec.position] = spec;
    });

    const response: GetBannersResponse = {
      success: true,
      data: banners || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        total_pages: Math.ceil((count || 0) / Number(limit))
      },
      size_specs: sizeSpecsMap as any
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 5. GET /admin/banners/:id - Get single banner
// =====================================================

router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: banner, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
        errors: [{ field: 'id', message: 'Banner not found', code: ERROR_CODES.BANNER_NOT_FOUND }]
      });
    }

    // Get size spec
    const { data: sizeSpec } = await supabase
      .from('banner_size_specs')
      .select('*')
      .eq('position', banner.position)
      .single();

    res.json({
      success: true,
      data: banner,
      size_spec: sizeSpec
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 6. POST /admin/banners - Create new banner
// =====================================================

router.post('/', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const body: CreateBannerRequest = req.body;

    // Validate required fields
    const formValidation = validateBannerFormData(body);
    if (!formValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.entries(formValidation.errors).map(([field, message]) => ({
          field,
          message,
          code: ERROR_CODES.MISSING_REQUIRED_FIELD
        }))
      });
    }

    // Validate position
    if (!body.position || !BANNER_POSITIONS[body.position]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid position',
        errors: [{ field: 'position', message: 'Invalid banner position', code: ERROR_CODES.INVALID_POSITION }]
      });
    }

    // Check position limit
    const { count: existingCount } = await supabase
      .from('banners')
      .select('*', { count: 'exact', head: true })
      .eq('position', body.position)
      .eq('is_active', true);

    const maxItems = getPositionMaxItems(body.position);
    if ((existingCount || 0) >= maxItems) {
      return res.status(400).json({
        success: false,
        message: 'Position limit reached',
        errors: [{
          field: 'position',
          message: `ตำแหน่งนี้รองรับได้สูงสุด ${maxItems} แบนเนอร์`,
          code: ERROR_CODES.POSITION_LIMIT_REACHED
        }]
      });
    }

    // Validate file exists
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required',
        errors: [{ field: 'image', message: 'กรุณาอัปโหลดรูปภาพ', code: ERROR_CODES.MISSING_REQUIRED_FIELD }]
      });
    }

    // Validate file type
    const typeError = validateFileType(file.mimetype);
    if (typeError) {
      return res.status(400).json({
        success: false,
        message: typeError.message,
        errors: [{ field: 'image', message: typeError.message, code: ERROR_CODES.INVALID_FILE_TYPE }]
      });
    }

    // Validate file size
    const sizeError = validateFileSize(file.size);
    if (sizeError) {
      return res.status(400).json({
        success: false,
        message: sizeError.message,
        errors: [{ field: 'image', message: sizeError.message, code: ERROR_CODES.FILE_TOO_LARGE }]
      });
    }

    // Get image dimensions using sharp
    const metadata = await sharp(file.buffer).metadata();
    const requiredDimensions = getPositionDimensions(body.position);

    const dimensionError = validateImageDimensions(
      metadata.width || 0,
      metadata.height || 0,
      requiredDimensions.width,
      requiredDimensions.height,
      false // Allow aspect ratio matching
    );

    if (dimensionError) {
      return res.status(400).json({
        success: false,
        message: dimensionError.message,
        errors: [{
          field: 'image',
          message: `${dimensionError.message} (ต้องการ: ${dimensionError.expected}, ได้รับ: ${dimensionError.actual})`,
          code: ERROR_CODES.INVALID_DIMENSIONS
        }]
      });
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.originalname, body.position);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        errors: [{ field: 'image', message: uploadError.message, code: ERROR_CODES.UPLOAD_FAILED }]
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('banners')
      .getPublicUrl(filename);

    // Create banner record
    const bannerId = uuidv4();
    const { data: banner, error: insertError } = await supabase
      .from('banners')
      .insert({
        id: bannerId,
        name: body.name,
        description: body.description || null,
        position: body.position,
        image_url: publicUrl,
        image_filename: filename,
        image_size_bytes: file.size,
        image_width: metadata.width,
        image_height: metadata.height,
        alt_text: body.alt_text || body.name,
        link_url: body.link_url || null,
        link_type: body.link_type || 'none',
        open_in_new_tab: body.open_in_new_tab || false,
        is_active: body.is_active ?? true,
        sort_order: body.sort_order ?? (existingCount || 0) + 1,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        created_by: (req as any).user.id,
        updated_by: (req as any).user.id
      })
      .select()
      .single();

    if (insertError) {
      // Rollback: delete uploaded file
      await supabase.storage.from('banners').remove([filename]);
      throw insertError;
    }

    // Log the action
    await supabase.from('banner_upload_logs').insert({
      banner_id: bannerId,
      action: 'create',
      new_image_url: publicUrl,
      performed_by: (req as any).user.id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner created successfully'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 7. PUT /admin/banners/:id - Update banner
// =====================================================

router.put('/:id', requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const body: UpdateBannerRequest = req.body;

    // Get existing banner
    const { data: existingBanner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
        errors: [{ field: 'id', message: 'Banner not found', code: ERROR_CODES.BANNER_NOT_FOUND }]
      });
    }

    // Validate form data if provided
    if (body.name !== undefined) {
      const formValidation = validateBannerFormData(body);
      if (!formValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: Object.entries(formValidation.errors).map(([field, message]) => ({
            field,
            message,
            code: ERROR_CODES.MISSING_REQUIRED_FIELD
          }))
        });
      }
    }

    let imageUrl = existingBanner.image_url;
    let imageFilename = existingBanner.image_filename;
    let imageSize = existingBanner.image_size_bytes;
    let imageWidth = existingBanner.image_width;
    let imageHeight = existingBanner.image_height;
    let oldImageFilename = null;

    // Handle new image upload
    if (file) {
      // Validate file
      const typeError = validateFileType(file.mimetype);
      if (typeError) {
        return res.status(400).json({
          success: false,
          message: typeError.message,
          errors: [{ field: 'image', message: typeError.message, code: ERROR_CODES.INVALID_FILE_TYPE }]
        });
      }

      const sizeError = validateFileSize(file.size);
      if (sizeError) {
        return res.status(400).json({
          success: false,
          message: sizeError.message,
          errors: [{ field: 'image', message: sizeError.message, code: ERROR_CODES.FILE_TOO_LARGE }]
        });
      }

      // Check dimensions
      const metadata = await sharp(file.buffer).metadata();
      const requiredDimensions = getPositionDimensions(existingBanner.position);

      const dimensionError = validateImageDimensions(
        metadata.width || 0,
        metadata.height || 0,
        requiredDimensions.width,
        requiredDimensions.height,
        false
      );

      if (dimensionError) {
        return res.status(400).json({
          success: false,
          message: dimensionError.message,
          errors: [{
            field: 'image',
            message: `${dimensionError.message} (ต้องการ: ${dimensionError.expected}, ได้รับ: ${dimensionError.actual})`,
            code: ERROR_CODES.INVALID_DIMENSIONS
          }]
        });
      }

      // Upload new image
      const filename = generateUniqueFilename(file.originalname, existingBanner.position);

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          errors: [{ field: 'image', message: uploadError.message, code: ERROR_CODES.UPLOAD_FAILED }]
        });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filename);

      oldImageFilename = existingBanner.image_filename;
      imageUrl = publicUrl;
      imageFilename = filename;
      imageSize = file.size;
      imageWidth = metadata.width;
      imageHeight = metadata.height;
    }

    // Update banner record
    const { data: banner, error: updateError } = await supabase
      .from('banners')
      .update({
        name: body.name ?? existingBanner.name,
        description: body.description ?? existingBanner.description,
        image_url: imageUrl,
        image_filename: imageFilename,
        image_size_bytes: imageSize,
        image_width: imageWidth,
        image_height: imageHeight,
        alt_text: body.alt_text ?? existingBanner.alt_text,
        link_url: body.link_url ?? existingBanner.link_url,
        link_type: body.link_type ?? existingBanner.link_type,
        open_in_new_tab: body.open_in_new_tab ?? existingBanner.open_in_new_tab,
        is_active: body.is_active ?? existingBanner.is_active,
        sort_order: body.sort_order ?? existingBanner.sort_order,
        start_date: body.start_date ?? existingBanner.start_date,
        end_date: body.end_date ?? existingBanner.end_date,
        updated_by: (req as any).user.id
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Delete old image if new one was uploaded
    if (oldImageFilename) {
      await supabase.storage.from('banners').remove([oldImageFilename]);
    }

    // Log the action
    await supabase.from('banner_upload_logs').insert({
      banner_id: id,
      action: 'update',
      old_image_url: file ? existingBanner.image_url : null,
      new_image_url: file ? imageUrl : null,
      performed_by: (req as any).user.id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 8. DELETE /admin/banners/:id - Delete banner
// =====================================================

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query; // ?permanent=true for hard delete

    // Get existing banner
    const { data: existingBanner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
        errors: [{ field: 'id', message: 'Banner not found', code: ERROR_CODES.BANNER_NOT_FOUND }]
      });
    }

    if (permanent === 'true') {
      // Hard delete: remove from storage and database
      if (existingBanner.image_filename) {
        await supabase.storage.from('banners').remove([existingBanner.image_filename]);
      }

      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } else {
      // Soft delete: just deactivate
      const { error: updateError } = await supabase
        .from('banners')
        .update({ is_active: false, updated_by: (req as any).user.id })
        .eq('id', id);

      if (updateError) throw updateError;
    }

    // Log the action
    await supabase.from('banner_upload_logs').insert({
      banner_id: permanent === 'true' ? null : id,
      action: permanent === 'true' ? 'delete' : 'deactivate',
      old_image_url: existingBanner.image_url,
      performed_by: (req as any).user.id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: { id },
      message: permanent === 'true' ? 'Banner deleted permanently' : 'Banner deactivated'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 9. PATCH /admin/banners/:id/toggle - Toggle active status
// =====================================================

router.patch('/:id/toggle', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get existing banner
    const { data: existingBanner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
        errors: [{ field: 'id', message: 'Banner not found', code: ERROR_CODES.BANNER_NOT_FOUND }]
      });
    }

    const newStatus = !existingBanner.is_active;

    const { data: banner, error: updateError } = await supabase
      .from('banners')
      .update({
        is_active: newStatus,
        updated_by: (req as any).user.id
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      data: banner,
      message: `Banner ${newStatus ? 'activated' : 'deactivated'}`
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle banner',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 10. PATCH /admin/banners/reorder - Reorder banners
// =====================================================

router.patch('/reorder', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { position, banner_ids } = req.body;

    if (!position || !banner_ids || !Array.isArray(banner_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
        errors: [{ field: 'body', message: 'position and banner_ids are required', code: ERROR_CODES.MISSING_REQUIRED_FIELD }]
      });
    }

    // Update sort_order for each banner
    const updates = banner_ids.map((id: string, index: number) =>
      supabase
        .from('banners')
        .update({ sort_order: index + 1, updated_by: (req as any).user.id })
        .eq('id', id)
        .eq('position', position)
    );

    await Promise.all(updates);

    res.json({
      success: true,
      data: { position, banner_ids },
      message: 'Banners reordered successfully'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to reorder banners',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

// =====================================================
// 11. GET /admin/banners/size-specs - Get all size specs
// =====================================================

router.get('/size-specs', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: sizeSpecs, error } = await supabase
      .from('banner_size_specs')
      .select('*')
      .order('position');

    if (error) throw error;

    res.json({
      success: true,
      data: sizeSpecs
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch size specs',
      errors: [{ field: 'server', message: err.message, code: 'SERVER_ERROR' }]
    });
  }
});

export default router;
