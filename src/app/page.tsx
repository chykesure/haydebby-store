'use client';

import { useAppStore } from '@/store/app-store';
import StoreView from '@/components/store/StoreView';
import AdminPanel from '@/components/admin/AdminPanel';

export default function Home() {
  const view = useAppStore((s) => s.view);

  if (view === 'admin') {
    return <AdminPanel />;
  }

  return <StoreView />;
}

