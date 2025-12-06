import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { BottomNav } from './components/Layout/BottomNav';
import { ToastContainer } from './components/ui/Toast';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Lotto } from './pages/Lotto';
import { Login } from './pages/Login';
import { CategoryListing } from './pages/CategoryListing';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerProducts } from './pages/SellerProducts';
import { SellerOrders } from './pages/SellerOrders';
import { AdminPanel } from './pages/AdminPanel';
import { AdminBannerPanel } from './pages/AdminBannerPanel';
import { HowToUse } from './pages/HowToUse';
import { Legal } from './pages/Legal';
import { Terms } from './pages/Terms';
import { GlobalProvider } from './context/GlobalContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isSellerRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Add padding bottom for mobile bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      {/* Hide footer on mobile or keep it at very bottom, typically mobile apps might hide extensive footers */}
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Router>
        <ToastContainer />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryListing />} />
            <Route path="/category" element={<CategoryListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lotto" element={<Lotto />} />
            
            {/* Seller Routes */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/orders" element={<SellerOrders />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/banners" element={<AdminBannerPanel />} />

            {/* Info Pages */}
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </GlobalProvider>
  );
};

export default App;