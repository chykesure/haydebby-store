'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import type { AdminTab } from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#E6F7F5', borderTopColor: '#1A9B8C' }}
          />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return <AdminLogin />;
  }

  // Not admin
  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#FEE2E2' }}
          >
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            You don&apos;t have admin privileges. Only administrators can access this area.
          </p>
          <button
            onClick={async () => { await signOut({ redirect: false }); window.location.href = '/'; }}
            className="text-sm font-medium hover:underline"
            style={{ color: '#1A9B8C' }}
          >
            Sign out and try a different account
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} session={session}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'users' && <UserManagement />}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}
