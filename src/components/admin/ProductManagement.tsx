'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ImageIcon,
  Filter,
  Package,
} from 'lucide-react';
import type { Product, Category } from '@/types';
import ProductFormDialog from './ProductFormDialog';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (categoryFilter && categoryFilter !== 'all')
        params.set('categoryId', categoryFilter);
      params.set('sort', 'newest');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((p) => p.id !== deletingProduct.id)
        );
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      setProducts((prev) => [product, ...prev]);
    }
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product catalog ({products.length} items)
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="gap-2 shadow-sm"
          style={{ backgroundColor: '#1A9B8C', borderColor: '#1A9B8C' }}
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="size-4 mr-1 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-lg" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="size-12 mb-3 opacity-30" />
              <p className="text-sm">No products found</p>
              <p className="text-xs mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Stock
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const images: string[] = [];
                  try {
                    images.push(
                      ...JSON.parse(product.images || '[]')
                    );
                  } catch {
                    /* ignore */
                  }
                  const displayImage =
                    product.enhancedImage ||
                    product.rawImage ||
                    (images.length > 0 ? images[0] : null);

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={product.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">
                            {product.name}
                          </p>
                          {product.sku && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {product.category?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium text-sm">
                            {formatCurrency(product.price)}
                          </p>
                          {product.comparePrice &&
                            product.comparePrice > product.price && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(product.comparePrice)}
                              </p>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock < 5
                                ? 'text-yellow-600'
                                : 'text-gray-900'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`size-2 rounded-full ${
                              product.stock > 0
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span className="text-xs text-muted-foreground capitalize">
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.featured && (
                            <Badge
                              variant="outline"
                              className="ml-1 text-xs"
                              style={{
                                borderColor: '#F5A623',
                                color: '#C4841A',
                              }}
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
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
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil className="size-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        product={editingProduct}
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleSaveProduct}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {deletingProduct?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


