'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { Order } from '@/types';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-orange-100 text-orange-800 border-orange-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const ordersRes = await fetch('/api/orders');
      if (!ordersRes.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersRes.json();
      const orders: Order[] = ordersData.data || [];

      const productsRes = await fetch('/api/products');
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      const productsData = await productsRes.json();
      const products = productsData.data || [];

      // Compute stats
      const totalRevenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const pendingOrders = orders.filter((o) => o.status === 'pending').length;

      setStats({ totalRevenue, totalOrders, totalProducts, pendingOrders });

      // Compute last 7 days revenue data
      const now = new Date();
      const chartData: RevenueData[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = format(d, 'yyyy-MM-dd');
        const dayOrders = orders.filter(
          (o) =>
            o.status !== 'cancelled' &&
            format(new Date(o.createdAt), 'yyyy-MM-dd') === dateStr
        );
        chartData.push({
          date: format(d, 'EEE'),
          revenue: dayOrders.reduce((s, o) => s + o.total, 0),
          orders: dayOrders.length,
        });
      }
      setRevenueData(chartData);

      // Recent orders (latest 5)
      const sorted = [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sorted.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '...',
      icon: DollarSign,
      color: '#1A9B8C',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders.toString() : '...',
      icon: ShoppingBag,
      color: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+8.2%',
    },
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts.toString() : '...',
      icon: Package,
      color: '#8D6E63',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-700',
      trend: '+3',
    },
    {
      title: 'Pending Orders',
      value: stats ? stats.pendingOrders.toString() : '...',
      icon: Clock,
      color: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trend: stats && stats.pendingOrders === 0 ? 'All clear' : undefined,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                  {card.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {card.trend}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last week
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={`size-10 rounded-xl ${card.bgColor} flex items-center justify-center`}
                >
                  <card.icon className={`size-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
            {/* Decorative bottom border */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: card.color }}
            />
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
              <CardDescription>Last 7 days performance</CardDescription>
            </div>
            <Badge variant="outline" className="font-normal">
              Daily
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#1A9B8C"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#1A9B8C"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1A9B8C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders from your store</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No orders yet
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${STATUS_COLORS[order.status] || ''}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
