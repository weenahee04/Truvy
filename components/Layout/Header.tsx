import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, Heart, Bell, LogOut, Package, Store, ChevronDown, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useGlobal } from '../../context/GlobalContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cart, user, isAuthenticated, logout } = useGlobal();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-brand-gold shadow-md text-slate-900 transition-all duration-300">
        {/* Top Bar - Desktop Only */}
        <div className="bg-slate-900 text-xs py-1.5 border-b border-slate-800 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-slate-300">
            <span>USA Import Marketplace & Lotto Service</span>
            <div className="flex items-center gap-4">
              <Link to="/seller" className="hover:text-white transition-colors flex items-center gap-1">
                <Store size={12} /> Seller Center
              </Link>
              <span className="text-slate-600">|</span>
              <button className="hover:text-white transition-colors">Help Center</button>
              <span className="text-slate-600">|</span>
              <button className="hover:text-white transition-colors">TH / EN</button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="py-3 md:py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start leading-none shrink-0 group">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 group-hover:opacity-80 transition-opacity uppercase">
                Truvamate
              </h1>
              <span className="text-[10px] text-slate-800 font-bold tracking-widest uppercase hidden md:block">Premium Marketplace</span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex relative shadow-sm">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสินค้าจากอเมริกา, วิตามิน, กระเป๋า..." 
                className="w-full h-11 pl-4 pr-14 rounded-lg text-slate-900 bg-white border-2 border-slate-900 focus:outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
              />
              <button type="submit" className="absolute right-0 top-0 h-11 w-14 flex items-center justify-center bg-slate-900 rounded-r-md hover:bg-slate-800 transition-colors text-brand-gold">
                <Search size={22} />
              </button>
            </form>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 md:hidden">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-900 hover:bg-black/5 rounded-full"
              >
                {isSearchOpen ? <X size={24} /> : <Search size={24} />}
              </button>
              <Link to="/profile" className="p-2 text-slate-900 hover:bg-black/5 rounded-full">
                <Bell size={24} />
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 sm:gap-6 text-slate-900">
              <Link to="/cart" className="relative p-2 hover:bg-yellow-400 rounded-full transition-colors group">
                <ShoppingCart size={26} className="text-slate-900" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-slate-900 text-brand-gold rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-brand-gold">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 group">
                    <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-brand-gold overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div className="hidden lg:block text-left leading-tight">
                      <div className="text-xs text-slate-800 font-medium">สวัสดี, {user?.name.split(' ')[0]}</div>
                      <div className="text-sm font-bold flex items-center gap-1">
                        บัญชีของฉัน <ChevronDown size={12} />
                      </div>
                    </div>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 hover:opacity-80">
                  <div className="h-9 w-9 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-brand-gold">
                    <User size={18} />
                  </div>
                  <div className="hidden lg:block text-left leading-tight">
                    <div className="text-xs text-slate-800 font-medium">เข้าสู่ระบบ</div>
                    <div className="text-sm font-bold">บัญชีของฉัน</div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar Expand */}
          {isSearchOpen && (
             <div className="md:hidden px-4 mt-2 pb-1 animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาสินค้า..." 
                  autoFocus
                  className="w-full h-10 pl-4 pr-10 rounded-lg text-slate-900 border-2 border-slate-900 focus:outline-none shadow-sm"
                />
                <button type="submit" className="absolute right-2 top-1.5 text-slate-500 hover:text-slate-900">
                  <Search size={20} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Navigation Links - Desktop Only */}
        <nav className="border-t border-slate-800 bg-slate-900 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-8 text-sm font-medium h-12 overflow-x-auto no-scrollbar">
              <li><Link to="/" className="text-brand-gold border-b-2 border-brand-gold h-full flex items-center font-bold">หน้าแรก</Link></li>
              <li><Link to="/category/fashion" className="hover:text-brand-gold h-full flex items-center transition-colors text-white">แฟชั่น USA</Link></li>
              <li><Link to="/category/vitamins" className="hover:text-brand-gold h-full flex items-center transition-colors text-white">วิตามิน & อาหารเสริม</Link></li>
              <li><Link to="/category/electronics" className="hover:text-brand-gold h-full flex items-center transition-colors text-white">อิเล็กทรอนิกส์</Link></li>
              <li><Link to="/lotto" className="text-brand-gold font-bold h-full flex items-center hover:text-yellow-200">LOTTO USA (Jackpot)</Link></li>
              <li><Link to="/category/flash-sale" className="hover:text-brand-gold h-full flex items-center transition-colors text-white">Flash Sale</Link></li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};