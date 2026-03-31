import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDesc: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };

    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const products = await db.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    return NextResponse.json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!name || !description || !categoryId || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, categoryId, price' },
        { status: 400 }
      );
    }

    // Auto-generate slug from name if not provided
    let slug = providedSlug || generateSlug(name);

    // Check for unique slug
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku: sku || null,
        stock: parseInt(stock) || 0,
        featured: !!featured,
        categoryId,
        enhancedImage: enhancedImage || null,
        images: images || '[]',
        rawImage: rawImage || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
