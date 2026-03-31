'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Loader2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import type { Product } from '@/types';

export default function ProductDetail() {
  const selectedProduct = useAppStore((s) => s.selectedProduct);
  const selectProduct = useAppStore((s) => s.selectProduct);
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!selectedProduct) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${selectedProduct}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [selectedProduct]);

  const handleClose = () => {
    selectProduct(null);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (!selectedProduct) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              Product Details
            </span>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1A9B8C' }} />
        </div>
      )}

      {/* Product Content */}
      {!loading && product && (
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                  {(() => {
                    const images: string[] = (() => {
                      try {
                        return JSON.parse(product.images);
                      } catch {
                        return [];
                      }
                    })();
                    const src = images[selectedImage] || `/images/products/${product.slug}.png`;
                    return (
                      <Image
                        src={src}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    );
                  })()}
                  {product.comparePrice && (
                    <Badge
                      className="absolute top-4 left-4 text-white font-bold text-sm px-3 py-1"
                      style={{ backgroundColor: '#F5A623' }}
                    >
                      SALE
                    </Badge>
                  )}
                </div>

                {/* Thumbnails */}
                {(() => {
                  try {
                    const images: string[] = JSON.parse(product.images);
                    if (images.length > 1) {
                      return (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedImage(i)}
                              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                                selectedImage === i
                                  ? 'border-[#1A9B8C]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image
                                src={img}
                                alt={`${product.name} ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </button>
                          ))}
                        </div>
                      );
                    }
                  } catch {
                    // no thumbnails
                  }
                  return null;
                })()}
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Category */}
                {product.category && (
                  <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1A9B8C' }}>
                    {product.category.name}
                  </p>
                )}

                {/* Name */}
                <h1 className="text-3xl font-bold" style={{ color: '#212121' }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: '#1A9B8C' }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                      <Badge
                        className="font-semibold"
                        style={{ backgroundColor: '#E6F7F5', color: '#1A9B8C' }}
                      >
                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Specs */}
                {(() => {
                  try {
                    const specs = JSON.parse(product.specs);
                    if (specs && typeof specs === 'object' && Object.keys(specs).length > 0) {
                      return (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Specifications
                          </h3>
                          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            {Object.entries(specs).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-500 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch {
                    // no specs
                  }
                  return null;
                })()}

                <Separator />

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() =>
                        setQuantity(Math.min(product.stock || 99, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stock */}
                  <span className="text-sm text-gray-500">
                    {product.stock > 0 ? (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: '#1A9B8C' }} />
                        In Stock ({product.stock} available)
                      </>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full text-white font-semibold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: addedToCart ? '#158A7A' : '#1A9B8C' }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addedToCart}
                >
                  {addedToCart ? (
                    '✓ Added to Cart!'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart - {formatPrice(product.price * quantity)}
                    </>
                  )}
                </Button>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-5 w-5" style={{ color: '#1A9B8C' }} />
                    <span className="text-xs text-gray-600 text-center">
                      Free Shipping Over ₦50k
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5" style={{ color: '#1A9B8C' }} />
                    <span className="text-xs text-gray-600 text-center">
                      12-Month Warranty
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <RotateCcw className="h-5 w-5" style={{ color: '#1A9B8C' }} />
                    <span className="text-xs text-gray-600 text-center">
                      7-Day Returns
                    </span>
                  </div>
                </div>

                {/* SKU */}
                {product.sku && (
                  <p className="text-xs text-gray-400">
                    SKU: {product.sku}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}
