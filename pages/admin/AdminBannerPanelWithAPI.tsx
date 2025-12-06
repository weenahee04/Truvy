import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  Ticket,
  PanelBottom,
  FolderOpen,
  Image,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Save,
  GripVertical,
  Loader2,
  RefreshCw,
  Check,
  Info
} from 'lucide-react';

// Import API and types
import { bannerApi } from '../../services/api/bannerApi';
import {
  Banner,
  BannerPosition,
  BannerSizeSpec,
  BANNER_POSITIONS,
  FILE_LIMITS,
  FileValidationError
} from '../../backend/types/banner.types';
import {
  validateBannerFile,
  validateBannerFormData,
  formatBytes
} from '../../backend/utils/banner.validation';

// =====================================================
// TYPES
// =====================================================

interface BannerCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  positions: BannerPosition[];
  description: string;
}

const BANNER_CATEGORIES: BannerCategory[] = [
  {
    id: 'home',
    name: 'หน้าแรก (Home)',
    icon: <Home size={20} />,
    positions: ['home_hero', 'home_hero_mobile', 'home_promo_slider', 'home_flash_sale', 'home_us_deals'],
    description: 'จัดการแบนเนอร์ทั้งหมดในหน้าแรก'
  },
  {
    id: 'lotto',
    name: 'หน้า Lotto',
    icon: <Ticket size={20} />,
    positions: ['lotto_powerball', 'lotto_megamillions'],
    description: 'จัดการแบนเนอร์หน้า Powerball และ Mega Millions'
  },
  {
    id: 'category',
    name: 'หมวดหมู่สินค้า',
    icon: <FolderOpen size={20} />,
    positions: ['category_electronics', 'category_fashion', 'category_vitamins'],
    description: 'แบนเนอร์หมวดหมู่สินค้าต่างๆ'
  },
  {
    id: 'footer',
    name: 'Footer',
    icon: <PanelBottom size={20} />,
    positions: ['footer_main'],
    description: 'แบนเนอร์ส่วนท้ายของเว็บไซต์'
  }
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export const AdminBannerPanelWithAPI: React.FC = () => {
  // State
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sizeSpecs, setSizeSpecs] = useState<Record<string, BannerSizeSpec>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<BannerPosition | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<FileValidationError[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // DATA FETCHING
  // =====================================================

  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await bannerApi.getAll({ limit: 100 });
      
      setBanners(response.data);
      setSizeSpecs(response.size_specs);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลแบนเนอร์ได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // =====================================================
  // FILE HANDLING
  // =====================================================

  const handleFileSelect = useCallback(async (file: File, position: BannerPosition) => {
    // Validate file
    const validation = await validateBannerFile(file, position, false);
    
    setUploadErrors(validation.errors);
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    return validation.valid;
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, position: BannerPosition) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file, position);
    }
  };

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const openAddForm = (position: BannerPosition) => {
    const spec = BANNER_POSITIONS[position];
    setFormData({
      name: '',
      description: '',
      position,
      link_url: '',
      link_type: 'none',
      alt_text: '',
      is_active: true,
      sort_order: getBannersByPosition(position).length + 1
    });
    setSelectedPosition(position);
    setEditingBanner(null);
    setIsAddingNew(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadErrors([]);
    setFormErrors({});
  };

  const openEditForm = (banner: Banner) => {
    setFormData({ ...banner });
    setSelectedPosition(banner.position);
    setEditingBanner(banner);
    setIsAddingNew(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadErrors([]);
    setFormErrors({});
  };

  const closeForm = () => {
    setEditingBanner(null);
    setIsAddingNew(false);
    setSelectedPosition(null);
    setFormData({});
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadErrors([]);
    setFormErrors({});
  };

  const handleSave = async () => {
    // Validate form
    const validation = validateBannerFormData({
      name: formData.name,
      description: formData.description || undefined,
      alt_text: formData.alt_text || undefined,
      link_url: formData.link_url || undefined,
      link_type: formData.link_type
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    // Validate file for new banner
    if (isAddingNew && !selectedFile) {
      setFormErrors({ image: 'กรุณาอัปโหลดรูปภาพ' });
      return;
    }

    try {
      setIsSaving(true);

      if (isAddingNew && selectedFile && selectedPosition) {
        // Create new banner
        await bannerApi.create(
          {
            name: formData.name!,
            description: formData.description || undefined,
            position: selectedPosition,
            link_url: formData.link_url || undefined,
            link_type: formData.link_type,
            open_in_new_tab: formData.open_in_new_tab,
            alt_text: formData.alt_text || undefined,
            is_active: formData.is_active,
            sort_order: formData.sort_order
          },
          selectedFile
        );
      } else if (editingBanner) {
        // Update existing banner
        await bannerApi.update(
          editingBanner.id,
          {
            name: formData.name,
            description: formData.description,
            link_url: formData.link_url,
            link_type: formData.link_type,
            open_in_new_tab: formData.open_in_new_tab,
            alt_text: formData.alt_text,
            is_active: formData.is_active,
            sort_order: formData.sort_order
          },
          selectedFile || undefined
        );
      }

      // Refresh data and close form
      await fetchBanners();
      closeForm();
    } catch (err: any) {
      setFormErrors({ submit: err.message || 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // BANNER ACTIONS
  // =====================================================

  const handleToggle = async (id: string) => {
    try {
      await bannerApi.toggle(id);
      await fetchBanners();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    try {
      await bannerApi.delete(id, permanent);
      await fetchBanners();
      setShowDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getBannersByPosition = (position: BannerPosition): Banner[] => {
    return banners
      .filter(b => b.position === position)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const currentCategory = BANNER_CATEGORIES.find(c => c.id === activeCategory);

  // =====================================================
  // RENDER: Banner List for Position
  // =====================================================

  const renderBannerList = (position: BannerPosition) => {
    const positionBanners = getBannersByPosition(position);
    const spec = BANNER_POSITIONS[position];
    const canAdd = spec.allow_multiple 
      ? positionBanners.length < spec.max_items 
      : positionBanners.length === 0;

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                {spec.display_name}
                {spec.allow_multiple && (
                  <span className="text-xs bg-brand-gold text-slate-900 px-2 py-0.5 rounded-full">
                    {positionBanners.length}/{spec.max_items}
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                ขนาด: {spec.width} x {spec.height} px
              </p>
            </div>
            {canAdd && (
              <Button size="sm" onClick={() => openAddForm(position)} className="gap-1">
                <Plus size={16} /> เพิ่ม
              </Button>
            )}
          </div>
        </div>

        {/* Banner Items */}
        <div className="divide-y divide-slate-100">
          {positionBanners.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Image size={40} className="mx-auto mb-2 opacity-50" />
              <p>ยังไม่มีแบนเนอร์</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => openAddForm(position)}
              >
                <Plus size={16} className="mr-1" /> เพิ่มแบนเนอร์
              </Button>
            </div>
          ) : (
            positionBanners.map((banner) => (
              <div 
                key={banner.id} 
                className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors group relative"
              >
                {/* Drag Handle */}
                {spec.allow_multiple && (
                  <div className="text-slate-300 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                )}

                {/* Thumbnail */}
                <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    src={banner.image_url} 
                    alt={banner.alt_text || banner.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{banner.name}</h4>
                  <p className="text-sm text-slate-500 truncate">{banner.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      banner.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {banner.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                    {banner.link_url && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                        <LinkIcon size={12} /> {banner.link_url}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggle(banner.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      banner.is_active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={banner.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  >
                    {banner.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
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
                  <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-3 z-10 backdrop-blur-sm">
                    <span className="text-sm font-medium text-slate-700">ลบแบนเนอร์นี้?</span>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(banner.id, true)}
                    >
                      ลบถาวร
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

  // =====================================================
  // RENDER: Edit/Add Form Modal
  // =====================================================

  const renderEditForm = () => {
    if (!editingBanner && !isAddingNew) return null;

    const position = selectedPosition || editingBanner?.position;
    const spec = position ? BANNER_POSITIONS[position] : null;
    const currentImage = previewUrl || editingBanner?.image_url;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-brand-gold px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {isAddingNew ? 'เพิ่มแบนเนอร์ใหม่' : 'แก้ไขแบนเนอร์'}
              </h3>
              <p className="text-sm text-slate-800">{spec?.display_name}</p>
            </div>
            <button 
              onClick={closeForm}
              className="p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-900" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Size Info */}
            {spec && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">ขนาดรูปที่แนะนำ</p>
                  <p className="text-sm text-blue-700">
                    <strong>{spec.width} x {spec.height} px</strong> • ไม่เกิน {FILE_LIMITS.MAX_SIZE_MB} MB
                  </p>
                  <p className="text-xs text-blue-600 mt-1">💡 SVG ไม่ต้องกำหนดขนาด (ปรับได้อัตโนมัติ)</p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                รูปภาพแบนเนอร์ {isAddingNew && <span className="text-red-500">*</span>}
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
                onDrop={(e) => position && handleDrop(e, position)}
              >
                {currentImage ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={currentImage} 
                        alt="Preview" 
                        className="max-h-48 rounded-lg shadow-lg mx-auto"
                      />
                      {(selectedFile || isAddingNew) && (
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setUploadErrors([]);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
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
                  accept={FILE_LIMITS.ALLOWED_TYPES.join(',')}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && position) {
                      await handleFileSelect(file, position);
                    }
                  }}
                />
              </div>

              {/* Upload Errors */}
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

              {formErrors.image && (
                <p className="mt-2 text-sm text-red-600">{formErrors.image}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                ชื่อแบนเนอร์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="เช่น Mega Sale January 2025"
                className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none ${
                  formErrors.name ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
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
                placeholder="รายละเอียดของแบนเนอร์"
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
                  value={formData.link_type || 'none'}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_type: e.target.value as any }))}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none bg-white"
                >
                  <option value="none">ไม่มีลิงก์</option>
                  <option value="internal">ลิงก์ภายใน (หน้าในเว็บ)</option>
                  <option value="external">ลิงก์ภายนอก (URL เต็ม)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {formData.link_type === 'external' ? 'URL ปลายทาง' : 'Path ปลายทาง'}
                </label>
                <input
                  type="text"
                  value={formData.link_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder={formData.link_type === 'external' ? 'https://example.com' : '/category/flash-sale'}
                  disabled={formData.link_type === 'none'}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none disabled:bg-slate-100 disabled:text-slate-400 ${
                    formErrors.link_url ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {formErrors.link_url && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.link_url}</p>
                )}
              </div>
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Alt Text (สำหรับ SEO)
              </label>
              <input
                type="text"
                value={formData.alt_text || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="คำอธิบายรูปภาพ"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">สถานะการแสดงผล</p>
                <p className="text-sm text-slate-500">เปิด/ปิดการแสดงแบนเนอร์</p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  formData.is_active ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <span 
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    formData.is_active ? 'left-8' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Error */}
            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600" />
                <p className="text-red-700">{formErrors.submit}</p>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={closeForm} disabled={isSaving}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || uploadErrors.length > 0}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'กำลังบันทึก...' : isAddingNew ? 'เพิ่มแบนเนอร์' : 'บันทึก'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col shrink-0 fixed h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-black tracking-tighter text-brand-gold uppercase">US PRIME</h2>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Banner Management</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold px-4 mb-3">หมวดหมู่แบนเนอร์</p>
          {BANNER_CATEGORIES.map((category) => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeCategory === category.id 
                  ? 'bg-brand-gold text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {category.icon}
              <div className="text-left">
                <p>{category.name}</p>
                <p className="text-xs opacity-70">{category.positions.length} ตำแหน่ง</p>
              </div>
            </button>
          ))}
        </nav>

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
        {/* Header */}
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchBanners}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              รีเฟรช
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-brand-gold" />
            </div>
          ) : (
            <>
              {/* Category Description */}
              {currentCategory && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      {currentCategory.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{currentCategory.name}</h2>
                      <p className="text-slate-500">{currentCategory.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Banner Positions */}
              <div className="space-y-6">
                {currentCategory?.positions.map((position) => (
                  <div key={position}>
                    {renderBannerList(position)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit/Add Modal */}
      {renderEditForm()}
    </div>
  );
};

export default AdminBannerPanelWithAPI;
