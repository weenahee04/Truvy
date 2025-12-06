
import React, { useRef, useState, useEffect } from 'react';
import { ProductCard } from '../components/Marketplace/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Zap, ShieldCheck, Truck, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

const MOCK_PRODUCTS = [
  { id: '1', title: 'Vitamin C 1000mg Kirkland Signature', priceUSD: 15, priceTHB: 590, originalPriceTHB: 890, image: 'https://picsum.photos/400/400?random=1', rating: 4.8, sold: 1200, isUSImport: true, category: 'Vitamins' },
  { id: '2', title: 'Coach Zip Tote Bag Black Leather', priceUSD: 120, priceTHB: 4500, originalPriceTHB: 8900, image: 'https://picsum.photos/400/400?random=2', rating: 5.0, sold: 54, isUSImport: true, isFlashSale: true, category: 'Fashion' },
  { id: '3', title: 'Yeti Rambler 20 oz Tumbler', priceUSD: 35, priceTHB: 1290, image: 'https://picsum.photos/400/400?random=3', rating: 4.5, sold: 340, isUSImport: true, category: 'Home' },
  { id: '4', title: 'Apple Airpods Pro 2nd Gen', priceUSD: 249, priceTHB: 8900, image: 'https://picsum.photos/400/400?random=4', rating: 4.9, sold: 2100, isUSImport: true, category: 'Electronics' },
  { id: '5', title: 'New Balance 530 White/Silver', priceUSD: 99, priceTHB: 3990, image: 'https://picsum.photos/400/400?random=5', rating: 4.7, sold: 120, isUSImport: true, category: 'Fashion' },
  { id: '6', title: 'Bath & Body Works Candle', priceUSD: 25, priceTHB: 890, originalPriceTHB: 1290, image: 'https://picsum.photos/400/400?random=6', rating: 4.6, sold: 560, isUSImport: true, category: 'Home' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { siteContent } = useGlobal(); // Get content from Global State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [currentHero, setCurrentHero] = useState(0);

  const { hero, promoBanners, categoryBanners } = siteContent;

  // Hero images for fullscreen carousel
  const heroImages = [
    { src: '/img/herobaner/hero1.png', alt: 'Truvamate - สินค้าอเมริกาแท้', link: '/category/all' },
    { src: '/img/herobaner/hero2.png', alt: 'Truvamate - ส่งตรงถึงบ้านคุณ', link: '/category/flash-sale' },
  ];

  // Auto-slide for Hero Carousel
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [heroImages.length]);

  // Auto-slide for Promo Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoBanners.length]);

  const nextPromo = () => {
    setCurrentPromo((prev) => (prev + 1) % promoBanners.length);
  };

  const prevPromo = () => {
    setCurrentPromo((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, children } = scrollContainerRef.current;
      if (children.length > 0) {
        const cardWidth = children[0].getBoundingClientRect().width;
        const gap = 16;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        setActiveBanner(index);
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const scrollToBanner = (index: number) => {
    if (scrollContainerRef.current) {
      const { children } = scrollContainerRef.current;
      if (children[0]) {
        const cardWidth = children[0].getBoundingClientRect().width;
        const gap = 16;
        scrollContainerRef.current.scrollTo({
          left: index * (cardWidth + gap),
          behavior: 'smooth'
        });
        setActiveBanner(index);
      }
    }
  };

  // Get overlay styles
  const getOverlayPositionClass = () => {
    switch (hero.overlay?.position) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      default: return 'items-center text-center';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* NEW: Hero Fullscreen Carousel */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh]">
          {heroImages.map((img, index) => (
            <Link
              key={index}
              to={img.link}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentHero 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Subtle gradient overlay for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </Link>
          ))}
          
          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentHero 
                    ? 'w-8 h-2 bg-brand-gold' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={() => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold hover:text-black text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 hover:opacity-100 md:opacity-60 md:hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentHero((prev) => (prev + 1) % heroImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold hover:text-black text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 hover:opacity-100 md:opacity-60 md:hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Optional: Slide Counter */}
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentHero + 1} / {heroImages.length}
          </div>
        </div>
      </section>

      {/* NEW: Secondary Promo Banner Section - Editable */}
      <section className="w-full relative group overflow-hidden bg-slate-900">
        <div 
          className="flex transition-transform duration-700 ease-out h-[300px] md:h-[420px]" 
          style={{ transform: `translateX(-${currentPromo * 100}%)` }}
        >
          {promoBanners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full relative">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-8 w-full">
                  <div className="max-w-xl space-y-4 animate-in slide-in-from-left duration-700 fade-in">
                    <span className="text-brand-gold font-bold tracking-widest text-sm uppercase bg-black/50 px-3 py-1 rounded-sm inline-block backdrop-blur-sm">
                      Special Offer
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-none drop-shadow-lg">
                      {banner.title}
                    </h2>
                    <p className="text-slate-200 text-lg font-medium drop-shadow-md">
                      {banner.subtitle}
                    </p>
                    <div className="pt-4">
                      <Button onClick={() => navigate('/category/flash-sale')} className="shadow-lg hover:scale-105 transition-transform">
                        Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevPromo}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold hover:text-black text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextPromo}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold hover:text-black text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {promoBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPromo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentPromo === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-slate-100 py-10 shadow-sm relative z-20 -mt-8 mx-4 rounded-xl max-w-7xl md:mx-auto border-t-4 border-brand-gold">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-slate-900 shrink-0">
              <ShieldCheck />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">ของแท้ 100%</h4>
              <p className="text-xs text-slate-500">ตรวจสอบได้ทุกชิ้น</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-slate-900 shrink-0">
              <Truck />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">ส่งตรงจาก USA</h4>
              <p className="text-xs text-slate-500">เคลียร์ภาษีเรียบร้อย</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-slate-900 shrink-0">
              <CreditCard />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">ชำระเงินปลอดภัย</h4>
              <p className="text-xs text-slate-500">รองรับทุกธนาคารไทย</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-slate-900 shrink-0">
              <Zap />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">ส่งไว 7-14 วัน</h4>
              <p className="text-xs text-slate-500">สำหรับสินค้า Air Freight</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories - Editable */}
      <section className="max-w-7xl mx-auto px-4 relative group">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-brand-gold block"></span>
            หมวดหมู่ยอดนิยม
          </h2>
          <div className="flex gap-2">
             <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-200 hover:bg-black hover:text-white text-slate-900 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <button onClick={() => scroll('right')} className="p-3 rounded-full border border-slate-200 hover:bg-black hover:text-white text-slate-900 transition-colors">
               <ChevronRight size={20} />
             </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {categoryBanners.map((banner, index) => (
            <div 
              key={index} 
              className="min-w-[280px] md:min-w-[400px] aspect-[16/10] relative rounded-none overflow-hidden cursor-pointer snap-start group/card shadow-none border-2 border-transparent hover:border-brand-gold transition-all"
              onClick={() => navigate(banner.link || '/category')}
            >
              <img 
                src={banner.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 filter grayscale group-hover/card:grayscale-0" 
                alt={banner.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-brand-gold font-bold text-sm mb-1 opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
                  {banner.subtitle}
                </span>
                <h3 className="text-white text-2xl font-bold tracking-tight uppercase italic">{banner.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {categoryBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToBanner(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeBanner === idx 
                  ? 'w-8 bg-brand-gold' 
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Flash Sale - Black Background with Yellow Accents */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-4xl font-black italic text-brand-gold tracking-tighter transform -skew-x-6">FLASH SALE</h2>
              <div className="flex gap-2 text-black font-black text-xl">
                <span className="bg-brand-gold px-3 py-1 rounded-sm">02</span>
                <span className="text-brand-gold flex items-center">:</span>
                <span className="bg-brand-gold px-3 py-1 rounded-sm">15</span>
                <span className="text-brand-gold flex items-center">:</span>
                <span className="bg-brand-gold px-3 py-1 rounded-sm">40</span>
              </div>
            </div>
            <Link to="/category/flash-sale" className="text-sm font-bold text-brand-gold border-b border-brand-gold hover:text-white hover:border-white transition-colors flex items-center gap-1">
              ดูทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MOCK_PRODUCTS.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-black rounded-sm block"></span>
            สินค้าขายดีประจำสัปดาห์
          </h2>
          <Button variant="outline" onClick={() => navigate('/category/best-sellers')}>ดูทั้งหมด</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {MOCK_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={`${product.id}-dup`} product={{...product, id: `${product.id}-dup`}} />
          ))}
        </div>
      </section>

      {/* Lotto Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-gold rounded-none relative overflow-hidden border-2 border-black">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="inline-block bg-black text-brand-gold px-3 py-1 text-xs font-bold tracking-widest uppercase mb-2">Jackpot Alert</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">US Powerball & Mega Millions</h2>
              <p className="text-slate-800 font-medium max-w-lg text-lg">
                ลุ้นรางวัลแจ็กพอตระดับโลกได้แล้ววันนี้ บริการฝากซื้อสลากกินแบ่งจากตัวแทนที่ได้รับอนุญาตในสหรัฐฯ
              </p>
              <div className="pt-4">
                 <Button size="lg" variant="secondary" onClick={() => navigate('/lotto')} className="shadow-lg">เลือกเลขของคุณ</Button>
              </div>
            </div>
            <div className="flex gap-4 scale-90 md:scale-100">
               <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                  <span className="text-black font-black text-2xl">PB</span>
               </div>
               <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,215,0,1)] border-4 border-brand-gold">
                  <span className="text-brand-gold font-black text-2xl">MM</span>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
