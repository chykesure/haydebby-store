import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      notes,
      items,
      paymentMethod,
      paymentRef,
      userId,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !state) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer fields' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Fetch all products for the order items
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist and check stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for "${product.name}". Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      productName: string;
      productImage: string | null;
      price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      const firstImage = (() => {
        try {
          const parsed = JSON.parse(product.images || '[]');
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        } catch {
          return null;
        }
      })();

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        productImage: product.enhancedImage || product.rawImage || firstImage,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Shipping: free above ₦50,000, otherwise ₦2,500
    const shipping = subtotal >= 50000 ? 0 : 2500;
    const total = subtotal + shipping;

    // Generate unique order number: HD-XXXXXX
    const orderNumber = `HD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order with items in a transaction
    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        state,
        notes: notes || null,
        subtotal,
        shipping,
        total,
        status: 'pending',
        paymentMethod: paymentMethod || 'bank_transfer',
        paymentRef: paymentRef || null,
        userId: userId || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Decrement stock for each product
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
