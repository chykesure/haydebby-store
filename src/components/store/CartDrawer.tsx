'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';

interface CartDrawerProps {
  onLoginClick: () => void;
}

export default function CartDrawer({ onLoginClick }: CartDrawerProps) {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const setView = useAppStore((s) => s.setView);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!session?.user) {
      closeCart();
      onLoginClick();
      return;
    }
    closeCart();
    setView('checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2 text-lg" style={{ color: '#212121' }}>
            <ShoppingBag className="h-5 w-5" style={{ color: '#1A9B8C' }} />
            Your Cart
            {items.length > 0 && (
              <span
                className="ml-1 text-sm font-medium"
                style={{ color: '#1A9B8C' }}
              >
                ({items.length} item{items.length !== 1 ? 's' : ''})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#E6F7F5' }}
            >
              <ShoppingBag className="h-8 w-8" style={{ color: '#1A9B8C' }} />
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#212121' }}>
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Add some smart appliances to get started!
            </p>
            <Button
              onClick={closeCart}
              className="text-white font-medium"
              style={{ backgroundColor: '#1A9B8C' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#158A7A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A9B8C')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const images: string[] = (() => {
                      try {
                        return JSON.parse(item.product.images);
                      } catch {
                        return [];
                      }
                    })();
                    const imageSrc =
                      images[0] || `/images/products/${item.product.slug}.png`;

                    return (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0">
                          <Image
                            src={imageSrc}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium truncate" style={{ color: '#212121' }}>
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-sm font-semibold mt-1" style={{ color: '#1A9B8C' }}>
                            {formatPrice(item.product.price)}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-gray-200 rounded-md bg-white">
                              <button
                                className="h-7 w-7 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                className="h-7 w-7 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500 ml-auto">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="border-t border-gray-100 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-500">
                    {shipping === 0 ? (
                      <span style={{ color: '#1A9B8C' }}>Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above ₦50,000
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold" style={{ color: '#212121' }}>
                    Total
                  </span>
                  <span className="font-bold text-lg" style={{ color: '#1A9B8C' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {!session?.user && (
                <div
                  className="rounded-lg p-3 text-sm text-center"
                  style={{ backgroundColor: '#FFF8E1', color: '#F5A623' }}
                >
                  <LogIn className="h-4 w-4 inline mr-1.5" />
                  Please log in to proceed with checkout
                </div>
              )}

              <Button
                size="lg"
                className="w-full text-white font-semibold py-6 rounded-xl"
                style={{ backgroundColor: '#1A9B8C' }}
                onClick={handleCheckout}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#158A7A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A9B8C')}
              >
                {session?.user ? (
                  <>
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Checkout
                  </>
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
