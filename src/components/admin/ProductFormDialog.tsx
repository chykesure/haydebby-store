'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Upload, Sparkles, ImagePlus, CheckCircle2, XCircle, Info } from 'lucide-react';
import type { Product, Category } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  shortDesc: z.string().max(300).optional().default(''),
  description: z.string().min(1, 'Description is required').max(5000),
  price: z.coerce.number().min(0, 'Price must be positive'),
  comparePrice: z.coerce.number().min(0).optional().default(0),
  sku: z.string().max(100).optional().default(''),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
  enhancedImage: z.string().optional().default(''),
  images: z.string().default('[]'),
  rawImage: z.string().optional().default(''),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: Category[];
}

export default function ProductFormDialog({
  product,
  open,
  onClose,
  onSave,
  categories,
}: ProductFormDialogProps) {
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      shortDesc: '',
      description: '',
      price: 0,
      comparePrice: 0,
      sku: '',
      stock: 0,
      categoryId: '',
      featured: false,
      enhancedImage: '',
      images: '[]',
      rawImage: '',
    },
  });

  // Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceNotice, setEnhanceNotice] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name || '',
          shortDesc: product.shortDesc || '',
          description: product.description || '',
          price: product.price,
          comparePrice: product.comparePrice || 0,
          sku: product.sku || '',
          stock: product.stock,
          categoryId: product.categoryId || '',
          featured: product.featured || false,
          enhancedImage: product.enhancedImage || '',
          images: product.images || '[]',
          rawImage: product.rawImage || '',
        });
        // Set preview states from existing product
        if (product.enhancedImage) {
          setEnhancedPreview(product.enhancedImage);
        }
        if (product.rawImage) {
          setPreviewUrl(product.rawImage);
          setUploadedUrl(product.rawImage);
        } else {
          // Try to get first image from images array
          try {
            const imgArr = JSON.parse(product.images || '[]');
            if (imgArr.length > 0) {
              setPreviewUrl(imgArr[0]);
              setUploadedUrl(imgArr[0]);
            }
          } catch {
            // ignore
          }
        }
      } else {
        form.reset({
          name: '',
          shortDesc: '',
          description: '',
          price: 0,
          comparePrice: 0,
          sku: '',
          stock: 0,
          categoryId: '',
          featured: false,
          enhancedImage: '',
          images: '[]',
          rawImage: '',
        });
      }
    }
    // Cleanup image state when dialog closes
    if (!open) {
      setSelectedFile(null);
      setUploadedUrl(null);
      setPreviewUrl(null);
      setEnhancedPreview(null);
      setUploading(false);
      setEnhancing(false);
      setEnhanceNotice(null);
    }
  }, [product, open, form]);

  const isSubmitting = form.formState.isSubmitting;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      return;
    }

    setSelectedFile(file);
    setEnhancedPreview(null);
    setEnhanceNotice(null);

    // Create local preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Immediately upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setUploadedUrl(data.url);
        // Set the images field with the uploaded URL
        form.setValue('images', JSON.stringify([data.url]));
        // Also set rawImage for the enhance-image flow
        form.setValue('rawImage', data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile && !uploadedUrl) return;

    setEnhancing(true);
    setEnhanceNotice(null);

    try {
      // Use the selected file (not the already-uploaded one)
      if (!selectedFile) {
        setEnhanceNotice('Please upload a new image to enhance.');
        setEnhancing(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch('/api/enhance-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.enhancedUrl) {
        setEnhancedPreview(data.enhancedUrl);
        form.setValue('enhancedImage', data.enhancedUrl);
        // Update images array to use enhanced image
        form.setValue('images', JSON.stringify([data.enhancedUrl]));
      } else {
        // AI enhancement failed — show gentle notice, don't block
        const message = data.error || 'AI enhancement is temporarily unavailable. Your uploaded photo will be used instead.';
        setEnhanceNotice(message);
      }
    } catch {
      setEnhanceNotice('AI enhancement is temporarily unavailable. Your uploaded photo will be used instead.');
    } finally {
      setEnhancing(false);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save product');
      }

      const data = await res.json();
      onSave(data.data);
    } catch (err) {
      console.error('Error saving product:', err);
      form.setError('root', {
        message: err instanceof Error ? err.message : 'Failed to save product',
      });
    }
  };

  // Determine what to show in the image preview section
  const hasImage = !!(previewUrl || enhancedPreview);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the product details below.'
              : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {form.formState.errors.root && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Product Image Section */}
            <div
              className="rounded-xl border-2 border-dashed p-4 space-y-4"
              style={{ borderColor: '#E6F7F5', backgroundColor: '#FAFFFE' }}
            >
              <div className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" style={{ color: '#1A9B8C' }} />
                <span className="text-sm font-semibold" style={{ color: '#1A9B8C' }}>
                  Product Image
                </span>
              </div>

              {/* Upload area - shown when no image yet */}
              {!hasImage && (
                <div
                  className="flex flex-col items-center justify-center gap-3 py-8 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-10 w-10 text-gray-300" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Upload Product Photo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click to select an image (JPEG, PNG, WebP)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Image preview + actions */}
              {(previewUrl || enhancedPreview) && (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-white border-2" style={{ borderColor: enhancedPreview ? '#1A9B8C' : '#e5e7eb' }}>
                    <img
                      src={enhancedPreview || previewUrl || ''}
                      alt="Product preview"
                      className="w-full h-48 object-cover"
                    />
                    {enhancedPreview && (
                      <div
                        className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1"
                        style={{ backgroundColor: '#1A9B8C' }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        AI Enhanced
                      </div>
                    )}
                    {!enhancedPreview && uploadedUrl && (
                      <div
                        className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                      >
                        Product Photo
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#1A9B8C' }} />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      {enhancedPreview ? 'Change Photo' : 'Upload Different'}
                    </Button>
                    {!enhancedPreview && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleEnhance}
                        disabled={enhancing || !selectedFile}
                        className="flex-1 text-white"
                        style={{ backgroundColor: '#1A9B8C' }}
                      >
                        {enhancing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                            AI is creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-1.5" />
                            Enhance with AI
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Enhancement loading */}
              {enhancing && (
                <div className="flex flex-col items-center gap-2 py-6">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1A9B8C' }} />
                  <p className="text-sm text-gray-600">AI is creating a professional photo...</p>
                  <p className="text-xs text-gray-400">This may take 10-20 seconds</p>
                </div>
              )}

              {/* AI enhancement notice (non-blocking) */}
              {enhanceNotice && (
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{enhanceNotice}</span>
                </div>
              )}

              {/* Upload status indicator */}
              {uploadedUrl && !enhancedPreview && !enhancing && (
                <p className="text-xs text-center" style={{ color: '#1A9B8C' }}>
                  <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  Photo uploaded and ready to use as the product image.
                </p>
              )}
            </div>

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Smart Air Fryer Pro"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief product tagline"
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Max 300 characters. Displayed in product cards.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed product description..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price and Compare Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₦) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare Price (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Original price for showing discounts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SKU and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HDB-AFR-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>
                      Featured products are highlighted on the store homepage.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || enhancing || uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || enhancing || uploading}
                style={
                  !isSubmitting
                    ? { backgroundColor: '#1A9B8C', borderColor: '#1A9B8C' }
                    : undefined
                }
                className="text-white"
              >
                {isSubmitting && (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                )}
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
