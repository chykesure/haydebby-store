'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types';

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

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate a mock timeline based on order status
function generateTimeline(order: Order) {
  const timeline: {
    status: string;
    label: string;
    time: string;
    completed: boolean;
    isCurrent: boolean;
  }[] = [];

  const created = new Date(order.createdAt);
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);

  if (order.status === 'cancelled') {
    timeline.push(
      {
        status: 'pending',
        label: 'Order Placed',
        time: format(created, 'MMM dd, yyyy h:mm a'),
        completed: true,
        isCurrent: false,
      },
      {
        status: 'cancelled',
        label: 'Order Cancelled',
        time: format(new Date(order.updatedAt), 'MMM dd, yyyy h:mm a'),
        completed: false,
        isCurrent: true,
      }
    );
    return timeline;
  }

  statuses.forEach((status, index) => {
    const isActive = index <= currentIndex;
    const isCurrent = index === currentIndex;
    const date = new Date(created);
    date.setHours(date.getHours() + index * 6); // Mock: each step 6h apart

    timeline.push({
      status,
      label:
        status === 'pending'
          ? 'Order Placed'
          : status === 'confirmed'
            ? 'Order Confirmed'
            : status === 'processing'
              ? 'Processing'
              : status === 'shipped'
                ? 'Shipped'
                : 'Delivered',
      time: format(date, 'MMM dd, yyyy h:mm a'),
      completed: isActive,
      isCurrent,
    });
  });

  return timeline;
}

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailDialog({
  order,
  open,
  onClose,
  onStatusChange,
}: OrderDetailDialogProps) {
  if (!order) return null;

  const timeline = generateTimeline(order);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg">
                  Order {order.orderNumber}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Placed on{' '}
                  {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                </DialogDescription>
              </div>
              <Badge
                variant="outline"
                className={`capitalize text-sm px-3 py-1 ${STATUS_COLORS[order.status] || ''}`}
              >
                {order.status}
              </Badge>
            </div>
          </DialogHeader>

          {/* Status Update */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Update Status:
            </span>
            <Select
              value={order.status}
              onValueChange={(v) => onStatusChange(order.id, v)}
            >
              <SelectTrigger className="w-[180px]">
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
          </div>
        </div>

        <Separator />

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="size-4" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium truncate">
                      {order.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="size-4" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium">{order.address}</p>
                <p className="text-muted-foreground mt-1">
                  {order.city}, {order.state}
                </p>
                {order.notes && (
                  <p className="text-muted-foreground mt-2 italic">
                    Note: {order.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="size-4" />
                Order Items ({order.items.length})
              </h3>
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 overflow-hidden">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100/60 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="size-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    {/* Line Total */}
                    <p className="text-sm font-semibold shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="size-4" />
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0
                      ? 'Free'
                      : formatCurrency(order.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
                {order.paymentRef && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Reference
                    </span>
                    <span className="font-mono text-xs">{order.paymentRef}</span>
                  </div>
                )}
                {order.paidAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid At</span>
                    <span className="font-medium">
                      {format(new Date(order.paidAt), 'MMM dd, yyyy h:mm a')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="size-4" />
                Order Timeline
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-0">
                  {timeline.map((step, index) => {
                    const Icon = STATUS_ICONS[step.status] || Clock;
                    const isLast = index === timeline.length - 1;

                    return (
                      <div key={step.status} className="flex gap-3">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                              step.completed
                                ? step.isCurrent
                                  ? 'ring-2 ring-offset-2 ring-gray-300'
                                  : ''
                                : 'bg-gray-200'
                            }`}
                            style={
                              step.completed
                                ? {
                                    backgroundColor:
                                      step.status === 'cancelled'
                                        ? '#EF4444'
                                        : '#1A9B8C',
                                  }
                                : undefined
                            }
                          >
                            <Icon
                              className={`size-3.5 ${
                                step.completed ? 'text-white' : 'text-gray-400'
                              }`}
                            />
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 flex-1 min-h-[24px] ${
                                step.completed
                                  ? step.status === 'cancelled'
                                    ? 'bg-red-300'
                                    : 'bg-green-300'
                                  : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`pb-4 ${isLast ? 'pb-0' : ''}`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              step.completed
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {step.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
