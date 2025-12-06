import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-8 border-t-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 uppercase">Truvamate</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              แพลตฟอร์มสั่งซื้อสินค้าจากอเมริกาและบริการฝากซื้อ Lotto USA อันดับ 1 
              สินค้าแท้ 100% ส่งตรงถึงหน้าบ้านคุณ ด้วยระบบ Logistics มาตรฐานสากล
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center hover:bg-brand-blue transition-colors text-white"><Facebook size={16} /></a>
              <a href="#" className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white"><Instagram size={16} /></a>
              <a href="#" className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors text-white"><Twitter size={16} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">บริการลูกค้า</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-gold transition-colors">ศูนย์ช่วยเหลือ</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">วิธีการสั่งซื้อ</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">การชำระเงิน</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">การจัดส่งสินค้า</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">นโยบายการคืนสินค้า</a></li>
            </ul>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-white font-bold mb-4">หมวดยอดนิยม</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/lotto" className="hover:text-brand-gold transition-colors">Lotto USA (Powerball)</Link></li>
              <li><Link to="/category/fashion" className="hover:text-brand-gold transition-colors">รองเท้า Sneaker</Link></li>
              <li><Link to="/category/fashion" className="hover:text-brand-gold transition-colors">กระเป๋า Brand Name</Link></li>
              <li><Link to="/category/vitamins" className="hover:text-brand-gold transition-colors">วิตามิน USA</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>123 Silom Tower, Floor 15,<br />Bangkok, Thailand 10500</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-gold shrink-0" />
                <span>02-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>support@truvamate.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2024 Truvamate Marketplace. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <Link to="/admin" className="hover:text-brand-gold flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
              <ShieldAlert size={12} /> Admin Only
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};