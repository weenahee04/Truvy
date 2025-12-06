-- =====================================================
-- US PRIME - Banner Management System
-- Database Schema (PostgreSQL / Supabase)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ENUMS
-- =====================================================

-- Banner Position/Type Enum
CREATE TYPE banner_position AS ENUM (
  'home_hero',
  'home_hero_mobile',
  'home_promo_slider',
  'home_flash_sale',
  'home_us_deals',
  'lotto_powerball',
  'lotto_megamillions',
  'footer_main',
  'category_electronics',
  'category_fashion',
  'category_vitamins'
);

-- Link Type Enum
CREATE TYPE banner_link_type AS ENUM (
  'internal',  -- ลิงก์ภายในเว็บ เช่น /category/flash-sale
  'external',  -- ลิงก์ภายนอก เช่น https://example.com
  'none'       -- ไม่มีลิงก์
);

-- =====================================================
-- 2. BANNERS TABLE
-- =====================================================

CREATE TABLE banners (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Banner Identity
  name VARCHAR(255) NOT NULL,
  description TEXT,
  position banner_position NOT NULL,
  
  -- Image Storage
  image_url TEXT NOT NULL,
  image_url_mobile TEXT,  -- Optional mobile version
  image_filename VARCHAR(255),  -- Original filename
  image_size_bytes INTEGER,  -- File size for reference
  image_width INTEGER,  -- Actual image dimensions
  image_height INTEGER,
  alt_text VARCHAR(500),
  
  -- Link Configuration
  link_url TEXT,
  link_type banner_link_type DEFAULT 'none',
  open_in_new_tab BOOLEAN DEFAULT false,
  
  -- Display Control
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,  -- For carousel/slider ordering
  
  -- Schedule (Optional)
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. BANNER SIZE SPECIFICATIONS TABLE
-- =====================================================

CREATE TABLE banner_size_specs (
  id SERIAL PRIMARY KEY,
  position banner_position UNIQUE NOT NULL,
  
  -- Required Dimensions
  required_width INTEGER NOT NULL,
  required_height INTEGER NOT NULL,
  
  -- Limits
  max_file_size_bytes INTEGER DEFAULT 5242880,  -- 5MB default
  allowed_formats TEXT[] DEFAULT ARRAY['image/jpeg', 'image/png', 'image/webp'],
  
  -- Settings
  allow_multiple BOOLEAN DEFAULT false,  -- Can have multiple banners (carousel)
  max_items INTEGER DEFAULT 1,
  
  -- Display Info
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. INSERT DEFAULT SIZE SPECIFICATIONS
-- =====================================================

INSERT INTO banner_size_specs 
  (position, required_width, required_height, allow_multiple, max_items, display_name, description)
VALUES
  ('home_hero', 1920, 600, false, 1, 'Hero Banner (Desktop)', 'แบนเนอร์หลักหน้าแรก Desktop'),
  ('home_hero_mobile', 1080, 1080, false, 1, 'Hero Banner (Mobile)', 'แบนเนอร์หลักหน้าแรก Mobile'),
  ('home_promo_slider', 1600, 600, true, 5, 'Promo Slider', 'แบนเนอร์สไลด์โปรโมชัน (สูงสุด 5 รูป)'),
  ('home_flash_sale', 1200, 400, false, 1, 'Flash Sale Banner', 'แบนเนอร์ Flash Sale'),
  ('home_us_deals', 1200, 400, false, 1, 'US Deals Banner', 'แบนเนอร์ US Deals'),
  ('lotto_powerball', 1200, 500, false, 1, 'Powerball Banner', 'แบนเนอร์ Powerball'),
  ('lotto_megamillions', 1200, 500, false, 1, 'Mega Millions Banner', 'แบนเนอร์ Mega Millions'),
  ('footer_main', 1920, 300, false, 1, 'Footer Banner', 'แบนเนอร์ส่วนท้ายเว็บ'),
  ('category_electronics', 800, 400, false, 1, 'Electronics Category', 'แบนเนอร์หมวดอิเล็กทรอนิกส์'),
  ('category_fashion', 800, 400, false, 1, 'Fashion Category', 'แบนเนอร์หมวดแฟชั่น'),
  ('category_vitamins', 800, 400, false, 1, 'Vitamins Category', 'แบนเนอร์หมวดวิตามิน');

-- =====================================================
-- 5. BANNER UPLOAD HISTORY (Audit Log)
-- =====================================================

CREATE TABLE banner_upload_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_id UUID REFERENCES banners(id) ON DELETE SET NULL,
  
  action VARCHAR(50) NOT NULL,  -- 'create', 'update', 'delete', 'activate', 'deactivate'
  old_image_url TEXT,
  new_image_url TEXT,
  
  performed_by UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

-- Fast lookup by position
CREATE INDEX idx_banners_position ON banners(position);

-- Active banners only
CREATE INDEX idx_banners_active ON banners(is_active) WHERE is_active = true;

-- Position + Active + Sort Order (common query)
CREATE INDEX idx_banners_position_active_order ON banners(position, is_active, sort_order);

-- Date range filtering
CREATE INDEX idx_banners_date_range ON banners(start_date, end_date);

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to banners table
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to banner_size_specs table
CREATE TRIGGER update_banner_size_specs_updated_at
  BEFORE UPDATE ON banner_size_specs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. ROW LEVEL SECURITY (Supabase)
-- =====================================================

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_size_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_upload_logs ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT
  USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
  );

-- Admins can do everything
CREATE POLICY "Admins can manage banners" ON banners
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Public can read size specs
CREATE POLICY "Public can view size specs" ON banner_size_specs
  FOR SELECT
  TO public
  USING (true);

-- Only admins can view logs
CREATE POLICY "Admins can view upload logs" ON banner_upload_logs
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- =====================================================
-- 9. SUPABASE STORAGE BUCKET SETUP (Run in Supabase)
-- =====================================================

-- Create bucket for banner images
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('banners', 'banners', true);

-- Storage policy: Public read access
-- CREATE POLICY "Public banner images are accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'banners');

-- Storage policy: Admin upload access
-- CREATE POLICY "Admin can upload banner images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'banners' 
--   AND auth.jwt() ->> 'role' = 'admin'
-- );

-- Storage policy: Admin delete access
-- CREATE POLICY "Admin can delete banner images"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'banners' 
--   AND auth.jwt() ->> 'role' = 'admin'
-- );

-- =====================================================
-- 10. USEFUL VIEWS
-- =====================================================

-- View: Active banners with size specs
CREATE OR REPLACE VIEW active_banners_with_specs AS
SELECT 
  b.*,
  s.required_width,
  s.required_height,
  s.display_name as position_display_name,
  s.allow_multiple,
  s.max_items
FROM banners b
LEFT JOIN banner_size_specs s ON b.position = s.position
WHERE b.is_active = true
  AND (b.start_date IS NULL OR b.start_date <= NOW())
  AND (b.end_date IS NULL OR b.end_date >= NOW())
ORDER BY b.position, b.sort_order;

-- View: Banner count by position
CREATE OR REPLACE VIEW banner_counts_by_position AS
SELECT 
  s.position,
  s.display_name,
  s.allow_multiple,
  s.max_items,
  COUNT(b.id) as current_count,
  CASE 
    WHEN s.allow_multiple THEN s.max_items - COUNT(b.id)
    ELSE CASE WHEN COUNT(b.id) = 0 THEN 1 ELSE 0 END
  END as available_slots
FROM banner_size_specs s
LEFT JOIN banners b ON s.position = b.position AND b.is_active = true
GROUP BY s.position, s.display_name, s.allow_multiple, s.max_items
ORDER BY s.position;
