'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from './Navbar';
import HeroBanner from './HeroBanner';
import CategoryGrid from './CategoryGrid';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import OrderSuccess from './OrderSuccess';
import CartDrawer from './CartDrawer';
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog from '@/components/auth/RegisterDialog';
import { useAppStore } from '@/store/app-store';

export default function StoreView() {
  const { data: session } = useSession();
  const view = useAppStore((s) => s.view);
  const selectedProduct = useAppStore((s) => s.selectedProduct);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      setSearchQuery(e.detail);
    }) as EventListener;
    window.addEventListener('store-search', handler);
    return () => window.removeEventListener('store-search', handler);
  }, []);

  if (view === 'checkout') {
    return (
      <>
        <Checkout />
        <CartDrawer onLoginClick={() => setLoginOpen(true)} />
        <LoginDialog
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSwitchToRegister={() => setRegisterOpen(true)}
        />
        <RegisterDialog
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onSwitchToLogin={() => setLoginOpen(true)}
        />
      </>
    );
  }

  if (view === 'order-success') {
    return <OrderSuccess />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      {selectedProduct ? (
        <ProductDetail />
      ) : (
        <>
          <HeroBanner />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
            <ProductGrid
              categoryId={selectedCategory}
              search={searchQuery}
              sort="newest"
            />
          </div>
          <Footer />
        </>
      )}
      <CartDrawer onLoginClick={() => setLoginOpen(true)} />
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </div>
  );
}
