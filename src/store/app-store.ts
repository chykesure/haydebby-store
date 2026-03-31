import { create } from 'zustand';

interface AppStore {
  view: 'store' | 'admin' | 'checkout' | 'order-success';
  selectedProduct: string | null;
  setView: (view: AppStore['view']) => void;
  selectProduct: (productId: string | null) => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  view: 'store',
  selectedProduct: null,
  setView: (view) => set({ view, selectedProduct: view === 'store' ? null : undefined }),
  selectProduct: (productId) => set({ selectedProduct: productId }),
}));
