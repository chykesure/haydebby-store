import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Check order exists
    const existingOrder = await db.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
