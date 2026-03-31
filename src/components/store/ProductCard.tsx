'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const selectProduct = useAppStore((s) => s.selectProduct);

  const images: string[] = (() => {
    try {
      return JSON.parse(product.images);
    } catch {
      return [];
    }
  })();
  const imageSrc = images[0] || `/images/products/${product.slug}.png`;

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleClick = () => {
    selectProduct(product.id);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-3.5 w-3.5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="group cursor-pointer border-gray-200 hover:border-[#1A9B8C]/40 hover:shadow-lg transition-all duration-300 overflow-hidden bg-white"
        onClick={handleClick}
      >
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />

            {/* Sale Badge */}
            {hasDiscount && (
              <Badge
                className="absolute top-3 left-3 text-white font-bold text-xs px-2 py-0.5"
                style={{ backgroundColor: '#F5A623' }}
              >
                -{discountPercent}%
              </Badge>
            )}

            {/* Featured Badge */}
            {product.featured && !hasDiscount && (
              <Badge
                className="absolute top-3 left-3 text-white font-bold text-xs px-2 py-0.5"
                style={{ backgroundColor: '#1A9B8C' }}
              >
                FEATURED
              </Badge>
            )}

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Category label */}
            {product.category && (
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#1A9B8C' }}>
                {product.category.name}
              </p>
            )}

            {/* Name */}
            <h3 className="font-medium text-sm text-gray-900 truncate mb-1" style={{ color: '#212121' }}>
              {product.name}
            </h3>

            {/* Description */}
            {product.shortDesc && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-2 min-h-[2rem]">
                {product.shortDesc}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold" style={{ color: '#212121' }}>
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.comparePrice!)}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.div
                    key="added"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="h-9 w-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1A9B8C' }}
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-gray-200 hover:border-[#1A9B8C] hover:bg-[#1A9B8C] hover:text-white transition-colors"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
