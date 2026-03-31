'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import { toast } from '@/hooks/use-toast';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

interface CheckoutFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
}

export default function Checkout() {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShipping = useCartStore((s) => s.getShipping);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const setView = useAppStore((s) => s.setView);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const form = useForm<CheckoutFormValues>({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      city: '',
      state: '',
      notes: '',
    },
  });

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      form.setValue('customerName', session.user.name || '');
      form.setValue('customerEmail', session.user.email || '');
    }
  }, [session, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id || null,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });
      const json = await res.json();

      if (json.success) {
        setOrderNumber(json.data.orderNumber);
        clearCart();
        setView('order-success');
        toast({
          title: 'Order placed successfully!',
          description: `Order #${json.data.orderNumber} has been confirmed.`,
        });
      } else {
        toast({
          title: 'Order failed',
          description: json.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Success state (stays in this component briefly)
  if (orderNumber) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('store')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Button
                onClick={() => setView('store')}
                className="text-white font-medium"
                style={{ backgroundColor: '#1A9B8C' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#158A7A')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A9B8C')}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#E6F7F5' }}
                        >
                          <Phone className="h-4 w-4" style={{ color: '#1A9B8C' }} />
                        </div>
                        <h2 className="text-base font-semibold" style={{ color: '#212121' }}>
                          Contact Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="0801 234 5678"
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#E6F7F5' }}
                        >
                          <MapPin className="h-4 w-4" style={{ color: '#1A9B8C' }} />
                        </div>
                        <h2 className="text-base font-semibold" style={{ color: '#212121' }}>
                          Shipping Address
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12, Adeniyi Jones Avenue, Ikeja"
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Lagos"
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60">
                                  {NIGERIAN_STATES.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Order Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Delivery instructions, special requests..."
                                  {...field}
                                  className="border-gray-200 focus:border-[#1A9B8C] focus:ring-[#1A9B8C]/30 resize-none"
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#E6F7F5' }}
                        >
                          <CreditCard className="h-4 w-4" style={{ color: '#1A9B8C' }} />
                        </div>
                        <h2 className="text-base font-semibold" style={{ color: '#212121' }}>
                          Payment Method
                        </h2>
                      </div>

                      <div
                        className="rounded-xl p-4 border border-dashed"
                        style={{ borderColor: '#1A9B8C', backgroundColor: '#E6F7F5' }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Building2 className="h-5 w-5" style={{ color: '#1A9B8C' }} />
                          <span className="text-sm font-semibold" style={{ color: '#212121' }}>
                            Bank Transfer
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank:</span>
                            <span className="font-medium">Wema Bank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-medium">HayDebby Nigeria Ltd</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Number:</span>
                            <span className="font-medium font-mono">7820456781</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Transfer the exact amount and your order will be confirmed
                          within 24 hours.
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full text-white font-semibold text-base py-6 rounded-xl shadow-lg lg:hidden"
                      style={{ backgroundColor: '#1A9B8C' }}
                      onMouseEnter={(e) => {
                        if (!submitting) e.currentTarget.style.backgroundColor = '#158A7A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1A9B8C';
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        `Place Order - ${formatPrice(total)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Order Summary (sidebar) */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-base font-semibold mb-4" style={{ color: '#212121' }}>
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
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
                        <div key={item.product.id} className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <Image
                              src={imageSrc}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-gray-600 text-white text-[10px] font-bold">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: '#212121' }}>
                              {item.product.name}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: '#1A9B8C' }}>
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span style={{ color: '#1A9B8C' }}>Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-400">
                        Add {formatPrice(50000 - subtotal)} more for free shipping
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold" style={{ color: '#212121' }}>Total</span>
                      <span className="font-bold text-lg" style={{ color: '#1A9B8C' }}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    disabled={submitting}
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full text-white font-semibold text-base py-6 rounded-xl shadow-lg mt-6 hidden lg:flex"
                    style={{ backgroundColor: '#1A9B8C' }}
                    onMouseEnter={(e) => {
                      if (!submitting) e.currentTarget.style.backgroundColor = '#158A7A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1A9B8C';
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                        Trusted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
