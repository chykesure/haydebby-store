export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  stock: number;
  featured: boolean;
  categoryId: string;
  category?: Category;
  images: string;
  rawImage: string | null;
  enhancedImage: string | null;
  specs: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentRef: string | null;
  paidAt: string | null;
  userId: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
}

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { orders: number };
}
