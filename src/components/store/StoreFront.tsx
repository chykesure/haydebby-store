'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import Navbar from './Navbar';
import HeroBanner from './HeroBanner';
import CategoryGrid from './CategoryGrid';
import ProductGrid from './ProductGrid';
import ProductDetail from './ProductDetail';
import CartDrawer from './CartDrawer';
import Checkout from './Checkout';
import OrderSuccess from './OrderSuccess';
import Footer from './Footer';

export default function StoreFront() {
  const view = useAppStore((s) => s.view);
  const selectedProduct = useAppStore((s) => s.selectedProduct);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Listen for search events from Navbar
  useEffect(() => {
    const handleSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSearchQuery(customEvent.detail || '');
    };
    window.addEventListener('store-search', handleSearch);
    return () => window.removeEventListener('store-search', handleSearch);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar always visible */}
      <Navbar />

      {/* Cart Drawer always available */}
      <CartDrawer />

      {/* Product Detail overlay */}
      <AnimatePresence>
        {selectedProduct && view === 'store' && <ProductDetail />}
      </AnimatePresence>

      {/* Main Content */}
      {view === 'store' && !selectedProduct && (
        <main className="flex-1">
          {/* Hero */}
          <HeroBanner />

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Sort & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#1A9B8C] focus:ring-1 focus:ring-[#1A9B8C]/30 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Product Grid */}
            <ProductGrid
              categoryId={selectedCategory}
              search={searchQuery}
              sort={sortBy}
            />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      )}

      {/* Checkout */}
      {view === 'checkout' && <Checkout />}

      {/* Order Success */}
      {view === 'order-success' && <OrderSuccess />}
    </div>
  );
}
