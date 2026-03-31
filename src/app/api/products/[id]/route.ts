import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      slug: providedSlug,
      description,
      shortDesc,
      price,
      comparePrice,
      sku,
      stock,
      featured,
      categoryId,
      enhancedImage,
      images,
      rawImage,
    } = body;

    // Check product exists
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (providedSlug !== undefined) {
      updateData.slug = providedSlug;
    } else if (name !== undefined) {
      // Auto-generate slug from name
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      updateData.slug = generatedSlug;
    }
    if (description !== undefined) updateData.description = description;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc || null;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (comparePrice !== undefined)
      updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
    if (featured !== undefined) updateData.featured = !!featured;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (enhancedImage !== undefined) updateData.enhancedImage = enhancedImage || null;
    if (images !== undefined) updateData.images = images;
    if (rawImage !== undefined) updateData.rawImage = rawImage || null;

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
