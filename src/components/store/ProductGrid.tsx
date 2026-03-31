'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, PackageX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  categoryId: string | null;
  featured?: boolean;
  search: string;
  sort: string;
}

export default function ProductGrid({
  categoryId,
  featured = false,
  search,
  sort,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryId) params.set('categoryId', categoryId);
      if (featured) params.set('featured', 'true');
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      } else {
        setError(json.error || 'Failed to load products');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [categoryId, featured, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section id="products-section" className="w-full py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#212121' }}>
            {search
              ? `Results for "${search}"`
              : featured
              ? 'Featured Products'
              : 'All Products'}
          </h2>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageX className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={fetchProducts}
            className="border-[#1A9B8C] text-[#1A9B8C] hover:bg-[#1A9B8C] hover:text-white"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageX className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No products found
          </h3>
          <p className="text-sm text-gray-500">
            {search
              ? 'Try adjusting your search terms.'
              : 'Check back later for new arrivals.'}
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
