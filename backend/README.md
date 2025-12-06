# 📋 US PRIME Banner Management System

## ระบบจัดการแบนเนอร์สำหรับเว็บไซต์ US PRIME

---

## 📁 โครงสร้างไฟล์

```
truvamate-marketplace/
├── backend/
│   ├── database/
│   │   └── schema.sql              # SQL Schema (PostgreSQL/Supabase)
│   ├── routes/
│   │   └── banner.routes.ts        # Express.js API Routes
│   ├── types/
│   │   └── banner.types.ts         # TypeScript Types
│   ├── utils/
│   │   └── banner.validation.ts    # Validation Utilities
│   ├── server.ts                   # Express Server Entry
│   ├── package.json
│   └── .env.example
├── services/
│   └── api/
│       └── bannerApi.ts            # Frontend API Client
└── pages/
    └── admin/
        └── AdminBannerPanelWithAPI.tsx  # React Admin Panel
```

---

## 🗄️ Database Schema

### Table: `banners`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | ชื่อแบนเนอร์ (required) |
| `description` | TEXT | คำอธิบาย |
| `position` | ENUM | ตำแหน่งแบนเนอร์ |
| `image_url` | TEXT | URL รูปภาพ (required) |
| `image_url_mobile` | TEXT | URL รูปภาพ Mobile |
| `image_filename` | VARCHAR(255) | ชื่อไฟล์ใน Storage |
| `image_size_bytes` | INTEGER | ขนาดไฟล์ |
| `image_width` | INTEGER | ความกว้างรูป |
| `image_height` | INTEGER | ความสูงรูป |
| `alt_text` | VARCHAR(500) | Alt text สำหรับ SEO |
| `link_url` | TEXT | URL เมื่อคลิก |
| `link_type` | ENUM | ประเภทลิงก์ (internal/external/none) |
| `open_in_new_tab` | BOOLEAN | เปิดในแท็บใหม่ |
| `is_active` | BOOLEAN | สถานะเปิด/ปิด |
| `sort_order` | INTEGER | ลำดับแสดงผล |
| `start_date` | TIMESTAMPTZ | วันที่เริ่มแสดง |
| `end_date` | TIMESTAMPTZ | วันที่สิ้นสุด |
| `created_by` | UUID | ผู้สร้าง |
| `updated_by` | UUID | ผู้แก้ไขล่าสุด |
| `created_at` | TIMESTAMPTZ | วันที่สร้าง |
| `updated_at` | TIMESTAMPTZ | วันที่แก้ไข |

### Banner Positions (ENUM)

| Position | Display Name | Size (px) | Max Items |
|----------|--------------|-----------|-----------|
| `home_hero` | Hero Banner (Desktop) | 1920 x 600 | 1 |
| `home_hero_mobile` | Hero Banner (Mobile) | 1080 x 1080 | 1 |
| `home_promo_slider` | Promo Slider | 1600 x 600 | 5 |
| `home_flash_sale` | Flash Sale Banner | 1200 x 400 | 1 |
| `home_us_deals` | US Deals Banner | 1200 x 400 | 1 |
| `lotto_powerball` | Powerball Banner | 1200 x 500 | 1 |
| `lotto_megamillions` | Mega Millions Banner | 1200 x 500 | 1 |
| `footer_main` | Footer Banner | 1920 x 300 | 1 |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3001
```

### Authentication
ทุก Endpoint ต้องส่ง Bearer Token ใน Header:
```
Authorization: Bearer <jwt_token>
```

---

### 1. GET /admin/banners
ดึงรายการแบนเนอร์ทั้งหมด

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `position` | string | กรองตามตำแหน่ง |
| `is_active` | boolean | กรองตามสถานะ |
| `page` | number | หน้าที่ต้องการ (default: 1) |
| `limit` | number | จำนวนต่อหน้า (default: 50) |
| `sort_by` | string | เรียงตาม: created_at, updated_at, sort_order, name |
| `sort_order` | string | asc หรือ desc |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mega Sale Banner",
      "position": "home_promo_slider",
      "image_url": "https://...",
      "is_active": true,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10,
    "total_pages": 1
  },
  "size_specs": {
    "home_hero": {
      "required_width": 1920,
      "required_height": 600,
      ...
    }
  }
}
```

---

### 2. GET /admin/banners/:id
ดึงแบนเนอร์ตาม ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mega Sale Banner",
    ...
  },
  "size_spec": {
    "required_width": 1600,
    "required_height": 600,
    ...
  }
}
```

---

### 3. POST /admin/banners
สร้างแบนเนอร์ใหม่

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | ✅ | ไฟล์รูปภาพ (JPG, PNG, WebP) |
| `name` | string | ✅ | ชื่อแบนเนอร์ |
| `position` | string | ✅ | ตำแหน่งแบนเนอร์ |
| `description` | string | | คำอธิบาย |
| `link_url` | string | | URL เมื่อคลิก |
| `link_type` | string | | internal / external / none |
| `alt_text` | string | | Alt text |
| `is_active` | boolean | | สถานะ (default: true) |
| `sort_order` | number | | ลำดับ |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "New Banner",
    "image_url": "https://storage.../banners/home_promo_slider/123.jpg",
    ...
  },
  "message": "Banner created successfully"
}
```

**Errors:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "image",
      "message": "ขนาดรูปภาพไม่ตรงกับที่กำหนด (ต้องการ: 1600 x 600 px, ได้รับ: 1200 x 400 px)",
      "code": "INVALID_DIMENSIONS"
    }
  ]
}
```

---

### 4. PUT /admin/banners/:id
แก้ไขแบนเนอร์

**Request:** `multipart/form-data`
(เหมือน POST แต่ไม่บังคับ image ถ้าไม่ต้องการเปลี่ยนรูป)

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Banner updated successfully"
}
```

---

### 5. DELETE /admin/banners/:id
ลบแบนเนอร์

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `permanent` | boolean | `true` = ลบถาวร, `false` = soft delete |

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Banner deleted permanently"
}
```

---

### 6. PATCH /admin/banners/:id/toggle
สลับสถานะเปิด/ปิด

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "is_active": false, ... },
  "message": "Banner deactivated"
}
```

---

### 7. PATCH /admin/banners/reorder
เรียงลำดับแบนเนอร์ใหม่ (สำหรับ Carousel)

**Request:**
```json
{
  "position": "home_promo_slider",
  "banner_ids": ["uuid-1", "uuid-3", "uuid-2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Banners reordered successfully"
}
```

---

## ✅ Validation Rules

### File Validation

| Rule | Limit |
|------|-------|
| Max file size | 5 MB |
| Allowed types | image/jpeg, image/png, image/webp |
| Dimensions | ต้องตรงตาม position (หรือ aspect ratio) |

### Form Validation

| Field | Rule |
|-------|------|
| `name` | Required, max 255 chars |
| `description` | Max 1000 chars |
| `alt_text` | Max 500 chars |
| `link_url` | ต้องขึ้นต้นด้วย / หรือ http(s):// |

---

## 🚀 Quick Start

### 1. Setup Database (Supabase)
```bash
# Run schema.sql in Supabase SQL Editor
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev
```

### 3. Setup Frontend
```bash
# Add VITE_API_URL to your .env
VITE_API_URL=http://localhost:3001

npm run dev
```

---

## 📊 Admin Flow

```
1️⃣ Admin เข้าหน้า /admin/banners
           ↓
2️⃣ เลือกหมวดหมู่ (Home / Lotto / Footer)
           ↓
3️⃣ เลือกตำแหน่งที่ต้องการจัดการ
           ↓
4️⃣ คลิก "เพิ่ม" หรือ "แก้ไข"
           ↓
5️⃣ อัปโหลดรูปภาพ (Drag & Drop หรือ Browse)
           ↓
6️⃣ ระบบตรวจสอบ:
   • ขนาดไฟล์ (≤ 5MB) ✓
   • ประเภทไฟล์ (JPG/PNG/WebP) ✓
   • ขนาดรูป (ตาม position) ✓
           ↓
7️⃣ แสดง Preview
           ↓
8️⃣ กรอกข้อมูล (ชื่อ, ลิงก์, Alt text)
           ↓
9️⃣ กด "บันทึก"
           ↓
🔟 API อัปโหลดไปยัง Supabase Storage
           ↓
1️⃣1️⃣ บันทึกข้อมูลลง Database
           ↓
1️⃣2️⃣ แบนเนอร์แสดงบนเว็บไซต์ทันที! ✅
```

---

## 🔒 Security

- ใช้ Row Level Security (RLS) ของ Supabase
- ตรวจสอบ Admin role ก่อนทุก operation
- บันทึก Audit Log ทุกครั้งที่มีการเปลี่ยนแปลง
- ไฟล์รูปใน Storage เป็น public read only

---

## 📝 Error Codes

| Code | Description |
|------|-------------|
| `INVALID_POSITION` | ตำแหน่งแบนเนอร์ไม่ถูกต้อง |
| `INVALID_FILE_TYPE` | ประเภทไฟล์ไม่รองรับ |
| `FILE_TOO_LARGE` | ไฟล์ใหญ่เกิน 5MB |
| `INVALID_DIMENSIONS` | ขนาดรูปไม่ตรง |
| `POSITION_LIMIT_REACHED` | ตำแหน่งนี้เต็มแล้ว |
| `BANNER_NOT_FOUND` | ไม่พบแบนเนอร์ |
| `UNAUTHORIZED` | ไม่มีสิทธิ์เข้าถึง |
| `FORBIDDEN` | ต้องเป็น Admin เท่านั้น |
