
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, User, SiteContent, ToastNotification, ManagedBanner, AllBannersState, BannerPosition } from '../types';

// Default Mock Data for CMS
const DEFAULT_CONTENT: SiteContent = {
  hero: {
    displayMode: 'image', // 'text' = ข้อความอย่างเดียว, 'image' = รูปอย่างเดียว, 'overlay' = รูป+ข้อความซ้อน
    badge: 'OFFICIAL US IMPORTER',
    titleLine1: 'สินค้าอเมริกา',
    titleLine2: 'ส่งตรงถึงบ้านคุณ',
    description: 'พบกับสินค้าแบรนด์ดังกว่า 10,000 รายการ และบริการซื้อ Lotto USA ที่เชื่อถือได้ที่สุด',
    // Banner Images
    bannerImageDesktop: '/img/truvy1.png',
    bannerImageMobile: '/img/truvy1.png',
    bannerLink: '/category/all',
    bannerAltText: 'Truvamate - ปลอดภัย มั่นใจ ตรวจสอบได้',
    // Overlay Settings
    overlay: {
      enabled: true,
      position: 'center',
      backgroundColor: '#000000',
      backgroundOpacity: 40,
      showBadge: true,
      showTitle: true,
      showDescription: true,
      textColor: '#FFFFFF'
    },
    // CTA Buttons
    ctaButtons: [
      { text: 'ช้อปเลย', link: '/category/all', variant: 'primary', show: true },
      { text: 'วิธีสั่งซื้อ', link: '/how-to', variant: 'outline', show: true }
    ]
  },
  promoBanners: [
    { id: 1, image: '/img/herobaner/hero1.png', title: 'MEGA US SALE', subtitle: 'สินค้าแบรนด์ดังลดสูงสุด 70%' },
    { id: 2, image: '/img/herobaner/hero2.png', title: 'NEW ARRIVALS', subtitle: 'คอลเลคชั่นใหม่ส่งตรงจาก NYC' },
    { id: 3, image: '/img/herobaner/hero1.png', title: 'GADGET DEALS', subtitle: 'ไอทีราคาพิเศษเฉพาะสมาชิก PRIME' }
  ],
  categoryBanners: [
    { id: 1, title: 'Summer Collection', subtitle: 'สดใสรับซัมเมอร์', image: '/img/herobaner/hero1.png', link: '/category/fashion' },
    { id: 2, title: 'Vintage Vibes', subtitle: 'สไตล์วินเทจสุดคลาสสิค', image: '/img/herobaner/hero2.png', link: '/category/fashion' },
    { id: 3, title: 'Outdoor Living', subtitle: 'ตกแต่งสวนและมุมพักผ่อน', image: '/img/herobaner/hero1.png', link: '/category/home' },
    { id: 4, title: 'Gadget Zone', subtitle: 'เทคโนโลยีล้ำสมัย', image: '/img/herobaner/hero2.png', link: '/category/electronics' },
    { id: 5, title: 'Healthy Life', subtitle: 'วิตามินนำเข้าจาก USA', image: '/img/herobaner/hero1.png', link: '/category/vitamins' },
    { id: 6, title: 'Kids & Toys', subtitle: 'ของเล่นเสริมพัฒนาการ', image: '/img/herobaner/hero2.png', link: '/category/toys' }
  ]
};

// Default Managed Banners
const DEFAULT_MANAGED_BANNERS: ManagedBanner[] = [
  {
    id: 'hero-desktop-1',
    position: 'HOME_HERO',
    name: 'Hero Banner Desktop',
    description: 'แบนเนอร์หลักหน้าแรก',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/category/all',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'HERO_DESKTOP',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'US Prime - สินค้านำเข้าจากอเมริกา'
  },
  {
    id: 'hero-mobile-1',
    position: 'HOME_HERO_MOBILE',
    name: 'Hero Banner Mobile',
    description: 'แบนเนอร์หลักหน้าแรก (Mobile)',
    imageUrl: '/img/herobaner/hero2.png',
    link: '/category/all',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'HERO_MOBILE',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'US Prime Mobile'
  },
  {
    id: 'promo-1',
    position: 'HOME_PROMO_CAROUSEL',
    name: 'Promo Slider #1 - Mega Sale',
    description: 'แบนเนอร์โปรโมชัน Mega Sale',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/category/flash-sale',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'PROMO_CAROUSEL',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Mega US Sale'
  },
  {
    id: 'promo-2',
    position: 'HOME_PROMO_CAROUSEL',
    name: 'Promo Slider #2 - New Arrivals',
    description: 'แบนเนอร์สินค้าใหม่',
    imageUrl: '/img/herobaner/hero2.png',
    link: '/category/new',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'PROMO_CAROUSEL',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'New Arrivals'
  },
  {
    id: 'promo-3',
    position: 'HOME_PROMO_CAROUSEL',
    name: 'Promo Slider #3 - Gadgets',
    description: 'แบนเนอร์ Gadget Deals',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/category/electronics',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'PROMO_CAROUSEL',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Gadget Deals'
  },
  {
    id: 'flash-sale-1',
    position: 'HOME_FLASH_SALE',
    name: 'Flash Sale Banner',
    description: 'แบนเนอร์ Flash Sale',
    imageUrl: '/img/herobaner/hero2.png',
    link: '/category/flash-sale',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'SPECIAL_BANNER',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Flash Sale - Up to 70% Off'
  },
  {
    id: 'us-deals-1',
    position: 'HOME_US_DEALS',
    name: 'US Deals Banner',
    description: 'แบนเนอร์ US Deals',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/category/us-deals',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'SPECIAL_BANNER',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Exclusive US Deals'
  },
  {
    id: 'lotto-powerball-1',
    position: 'LOTTO_POWERBALL',
    name: 'Powerball Banner',
    description: 'แบนเนอร์ Powerball',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/lotto',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'LOTTO_BANNER',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Play Powerball Now'
  },
  {
    id: 'lotto-mega-1',
    position: 'LOTTO_MEGA_MILLIONS',
    name: 'Mega Millions Banner',
    description: 'แบนเนอร์ Mega Millions',
    imageUrl: '/img/herobaner/hero2.png',
    link: '/lotto',
    linkType: 'internal',
    isActive: true,
    sizeSpec: 'LOTTO_BANNER',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Play Mega Millions Now'
  },
  {
    id: 'footer-main-1',
    position: 'FOOTER_MAIN',
    name: 'Footer Banner',
    description: 'แบนเนอร์ท้ายเว็บ',
    imageUrl: '/img/herobaner/hero1.png',
    link: '/category/all',
    linkType: 'internal',
    isActive: false,
    sizeSpec: 'FOOTER_BANNER',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    altText: 'Shop US Products'
  }
];

interface GlobalContextType {
  cart: CartItem[];
  orders: Order[];
  wishlist: Product[];
  user: User | null;
  siteContent: SiteContent;
  isAuthenticated: boolean;
  notifications: ToastNotification[];
  // Banner Management
  managedBanners: AllBannersState;
  addToCart: (product: Product, quantity?: number, option?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (order: Order) => void;
  login: (email: string) => void;
  logout: () => void;
  updateSiteContent: (newContent: SiteContent) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Banner Management Functions
  updateBanner: (banner: ManagedBanner) => void;
  addBanner: (banner: ManagedBanner) => void;
  deleteBanner: (bannerId: string) => void;
  toggleBannerStatus: (bannerId: string) => void;
  getBannersByPosition: (position: BannerPosition) => ManagedBanner[];
  reorderBanners: (position: BannerPosition, newOrder: string[]) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persist state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('truvamate_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('truvamate_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('truvamate_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('truvamate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('truvamate_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  const [managedBanners, setManagedBanners] = useState<AllBannersState>(() => {
    const saved = localStorage.getItem('truvamate_managed_banners');
    return saved ? JSON.parse(saved) : { banners: DEFAULT_MANAGED_BANNERS, lastUpdated: new Date().toISOString() };
  });

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  useEffect(() => {
    localStorage.setItem('truvamate_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('truvamate_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('truvamate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem('truvamate_user', JSON.stringify(user));
    else localStorage.removeItem('truvamate_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('truvamate_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('truvamate_managed_banners', JSON.stringify(managedBanners));
  }, [managedBanners]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Cart Logic
  const addToCart = (product: Product, quantity = 1, option = 'Standard') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, selectedOption: option }];
    });
    showToast(`เพิ่ม "${product.title}" ลงตะกร้าแล้ว`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('ลบสินค้าออกจากตะกร้าแล้ว', 'info');
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast('ลบออกจากรายการโปรด', 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast('เพิ่มในรายการโปรดแล้ว', 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Order Logic
  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    showToast('สั่งซื้อสำเร็จ!', 'success');
  };

  // Auth Logic
  const login = (email: string) => {
    setUser({
      name: 'Admin User',
      email: email,
      memberSince: new Date().getFullYear().toString(),
      avatar: 'https://i.pravatar.cc/150?img=11'
    });
    showToast(`ยินดีต้อนรับ, Admin User`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('ออกจากระบบสำเร็จ', 'info');
  };

  const updateSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    showToast('บันทึกการแก้ไขเว็บไซต์เรียบร้อย', 'success');
  };

  // Banner Management Functions
  const updateBanner = (banner: ManagedBanner) => {
    setManagedBanners(prev => ({
      banners: prev.banners.map(b => b.id === banner.id ? { ...banner, updatedAt: new Date().toISOString() } : b),
      lastUpdated: new Date().toISOString()
    }));
    showToast('อัปเดตแบนเนอร์เรียบร้อย', 'success');
  };

  const addBanner = (banner: ManagedBanner) => {
    setManagedBanners(prev => ({
      banners: [...prev.banners, { ...banner, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      lastUpdated: new Date().toISOString()
    }));
    showToast('เพิ่มแบนเนอร์ใหม่เรียบร้อย', 'success');
  };

  const deleteBanner = (bannerId: string) => {
    setManagedBanners(prev => ({
      banners: prev.banners.filter(b => b.id !== bannerId),
      lastUpdated: new Date().toISOString()
    }));
    showToast('ลบแบนเนอร์เรียบร้อย', 'info');
  };

  const toggleBannerStatus = (bannerId: string) => {
    setManagedBanners(prev => ({
      banners: prev.banners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive, updatedAt: new Date().toISOString() } : b),
      lastUpdated: new Date().toISOString()
    }));
  };

  const getBannersByPosition = (position: BannerPosition): ManagedBanner[] => {
    return managedBanners.banners
      .filter(b => b.position === position)
      .sort((a, b) => a.order - b.order);
  };

  const reorderBanners = (position: BannerPosition, newOrder: string[]) => {
    setManagedBanners(prev => ({
      banners: prev.banners.map(b => {
        if (b.position === position) {
          const newIndex = newOrder.indexOf(b.id);
          return { ...b, order: newIndex + 1, updatedAt: new Date().toISOString() };
        }
        return b;
      }),
      lastUpdated: new Date().toISOString()
    }));
    showToast('เรียงลำดับแบนเนอร์เรียบร้อย', 'success');
  };

  return (
    <GlobalContext.Provider value={{
      cart,
      orders,
      wishlist,
      user,
      siteContent,
      isAuthenticated: !!user,
      notifications,
      managedBanners,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      login,
      logout,
      updateSiteContent,
      showToast,
      removeToast,
      updateBanner,
      addBanner,
      deleteBanner,
      toggleBannerStatus,
      getBannersByPosition,
      reorderBanners
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
