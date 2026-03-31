'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';

export default function OrderSuccess() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mx-auto mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#E6F7F5' }}
          >
            <CheckCircle2 className="h-10 w-10" style={{ color: '#1A9B8C' }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ color: '#212121' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Order Placed Successfully!
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-gray-500 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          Thank you for shopping with HayDebby!
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Package className="h-4 w-4" />
          <span>
            You&apos;ll receive a confirmation email with your order details shortly.
          </span>
        </motion.div>

        {/* Order timeline info */}
        <motion.div
          className="bg-gray-50 rounded-xl p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            What&apos;s next?
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A9B8C' }}>
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-sm text-gray-600">Transfer payment to our bank account</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A9B8C' }}>
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-sm text-gray-600">We confirm your payment within 24hrs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A9B8C' }}>
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <span className="text-sm text-gray-600">Your order ships to your doorstep!</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <Button
            size="lg"
            className="w-full text-white font-semibold py-6 rounded-xl"
            style={{ backgroundColor: '#1A9B8C' }}
            onClick={() => setView('store')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#158A7A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A9B8C')}
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
