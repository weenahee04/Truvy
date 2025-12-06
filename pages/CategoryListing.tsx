import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';
import { ProductCard } from '../components/Marketplace/ProductCard';

const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i}`,
  title: `US Product Sample Item ${i + 1}`,
  priceUSD: 20 + i * 5,
  priceTHB: 800 + i * 200,
  originalPriceTHB: 1200 + i * 200,
  image: `https://picsum.photos/400/400?random=${i + 20}`,
  rating: 4.5,
  sold: 50 + i * 10,
  isUSImport: true,
  category: 'General'
}));

export const CategoryListing: React.FC = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/category" className="hover:text-brand-navy">Category</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium capitalize">{slug || 'All Products'}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={20} /> ตัวกรอง
            </h3>
            
            {/* Category Filter */}
            <div className="border-b border-slate-200 pb-6 mb-6">
              <h4 className="font-medium mb-3">หมวดหมู่</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand-navy" /> วิตามิน & อาหารเสริม</li>
                <li className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand-navy" /> แฟชั่น & กระเป๋า</li>
                <li className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand-navy" /> อิเล็กทรอนิกส์</li>
                <li className="flex items-center gap-2"><input type="checkbox" className="rounded text-brand-navy" /> ของใช้ในบ้าน</li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="border-b border-slate-200 pb-6 mb-6">
              <h4 className="font-medium mb-3">ช่วงราคา (THB)</h4>
              <div className="flex items-center gap-2 mb-4">
                <input type="number" placeholder="Min" className="w-full border border-slate-300 rounded px-2 py-1 text-sm" />
                <span>-</span>
                <input type="number" placeholder="Max" className="w-full border border-slate-300 rounded px-2 py-1 text-sm" />
              </div>
              <button className="w-full py-1.5 bg-slate-100 text-slate-700 rounded text-sm font-medium hover:bg-brand-gold hover:text-slate-900 transition-colors">
                ค้นหา
              </button>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium mb-3">คะแนนสินค้า</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                 <li className="flex items-center gap-2 cursor-pointer hover:text-brand-navy">
                    <input type="radio" name="rating" className="text-brand-navy" /> 5 ดาว
                 </li>
                 <li className="flex items-center gap-2 cursor-pointer hover:text-brand-navy">
                    <input type="radio" name="rating" className="text-brand-navy" /> 4 ดาวขึ้นไป
                 </li>
                 <li className="flex items-center gap-2 cursor-pointer hover:text-brand-navy">
                    <input type="radio" name="rating" className="text-brand-navy" /> 3 ดาวขึ้นไป
                 </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-slate-900 capitalize">{slug || 'สินค้าทั้งหมด'} <span className="text-sm font-normal text-slate-500 ml-2">(12 รายการ)</span></h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">เรียงตาม:</span>
                <div className="relative group">
                  <button className="flex items-center gap-1 font-medium hover:text-brand-blue">
                    แนะนำ <ChevronDown size={14} />
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>
              
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-brand-navy text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                   onClick={() => setViewMode('list')}
                   className={`p-2 ${viewMode === 'list' ? 'bg-brand-navy text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="h-10 w-10 rounded-lg border border-slate-300 flex items-center justify-center hover:border-brand-navy hover:text-brand-navy transition-colors">1</button>
            <button className="h-10 w-10 rounded-lg border border-brand-navy bg-brand-navy text-white flex items-center justify-center">2</button>
            <button className="h-10 w-10 rounded-lg border border-slate-300 flex items-center justify-center hover:border-brand-navy hover:text-brand-navy transition-colors">3</button>
            <span className="flex items-end px-2 text-slate-400">...</span>
            <button className="h-10 w-10 rounded-lg border border-slate-300 flex items-center justify-center hover:border-brand-navy hover:text-brand-navy transition-colors">10</button>
          </div>
        </div>
      </div>
    </div>
  );
};