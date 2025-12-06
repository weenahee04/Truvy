import React, { useState, useRef, useCallback } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { 
  ManagedBanner, 
  BannerPosition, 
  BANNER_SIZES, 
  BANNER_CATEGORIES, 
  BANNER_POSITION_META,
  BANNER_FILE_LIMITS,
  BannerValidationError,
  HeroDisplayMode
} from '../types';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { uploadHeroBanner, validateImageFile, formatFileSize } from '../services/imageUpload';
import {
  ArrowLeft,
  Home,
  Ticket,
  PanelBottom,
  Image,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Save,
  GripVertical,
  ChevronRight,
  Monitor,
  Smartphone,
  FileImage,
  Info,
  Type,
  ImageIcon,
  Settings,
  Loader2
} from 'lucide-react';

// Helper to get icon component
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Home: <Home size={20} />,
    Ticket: <Ticket size={20} />,
    PanelBottom: <PanelBottom size={20} />
  };
  return icons[iconName] || <Image size={20} />;
};

export const AdminBannerPanel: React.FC = () => {
  const { 
    managedBanners, 
    updateBanner, 
    addBanner, 
    deleteBanner, 
    toggleBannerStatus,
    getBannersByPosition,
    showToast,
    siteContent,
    updateSiteContent
  } = useGlobal();

  // State
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [selectedPosition, setSelectedPosition] = useState<BannerPosition | null>(null);
  const [editingBanner, setEditingBanner] = useState<ManagedBanner | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showHeroSettings, setShowHeroSettings] = useState(false);
  
  // Hero Banner Form State with Overlay support
  const [heroForm, setHeroForm] = useState({
    displayMode: siteContent.hero.displayMode || 'overlay' as HeroDisplayMode,
    badge: siteContent.hero.badge,
    titleLine1: siteContent.hero.titleLine1,
    titleLine2: siteContent.hero.titleLine2,
    description: siteContent.hero.description,
    bannerImageDesktop: siteContent.hero.bannerImageDesktop || '',
    bannerImageMobile: siteContent.hero.bannerImageMobile || '',
    bannerLink: siteContent.hero.bannerLink || '/category/all',
    bannerAltText: siteContent.hero.bannerAltText || '',
    // Overlay Settings
    overlay: siteContent.hero.overlay || {
      enabled: true,
      position: 'center' as const,
      backgroundColor: '#000000',
      backgroundOpacity: 40,
      showBadge: true,
      showTitle: true,
      showDescription: true,
      textColor: '#FFFFFF'
    },
    // CTA Buttons
    ctaButtons: siteContent.hero.ctaButtons || [
      { text: 'ช้อปเลย', link: '/category/all', variant: 'primary' as const, show: true },
      { text: 'วิธีสั่งซื้อ', link: '/how-to', variant: 'outline' as const, show: true }
    ]
  });
  
  // Upload State
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<BannerValidationError[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroIsUploading, setHeroIsUploading] = useState<'desktop' | 'mobile' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroDesktopInputRef = useRef<HTMLInputElement>(null);
  const heroMobileInputRef = useRef<HTMLInputElement>(null);

  // Form State for editing
  const [formData, setFormData] = useState<Partial<ManagedBanner>>({});

  // Get current category's positions
  const currentCategory = BANNER_CATEGORIES.find(c => c.id === activeCategory);
  const positionsInCategory = currentCategory?.positions || [];

  // Validate image dimensions (skip for SVG)
  const validateImageDimensions = (file: File, expectedSize: keyof typeof BANNER_SIZES): Promise<BannerValidationError[]> => {
    return new Promise((resolve) => {
      // Skip dimension check for SVG files
      if (file.type === 'image/svg+xml') {
        resolve([]);
        return;
      }

      const errors: BannerValidationError[] = [];
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const spec = BANNER_SIZES[expectedSize];
        if (img.width !== spec.width || img.height !== spec.height) {
          errors.push({
            type: 'dimension',
            message: `ขนาดรูปไม่ตรงกับที่กำหนด`,
            expected: `${spec.width} x ${spec.height} px`,
            actual: `${img.width} x ${img.height} px`
          });
        }
        URL.revokeObjectURL(url);
        resolve(errors);
      };
      
      img.onerror = () => {
        errors.push({ type: 'format', message: 'ไม่สามารถอ่านไฟล์รูปภาพได้' });
        URL.revokeObjectURL(url);
        resolve(errors);
      };
      
      img.src = url;
    });
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File, sizeSpec: keyof typeof BANNER_SIZES) => {
    const errors: BannerValidationError[] = [];

    // Check file type
    if (!BANNER_FILE_LIMITS.allowedTypes.includes(file.type)) {
      errors.push({
        type: 'format',
        message: 'รูปแบบไฟล์ไม่ถูกต้อง',
        expected: 'JPG, PNG หรือ WebP',
        actual: file.type
      });
    }

    // Check file size
    if (file.size > BANNER_FILE_LIMITS.maxSizeBytes) {
      errors.push({
        type: 'size',
        message: 'ขนาดไฟล์ใหญ่เกินไป',
        expected: `ไม่เกิน ${BANNER_FILE_LIMITS.maxSizeMB} MB`,
        actual: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }

    // Check dimensions
    if (errors.length === 0) {
      const dimensionErrors = await validateImageDimensions(file, sizeSpec);
      errors.push(...dimensionErrors);
    }

    setUploadErrors(errors);

    // Create preview regardless of errors (for visual feedback)
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    return errors.length === 0;
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, sizeSpec: keyof typeof BANNER_SIZES) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file, sizeSpec);
    }
  };

  // Open edit form
  const openEditForm = (banner: ManagedBanner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setUploadPreview(null);
    setUploadErrors([]);
    setIsAddingNew(false);
  };

  // Open add new form
  const openAddNewForm = (position: BannerPosition) => {
    const meta = BANNER_POSITION_META[position];
    const newBanner: Partial<ManagedBanner> = {
      id: `banner-${Date.now()}`,
      position,
      name: '',
      description: '',
      imageUrl: '',
      link: '',
      linkType: 'internal',
      isActive: true,
      sizeSpec: meta.sizeSpec,
      order: getBannersByPosition(position).length + 1,
      altText: ''
    };
    setFormData(newBanner);
    setEditingBanner(null);
    setUploadPreview(null);
    setUploadErrors([]);
    setIsAddingNew(true);
  };

  // Save banner
  const handleSave = () => {
    // Check name and image (either from uploadPreview or existing imageUrl)
    if (!formData.name || (!formData.imageUrl && !uploadPreview)) {
      showToast('กรุณากรอกข้อมูลให้ครบ', 'error');
      return;
    }

    const bannerToSave: ManagedBanner = {
      id: formData.id || `banner-${Date.now()}`,
      position: formData.position as BannerPosition,
      name: formData.name || '',
      description: formData.description || '',
      imageUrl: uploadPreview || formData.imageUrl || '',
      link: formData.link || '',
      linkType: formData.linkType || 'internal',
      isActive: formData.isActive ?? true,
      sizeSpec: formData.sizeSpec as keyof typeof BANNER_SIZES,
      order: formData.order || 1,
      createdAt: editingBanner?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      altText: formData.altText || formData.name || ''
    };

    if (isAddingNew) {
      addBanner(bannerToSave);
    } else {
      updateBanner(bannerToSave);
    }

    setEditingBanner(null);
    setIsAddingNew(false);
    setFormData({});
    setUploadPreview(null);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingBanner(null);
    setIsAddingNew(false);
    setFormData({});
    setUploadPreview(null);
    setUploadErrors([]);
  };

  // Upload Hero Image with Auto-Optimize
  const handleHeroImageUpload = async (file: File, type: 'desktop' | 'mobile') => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'ไฟล์ไม่ถูกต้อง', 'error');
      return;
    }

    setHeroIsUploading(type);
    const originalSize = file.size;
    
    try {
      // ใช้ uploadHeroBanner ที่จะ resize ตาม spec อัตโนมัติ
      const result = await uploadHeroBanner(file, type);
      
      if (result.success && result.url) {
        if (type === 'desktop') {
          setHeroForm(prev => ({ ...prev, bannerImageDesktop: result.url! }));
        } else {
          setHeroForm(prev => ({ ...prev, bannerImageMobile: result.url! }));
        }
        
        // แสดงข้อมูลการ optimize
        const savedPercent = result.optimizedSize 
          ? Math.round((1 - result.optimizedSize / originalSize) * 100)
          : 0;
        const sizeInfo = result.optimizedSize 
          ? ` (${formatFileSize(originalSize)} → ${formatFileSize(result.optimizedSize)}, ประหยัด ${savedPercent}%)`
          : '';
        
        const specLabel = type === 'desktop' ? '1920x600' : '1080x1080';
        showToast(`อัปโหลดสำเร็จ! ปรับขนาดเป็น ${specLabel}${sizeInfo}`, 'success');
      } else {
        showToast(result.error || 'อัปโหลดไม่สำเร็จ', 'error');
      }
    } catch (error) {
      showToast('เกิดข้อผิดพลาดในการอัปโหลด', 'error');
    } finally {
      setHeroIsUploading(null);
    }
  };

  // Save Hero Settings
  const handleSaveHeroSettings = () => {
    updateSiteContent({
      ...siteContent,
      hero: {
        displayMode: heroForm.displayMode,
        badge: heroForm.badge,
        titleLine1: heroForm.titleLine1,
        titleLine2: heroForm.titleLine2,
        description: heroForm.description,
        bannerImageDesktop: heroForm.bannerImageDesktop,
        bannerImageMobile: heroForm.bannerImageMobile,
        bannerLink: heroForm.bannerLink,
        bannerAltText: heroForm.bannerAltText,
        overlay: heroForm.overlay,
        ctaButtons: heroForm.ctaButtons
      }
    });
    showToast('บันทึกการตั้งค่า Hero สำเร็จ!', 'success');
    setShowHeroSettings(false);
  };

  // Delete banner
  const handleDelete = (bannerId: string) => {
    deleteBanner(bannerId);
    setShowDeleteConfirm(null);
  };

  // Render banner list for a position
  const renderBannerList = (position: BannerPosition) => {
    const banners = getBannersByPosition(position);
    const meta = BANNER_POSITION_META[position];
    const sizeSpec = BANNER_SIZES[meta.sizeSpec];

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Position Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {meta.name}
                {meta.allowMultiple && (
                  <span className="text-xs bg-brand-gold text-slate-900 px-2 py-0.5 rounded-full">
                    สูงสุด {meta.maxItems} รูป
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{meta.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Monitor size={12} />
                {sizeSpec.width} x {sizeSpec.height} px
              </span>
              {meta.allowMultiple && banners.length < meta.maxItems && (
                <Button 
                  size="sm" 
                  onClick={() => openAddNewForm(position)}
                  className="gap-1"
                >
                  <Plus size={16} /> เพิ่ม
                </Button>
              )}
              {!meta.allowMultiple && banners.length === 0 && (
                <Button 
                  size="sm" 
                  onClick={() => openAddNewForm(position)}
                  className="gap-1"
                >
                  <Plus size={16} /> เพิ่ม
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Banner Items */}
        <div className="divide-y divide-slate-100">
          {banners.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <FileImage size={40} className="mx-auto mb-2 opacity-50" />
              <p>ยังไม่มีแบนเนอร์</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => openAddNewForm(position)}
              >
                <Plus size={16} className="mr-1" /> เพิ่มแบนเนอร์
              </Button>
            </div>
          ) : (
            banners.map((banner) => (
              <div 
                key={banner.id} 
                className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors group"
              >
                {/* Drag Handle (for multiple items) */}
                {meta.allowMultiple && (
                  <div className="text-slate-300 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                )}

                {/* Thumbnail */}
                <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.altText}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{banner.name}</h4>
                  <p className="text-sm text-slate-500 truncate">{banner.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {banner.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                    {banner.link && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <LinkIcon size={12} /> {banner.link}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={banner.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  >
                    {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => openEditForm(banner)}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-gold hover:bg-yellow-50 transition-colors"
                    title="แก้ไข"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(banner.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="ลบ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === banner.id && (
                  <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-3 z-10">
                    <span className="text-sm font-medium text-slate-700">ยืนยันการลบ?</span>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(banner.id)}
                    >
                      ลบ
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render edit/add form modal
  const renderEditForm = () => {
    if (!editingBanner && !isAddingNew) return null;

    const sizeSpec = formData.sizeSpec ? BANNER_SIZES[formData.sizeSpec] : null;
    const currentImage = uploadPreview || formData.imageUrl;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Modal Header */}
          <div className="bg-brand-gold px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {isAddingNew ? 'เพิ่มแบนเนอร์ใหม่' : 'แก้ไขแบนเนอร์'}
              </h3>
              <p className="text-sm text-slate-800">
                {formData.position && BANNER_POSITION_META[formData.position as BannerPosition]?.name}
              </p>
            </div>
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-900" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Size Info */}
            {sizeSpec && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">ขนาดรูปที่แนะนำ</p>
                  <p className="text-sm text-blue-700">
                    <strong>{sizeSpec.width} x {sizeSpec.height} px</strong> • ไม่เกิน {BANNER_FILE_LIMITS.maxSizeMB} MB
                  </p>
                  <p className="text-xs text-blue-600 mt-1">💡 SVG ไม่ต้องกำหนดขนาด (ปรับได้อัตโนมัติ)</p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                รูปภาพแบนเนอร์ <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  isDragging 
                    ? 'border-brand-gold bg-yellow-50' 
                    : uploadErrors.length > 0
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-300 hover:border-brand-gold hover:bg-slate-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, formData.sizeSpec as keyof typeof BANNER_SIZES)}
              >
                {currentImage ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={currentImage} 
                        alt="Preview" 
                        className="max-h-48 rounded-lg shadow-lg mx-auto"
                      />
                      <button
                        onClick={() => {
                          setUploadPreview(null);
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                          setUploadErrors([]);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500">
                      ลากไฟล์มาวางหรือคลิกเพื่อเปลี่ยนรูป
                    </p>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload size={40} className="mx-auto text-slate-400 mb-3" />
                    <p className="font-medium text-slate-700">ลากไฟล์มาวางที่นี่</p>
                    <p className="text-sm text-slate-500 mt-1">หรือ</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      เลือกไฟล์
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={BANNER_FILE_LIMITS.allowedTypes.join(',')}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleFileSelect(file, formData.sizeSpec as keyof typeof BANNER_SIZES);
                    }
                  }}
                />
              </div>

              {/* Validation Errors */}
              {uploadErrors.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadErrors.map((error, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{error.message}</p>
                        {error.expected && error.actual && (
                          <p className="text-red-500 text-xs mt-0.5">
                            ต้องการ: {error.expected} • ได้รับ: {error.actual}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Banner Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                ชื่อแบนเนอร์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="เช่น Mega Sale January 2025"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                คำอธิบาย
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="รายละเอียดของแบนเนอร์ (สำหรับ Admin)"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
              />
            </div>

            {/* Link Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  ประเภทลิงก์
                </label>
                <select
                  value={formData.linkType || 'internal'}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkType: e.target.value as 'internal' | 'external' | 'none' }))}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none bg-white"
                >
                  <option value="internal">ลิงก์ภายใน (หน้าในเว็บ)</option>
                  <option value="external">ลิงก์ภายนอก (URL เต็ม)</option>
                  <option value="none">ไม่มีลิงก์</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {formData.linkType === 'external' ? 'URL ปลายทาง' : 'Path ปลายทาง'}
                </label>
                <input
                  type="text"
                  value={formData.link || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder={formData.linkType === 'external' ? 'https://example.com' : '/category/flash-sale'}
                  disabled={formData.linkType === 'none'}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Alt Text (สำหรับ SEO)
              </label>
              <input
                type="text"
                value={formData.altText || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="คำอธิบายรูปภาพสำหรับ Screen Reader และ SEO"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">สถานะการแสดงผล</p>
                <p className="text-sm text-slate-500">เปิด/ปิด การแสดงแบนเนอร์บนเว็บไซต์</p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  formData.isActive ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    formData.isActive ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={handleCancel}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || (!formData.imageUrl && !uploadPreview) || uploadErrors.length > 0}
              className="gap-2"
            >
              <Save size={18} />
              {isAddingNew ? 'เพิ่มแบนเนอร์' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col shrink-0 fixed h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-black tracking-tighter text-brand-gold uppercase">US PRIME</h2>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Banner Management</span>
        </div>
        
        {/* Category Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold px-4 mb-3">หมวดหมู่แบนเนอร์</p>
          {BANNER_CATEGORIES.map((category) => (
            <button 
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setSelectedPosition(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeCategory === category.id 
                  ? 'bg-brand-gold text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {getIconComponent(category.icon)}
              <div className="text-left">
                <p>{category.name}</p>
                <p className="text-xs opacity-70">{category.positions.length} ตำแหน่ง</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft size={18} /> กลับ Admin Panel
          </Link>
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full rounded-lg hover:bg-slate-800"
          >
            <ExternalLink size={18} /> ดูเว็บไซต์
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h1 className="font-bold text-slate-900 text-lg uppercase tracking-wide flex items-center gap-2">
              <Image size={20} className="text-brand-gold" />
              จัดการแบนเนอร์: 
              <span className="text-brand-gold bg-slate-900 px-2 py-0.5 rounded ml-1">
                {currentCategory?.name}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              อัปเดตล่าสุด: {new Date(managedBanners.lastUpdated).toLocaleString('th-TH')}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Category Description */}
          {currentCategory && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  {getIconComponent(currentCategory.icon)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{currentCategory.name}</h2>
                  <p className="text-slate-500">{currentCategory.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hero Section Settings (Only show in Home category) */}
          {activeCategory === 'home' && (
            <div className="bg-gradient-to-r from-brand-gold to-yellow-400 rounded-xl border border-yellow-500 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-black/10 flex items-center justify-center text-slate-900">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">⭐ Hero Section หน้าแรก</h2>
                    <p className="text-slate-800">
                      โหมดปัจจุบัน: <strong>{siteContent.hero.displayMode === 'image' ? '🖼️ แบนเนอร์รูปภาพ' : '📝 ข้อความ'}</strong>
                    </p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowHeroSettings(true)}
                  className="gap-2 bg-black text-brand-gold hover:bg-slate-800"
                >
                  <Edit3 size={18} /> ตั้งค่า Hero
                </Button>
              </div>
              
              {/* Preview */}
              <div className="mt-4 bg-white/50 rounded-lg p-4 backdrop-blur-sm">
                {siteContent.hero.displayMode === 'image' ? (
                  <div className="flex items-center gap-4">
                    <img 
                      src={siteContent.hero.bannerImageDesktop || 'https://via.placeholder.com/200x80?text=No+Image'} 
                      alt="Hero Preview" 
                      className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm"
                    />
                    <div>
                      <p className="font-medium text-slate-900">แบนเนอร์รูปภาพ</p>
                      <p className="text-sm text-slate-600">ลิงก์: {siteContent.hero.bannerLink || 'ไม่มี'}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-black text-brand-gold rounded text-xs mb-2">{siteContent.hero.badge}</span>
                    <p className="font-bold text-slate-900">{siteContent.hero.titleLine1}</p>
                    <p className="font-bold text-slate-900">{siteContent.hero.titleLine2}</p>
                    <p className="text-sm text-slate-600 mt-1">{siteContent.hero.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner Positions */}
          <div className="space-y-6">
            {positionsInCategory.map((position) => (
              <div key={position}>
                {renderBannerList(position)}
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Edit/Add Modal */}
      {renderEditForm()}

      {/* Hero Settings Modal */}
      {showHeroSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-brand-gold px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  ⭐ ตั้งค่า Hero Section
                </h3>
                <p className="text-sm text-slate-800">เลือกโหมดแสดงผลและปรับแต่งเนื้อหา</p>
              </div>
              <button 
                onClick={() => setShowHeroSettings(false)}
                className="p-2 hover:bg-black/10 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-900" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Display Mode Toggle */}
              <div className="bg-slate-50 rounded-xl p-4">
                <label className="block text-sm font-bold text-slate-700 mb-3">โหมดแสดงผล Hero</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setHeroForm(prev => ({ ...prev, displayMode: 'text' }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      heroForm.displayMode === 'text'
                        ? 'border-brand-gold bg-yellow-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Type size={24} className={heroForm.displayMode === 'text' ? 'text-brand-gold' : 'text-slate-400'} />
                    <div className="text-center">
                      <p className={`text-sm font-bold ${heroForm.displayMode === 'text' ? 'text-slate-900' : 'text-slate-600'}`}>
                        📝 ข้อความ
                      </p>
                      <p className="text-xs text-slate-500">พื้นสีทอง</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setHeroForm(prev => ({ ...prev, displayMode: 'overlay' }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      heroForm.displayMode === 'overlay'
                        ? 'border-brand-gold bg-yellow-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Settings size={24} className={heroForm.displayMode === 'overlay' ? 'text-brand-gold' : 'text-slate-400'} />
                    <div className="text-center">
                      <p className={`text-sm font-bold ${heroForm.displayMode === 'overlay' ? 'text-slate-900' : 'text-slate-600'}`}>
                        ⭐ รูป+ข้อความ
                      </p>
                      <p className="text-xs text-slate-500">แนะนำ!</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setHeroForm(prev => ({ ...prev, displayMode: 'image' }))}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      heroForm.displayMode === 'image'
                        ? 'border-brand-gold bg-yellow-50 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <ImageIcon size={24} className={heroForm.displayMode === 'image' ? 'text-brand-gold' : 'text-slate-400'} />
                    <div className="text-center">
                      <p className={`text-sm font-bold ${heroForm.displayMode === 'image' ? 'text-slate-900' : 'text-slate-600'}`}>
                        🖼️ รูปอย่างเดียว
                      </p>
                      <p className="text-xs text-slate-500">ไม่มีข้อความ</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Overlay Mode - รูป + ข้อความซ้อน */}
              {heroForm.displayMode === 'overlay' && (
                <div className="space-y-5">
                  {/* Image Upload */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <ImageIcon size={18} /> รูปพื้นหลัง
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Desktop */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                          <Monitor size={14} /> Desktop (1920x600)
                        </label>
                        <div 
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer hover:border-brand-gold hover:bg-yellow-50 transition-all ${
                            heroIsUploading === 'desktop' ? 'border-brand-gold bg-yellow-50' : 'border-slate-300'
                          }`}
                          onClick={() => heroDesktopInputRef.current?.click()}
                        >
                          {heroIsUploading === 'desktop' ? (
                            <div className="flex items-center justify-center gap-2 py-2">
                              <Loader2 size={20} className="animate-spin text-brand-gold" />
                              <span className="text-sm">กำลังอัปโหลด...</span>
                            </div>
                          ) : heroForm.bannerImageDesktop ? (
                            <div className="relative">
                              <img src={heroForm.bannerImageDesktop} alt="Desktop" className="h-20 w-auto mx-auto rounded" />
                              <button onClick={(e) => { e.stopPropagation(); setHeroForm(prev => ({ ...prev, bannerImageDesktop: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="py-2">
                              <Upload size={24} className="mx-auto text-slate-400" />
                              <p className="text-xs text-slate-500 mt-1">คลิกอัปโหลด</p>
                            </div>
                          )}
                        </div>
                        <input ref={heroDesktopInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleHeroImageUpload(file, 'desktop'); e.target.value = ''; }} />
                      </div>
                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                          <Smartphone size={14} /> Mobile (1080x1080)
                        </label>
                        <div 
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer hover:border-brand-gold hover:bg-yellow-50 transition-all ${
                            heroIsUploading === 'mobile' ? 'border-brand-gold bg-yellow-50' : 'border-slate-300'
                          }`}
                          onClick={() => heroMobileInputRef.current?.click()}
                        >
                          {heroIsUploading === 'mobile' ? (
                            <div className="flex items-center justify-center gap-2 py-2">
                              <Loader2 size={20} className="animate-spin text-brand-gold" />
                              <span className="text-sm">กำลังอัปโหลด...</span>
                            </div>
                          ) : heroForm.bannerImageMobile ? (
                            <div className="relative">
                              <img src={heroForm.bannerImageMobile} alt="Mobile" className="h-20 w-20 mx-auto rounded object-cover" />
                              <button onClick={(e) => { e.stopPropagation(); setHeroForm(prev => ({ ...prev, bannerImageMobile: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="py-2">
                              <Upload size={24} className="mx-auto text-slate-400" />
                              <p className="text-xs text-slate-500 mt-1">คลิกอัปโหลด</p>
                            </div>
                          )}
                        </div>
                        <input ref={heroMobileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleHeroImageUpload(file, 'mobile'); e.target.value = ''; }} />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Type size={18} /> ข้อความ Overlay
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Badge</label>
                        <input type="text" value={heroForm.badge} onChange={(e) => setHeroForm(prev => ({ ...prev, badge: e.target.value }))} placeholder="OFFICIAL US IMPORTER" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อบรรทัด 1</label>
                          <input type="text" value={heroForm.titleLine1} onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine1: e.target.value }))} placeholder="สินค้าอเมริกา" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อบรรทัด 2</label>
                          <input type="text" value={heroForm.titleLine2} onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine2: e.target.value }))} placeholder="ส่งตรงถึงบ้านคุณ" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">คำอธิบาย</label>
                        <textarea value={heroForm.description} onChange={(e) => setHeroForm(prev => ({ ...prev, description: e.target.value }))} placeholder="พบกับสินค้าแบรนด์ดังกว่า..." rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* Overlay Settings */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Settings size={18} /> การตั้งค่า Overlay
                    </h4>
                    <div className="space-y-4">
                      {/* Position */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ตำแหน่งข้อความ</label>
                        <div className="flex gap-2">
                          {(['left', 'center', 'right'] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, position: pos } }))}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                heroForm.overlay.position === pos
                                  ? 'bg-brand-gold text-black'
                                  : 'bg-white border border-slate-200 hover:border-brand-gold'
                              }`}
                            >
                              {pos === 'left' ? '◀ ซ้าย' : pos === 'center' ? '● กลาง' : '▶ ขวา'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">สีพื้นหลัง Overlay</label>
                          <div className="flex gap-2">
                            <input type="color" value={heroForm.overlay.backgroundColor} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, backgroundColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer" />
                            <input type="text" value={heroForm.overlay.backgroundColor} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, backgroundColor: e.target.value } }))} className="flex-1 border border-slate-300 rounded-lg px-3 text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">สีข้อความ</label>
                          <div className="flex gap-2">
                            <input type="color" value={heroForm.overlay.textColor} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, textColor: e.target.value } }))} className="w-10 h-10 rounded cursor-pointer" />
                            <input type="text" value={heroForm.overlay.textColor} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, textColor: e.target.value } }))} className="flex-1 border border-slate-300 rounded-lg px-3 text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Opacity */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ความทึบพื้นหลัง: {heroForm.overlay.backgroundOpacity}%</label>
                        <input type="range" min="0" max="100" value={heroForm.overlay.backgroundOpacity} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, backgroundOpacity: parseInt(e.target.value) } }))} className="w-full accent-brand-gold" />
                      </div>

                      {/* Show/Hide */}
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={heroForm.overlay.showBadge} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, showBadge: e.target.checked } }))} className="w-4 h-4 accent-brand-gold" />
                          <span className="text-sm">แสดง Badge</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={heroForm.overlay.showTitle} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, showTitle: e.target.checked } }))} className="w-4 h-4 accent-brand-gold" />
                          <span className="text-sm">แสดงหัวข้อ</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={heroForm.overlay.showDescription} onChange={(e) => setHeroForm(prev => ({ ...prev, overlay: { ...prev.overlay, showDescription: e.target.checked } }))} className="w-4 h-4 accent-brand-gold" />
                          <span className="text-sm">แสดงคำอธิบาย</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      🔘 ปุ่ม CTA
                    </h4>
                    <div className="space-y-3">
                      {heroForm.ctaButtons.map((btn, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                          <input type="checkbox" checked={btn.show} onChange={(e) => { const updated = [...heroForm.ctaButtons]; updated[idx].show = e.target.checked; setHeroForm(prev => ({ ...prev, ctaButtons: updated })); }} className="w-4 h-4 accent-brand-gold" />
                          <input type="text" value={btn.text} onChange={(e) => { const updated = [...heroForm.ctaButtons]; updated[idx].text = e.target.value; setHeroForm(prev => ({ ...prev, ctaButtons: updated })); }} placeholder="ข้อความปุ่ม" className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm" />
                          <input type="text" value={btn.link} onChange={(e) => { const updated = [...heroForm.ctaButtons]; updated[idx].link = e.target.value; setHeroForm(prev => ({ ...prev, ctaButtons: updated })); }} placeholder="ลิงก์" className="w-32 border border-slate-300 rounded px-2 py-1 text-sm" />
                          <select value={btn.variant} onChange={(e) => { const updated = [...heroForm.ctaButtons]; updated[idx].variant = e.target.value as any; setHeroForm(prev => ({ ...prev, ctaButtons: updated })); }} className="border border-slate-300 rounded px-2 py-1 text-sm">
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="outline">Outline</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Text Mode Fields */}
              {heroForm.displayMode === 'text' && (
                <div className="space-y-4 border-l-4 border-brand-gold pl-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Type size={18} /> ตั้งค่าโหมดข้อความ
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Badge (ป้ายด้านบน)</label>
                    <input
                      type="text"
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="เช่น OFFICIAL US IMPORTER"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อบรรทัด 1</label>
                      <input
                        type="text"
                        value={heroForm.titleLine1}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine1: e.target.value }))}
                        placeholder="เช่น สินค้าอเมริกา"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อบรรทัด 2</label>
                      <input
                        type="text"
                        value={heroForm.titleLine2}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine2: e.target.value }))}
                        placeholder="เช่น ส่งตรงถึงบ้านคุณ"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">คำอธิบาย</label>
                    <textarea
                      value={heroForm.description}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="คำอธิบายสั้นๆ..."
                      rows={2}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Image Mode Fields */}
              {heroForm.displayMode === 'image' && (
                <div className="space-y-4 border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon size={18} /> ตั้งค่าโหมดแบนเนอร์
                  </h4>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                    <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      <strong>Desktop:</strong> ขนาดแนะนำ 1920x600 px | <strong>Mobile:</strong> ขนาดแนะนำ 1080x1080 px
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Desktop Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                        <Monitor size={14} /> รูปแบนเนอร์ Desktop
                      </label>
                      
                      {/* Upload Box */}
                      <div 
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-brand-gold hover:bg-yellow-50 ${
                          heroIsUploading === 'desktop' ? 'border-brand-gold bg-yellow-50' : 'border-slate-300'
                        }`}
                        onClick={() => heroDesktopInputRef.current?.click()}
                      >
                        {heroIsUploading === 'desktop' ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <Loader2 size={32} className="animate-spin text-brand-gold" />
                            <p className="text-sm text-slate-600">กำลังอัปโหลด...</p>
                          </div>
                        ) : heroForm.bannerImageDesktop ? (
                          <div className="relative">
                            <img 
                              src={heroForm.bannerImageDesktop} 
                              alt="Desktop Preview" 
                              className="h-28 w-auto mx-auto rounded-lg border shadow-sm"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHeroForm(prev => ({ ...prev, bannerImageDesktop: '' }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                            >
                              <X size={14} />
                            </button>
                            <p className="text-xs text-slate-500 mt-2">คลิกเพื่อเปลี่ยนรูป</p>
                          </div>
                        ) : (
                          <div className="py-4">
                            <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-sm font-medium text-slate-700">คลิกเพื่ออัปโหลดรูป</p>
                            <p className="text-xs text-slate-500">PNG, JPG, WebP, SVG (Max 10MB)</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={heroDesktopInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleHeroImageUpload(file, 'desktop');
                          e.target.value = '';
                        }}
                      />
                      
                      {/* Or paste URL */}
                      <div className="mt-2">
                        <input
                          type="text"
                          value={heroForm.bannerImageDesktop}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, bannerImageDesktop: e.target.value }))}
                          placeholder="หรือวาง URL รูปภาพ..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                        />
                      </div>
                    </div>

                    {/* Mobile Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                        <Smartphone size={14} /> รูปแบนเนอร์ Mobile <span className="text-slate-400">(Optional)</span>
                      </label>
                      
                      {/* Upload Box */}
                      <div 
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-brand-gold hover:bg-yellow-50 ${
                          heroIsUploading === 'mobile' ? 'border-brand-gold bg-yellow-50' : 'border-slate-300'
                        }`}
                        onClick={() => heroMobileInputRef.current?.click()}
                      >
                        {heroIsUploading === 'mobile' ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <Loader2 size={32} className="animate-spin text-brand-gold" />
                            <p className="text-sm text-slate-600">กำลังอัปโหลด...</p>
                          </div>
                        ) : heroForm.bannerImageMobile ? (
                          <div className="relative">
                            <img 
                              src={heroForm.bannerImageMobile} 
                              alt="Mobile Preview" 
                              className="h-28 w-28 mx-auto rounded-lg border shadow-sm object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHeroForm(prev => ({ ...prev, bannerImageMobile: '' }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                            >
                              <X size={14} />
                            </button>
                            <p className="text-xs text-slate-500 mt-2">คลิกเพื่อเปลี่ยนรูป</p>
                          </div>
                        ) : (
                          <div className="py-4">
                            <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-sm font-medium text-slate-700">คลิกเพื่ออัปโหลดรูป</p>
                            <p className="text-xs text-slate-500">PNG, JPG, WebP, SVG (Max 10MB)</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={heroMobileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleHeroImageUpload(file, 'mobile');
                          e.target.value = '';
                        }}
                      />
                      
                      {/* Or paste URL */}
                      <div className="mt-2">
                        <input
                          type="text"
                          value={heroForm.bannerImageMobile}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, bannerImageMobile: e.target.value }))}
                          placeholder="หรือวาง URL รูปภาพ..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ลิงก์ปลายทาง</label>
                      <input
                        type="text"
                        value={heroForm.bannerLink}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, bannerLink: e.target.value }))}
                        placeholder="เช่น /category/all"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Alt Text (SEO)</label>
                      <input
                        type="text"
                        value={heroForm.bannerAltText}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, bannerAltText: e.target.value }))}
                        placeholder="คำอธิบายรูปภาพ"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Preview */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">👁️ ตัวอย่างการแสดงผล</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {heroForm.displayMode === 'image' ? (
                    <div className="relative">
                      <img 
                        src={heroForm.bannerImageDesktop || 'https://via.placeholder.com/1920x600/FFD700/000000?text=Add+Banner+Image'} 
                        alt="Preview" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-brand-gold p-6 text-center">
                      <span className="inline-block px-3 py-1 bg-black text-brand-gold rounded-full text-xs font-bold mb-2">
                        {heroForm.badge || 'BADGE'}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900">{heroForm.titleLine1 || 'หัวข้อบรรทัด 1'}</h3>
                      <h3 className="text-2xl font-black text-slate-900 border-b-4 border-black inline-block">{heroForm.titleLine2 || 'หัวข้อบรรทัด 2'}</h3>
                      <p className="text-slate-800 mt-2">{heroForm.description || 'คำอธิบาย...'}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={() => setShowHeroSettings(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSaveHeroSettings} className="gap-2">
                <Save size={18} /> บันทึกการตั้งค่า
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};