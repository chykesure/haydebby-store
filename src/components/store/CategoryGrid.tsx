'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import {
  CupSoda,
  Coffee,
  ChefHat,
  Flame,
  Wind,
  Zap,
  UtensilsCrossed,
  GlassWater,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Category } from '@/types';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  blenders: CupSoda,
  'coffee-makers': Coffee,
  cooking: Flame,
  'food-processors': UtensilsCrossed,
  microwaves: Zap,
  small: Zap,
  toasters: ChefHat,
  juicers: GlassWater,
  air: Wind,
  default: ChefHat,
};

function getCategoryIcon(slug: string): ComponentType<{ className?: string }> {
  const normalized = slug.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalized.includes(key)) return icon;
  }
  return iconMap.default;
}

export default function CategoryGrid({
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full py-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2 px-1">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(null)}
            className={
              selectedCategory === null
                ? 'text-white font-medium rounded-full px-5 shrink-0 shadow-sm'
                : 'rounded-full px-5 shrink-0 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }
            style={
              selectedCategory === null
                ? { backgroundColor: '#1A9B8C' }
                : undefined
            }
            onMouseEnter={(e) => {
              if (selectedCategory === null) {
                e.currentTarget.style.backgroundColor = '#158A7A';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory === null) {
                e.currentTarget.style.backgroundColor = '#1A9B8C';
              }
            }}
          >
            All Products
          </Button>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const isActive = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectCategory(isActive ? null : cat.id)}
                className={
                  isActive
                    ? 'text-white font-medium rounded-full px-5 shrink-0 shadow-sm'
                    : 'rounded-full px-5 shrink-0 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
                style={
                  isActive ? { backgroundColor: '#1A9B8C' } : undefined
                }
                onMouseEnter={(e) => {
                  if (isActive) {
                    e.currentTarget.style.backgroundColor = '#158A7A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isActive) {
                    e.currentTarget.style.backgroundColor = '#1A9B8C';
                  }
                }}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {cat.name}
                {cat.productCount !== undefined && cat.productCount > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({cat.productCount})
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
