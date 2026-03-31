'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  ShoppingCart,
  Settings,
  X,
  LogOut,
  User,
  Package,
  ShieldCheck,
} from 'lucide-react';

const BRAND = {
  teal: '#1A9B8C',
  orange: '#F5A623',
};

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const setView = useAppStore((s) => s.setView);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (val: string) => {
    setSearch(val);
    window.dispatchEvent(new CustomEvent('store-search', { detail: val }));
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          className="flex items-center gap-2"
          onClick={() => setView('store')}
        >
          <Image
            src="/images/logo.png"
            alt="haydebby logo"
            width={120}
            height={40}
            className="h-8 w-auto object-contain sm:h-10"
            priority
          />
        </button>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search appliances..."
              className="pl-10 focus-visible:ring-[#1A9B8C]/30 focus-visible:border-[#1A9B8C]"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* User Section */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback
                      className="text-white text-sm font-semibold"
                      style={{ backgroundColor: BRAND.teal }}
                    >
                      {getInitial(session.user.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 leading-tight">
                      {session.user.name}
                    </span>
                    {session.user.role === 'admin' && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 mt-0.5"
                        style={{
                          backgroundColor: '#E6F7F5',
                          color: BRAND.teal,
                        }}
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session.user.role === 'admin' && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setView('admin')}
                      className="cursor-pointer"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {session.user.role === 'customer' && (
                  <DropdownMenuItem
                    onClick={() => setView('admin')}
                    className="cursor-pointer"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                )}
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
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="border-[#1A9B8C] text-[#1A9B8C] hover:bg-[#E6F7F5] font-medium"
            >
              <User className="h-4 w-4 mr-1.5" />
              Login
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 hover:text-gray-700"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs text-white"
                style={{ backgroundColor: BRAND.orange }}
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center justify-between">
                <Image
                  src="/images/logo.png"
                  alt="haydebby logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Search appliances..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => { handleSearch(e.target.value); setMobileOpen(false); }}
                />
              </div>

              {/* User Section in Mobile */}
              {session?.user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback
                        className="text-white text-sm font-semibold"
                        style={{ backgroundColor: BRAND.teal }}
                      >
                        {getInitial(session.user.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      {session.user.role === 'admin' && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 mt-0.5"
                          style={{
                            backgroundColor: '#E6F7F5',
                            color: BRAND.teal,
                          }}
                        >
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 w-full"
                    onClick={() => { setView('admin'); setMobileOpen(false); }}
                  >
                    {session.user.role === 'admin' ? (
                      <><ShieldCheck className="h-5 w-5" /> Dashboard</>
                    ) : (
                      <><Package className="h-5 w-5" /> My Orders</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 w-full text-red-600 hover:text-red-700"
                    onClick={async () => { await signOut({ redirect: false }); setMobileOpen(false); window.location.href = '/'; }}
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="justify-center gap-2 w-full border-[#1A9B8C] text-[#1A9B8C]"
                  onClick={() => { onLoginClick(); setMobileOpen(false); }}
                >
                  <User className="h-5 w-5" />
                  Login / Register
                </Button>
              )}

              <Button
                variant="ghost"
                className="justify-start gap-3"
                onClick={() => { toggleCart(); setMobileOpen(false); }}
              >
                <ShoppingCart className="h-5 w-5" /> Cart ({totalItems})
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
