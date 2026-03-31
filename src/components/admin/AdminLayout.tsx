'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
  session?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export default function AdminLayout({
  activeTab,
  onTabChange,
  children,
  session,
}: AdminLayoutProps) {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('store')}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="size-4 mr-1" />
              <span className="hidden sm:inline">Back to Store</span>
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div
                className="size-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: '#1A9B8C' }}
              >
                H
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight text-gray-900">
                  HayDebby Admin
                </h1>
                <p className="text-xs text-muted-foreground leading-none hidden sm:block">
                  Smart Kitchen Appliances
                </p>
              </div>
            </div>
          </div>

          {/* Center: Tab Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as AdminTab)}
            className="hidden md:block"
          >
            <TabsList className="h-9 bg-gray-100/80">
              <TabsTrigger value="dashboard" className="gap-1.5 px-3">
                <LayoutDashboard className="size-3.5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5 px-3">
                <Package className="size-3.5" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5 px-3">
                <ShoppingBag className="size-3.5" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1.5 px-3">
                <Users className="size-3.5" />
                Users
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right: Admin Avatar */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="" alt={session?.user?.name || 'Admin'} />
                    <AvatarFallback
                      className="text-white text-xs font-semibold"
                      style={{ backgroundColor: '#1A9B8C' }}
                    >
                      {(session?.user?.name || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => { await signOut({ redirect: false }); window.location.href = '/'; }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden border-t">
          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as AdminTab)}
            className="w-full"
          >
            <TabsList className="w-full h-11 rounded-none bg-transparent border-b-0 p-0">
              <TabsTrigger
                value="dashboard"
                className="flex-1 gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A9B8C] data-[state=active]:bg-transparent data-[state=active]:shadow-none h-11"
              >
                <LayoutDashboard className="size-4" />
                <span className="text-xs">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex-1 gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A9B8C] data-[state=active]:bg-transparent data-[state=active]:shadow-none h-11"
              >
                <Package className="size-4" />
                <span className="text-xs">Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex-1 gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A9B8C] data-[state=active]:bg-transparent data-[state=active]:shadow-none h-11"
              >
                <ShoppingBag className="size-4" />
                <span className="text-xs">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1A9B8C] data-[state=active]:bg-transparent data-[state=active]:shadow-none h-11"
              >
                <Users className="size-4" />
                <span className="text-xs">Users</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
