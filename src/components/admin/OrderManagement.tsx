'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Eye,
  MoreHorizontal,
  Filter,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types';
import OrderDetailDialog from './OrderDetailDialog';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-orange-100 text-orange-800 border-orange-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LIST = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus } : prev
          );
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Sort by newest first
  const sortedOrders = [...filteredOrders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const statusCounts = STATUS_LIST.reduce(
    (acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track customer orders ({orders.length} total)
        </p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer px-3 py-1 text-sm hover:bg-gray-100 transition-colors"
          onClick={() => setStatusFilter('all')}
        >
          All ({orders.length})
        </Badge>
        {STATUS_LIST.map((status) => (
          <Badge
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            className={`cursor-pointer px-3 py-1 text-sm capitalize hover:bg-gray-100 transition-colors ${
              statusFilter === status ? '' : STATUS_COLORS[status] || ''
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status} ({statusCounts[status] || 0})
          </Badge>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              ))}
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingBag className="size-12 mb-3 opacity-30" />
              <p className="text-sm">No orders found</p>
              <p className="text-xs mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Orders will appear here once customers start purchasing'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className="font-medium text-sm">
                        {order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <p className="text-sm font-medium">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          handleStatusChange(order.id, v)
                        }
                      >
                        <SelectTrigger
                          className={`h-7 w-[130px] text-xs border-0 ${STATUS_COLORS[order.status] || ''}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_LIST.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="size-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {order.status !== 'delivered' &&
                            order.status !== 'cancelled' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                  Update Status
                                </DropdownMenuLabel>
                                {STATUS_LIST.filter(
                                  (s) => s !== order.status
                                ).map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() =>
                                      handleStatusChange(order.id, s)
                                    }
                                  >
                                    <CheckCircle2 className="size-4 mr-2" />
                                    Mark as{' '}
                                    <span className="capitalize">{s}</span>
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedOrder(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
