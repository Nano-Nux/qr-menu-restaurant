import { NextResponse } from 'next/server';
import { getTableOrders, createTableOrder, updateTableOrderStatus, deleteTableOrder } from '@/lib/db';

export async function GET() {
  try {
    const orders = await getTableOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.table_number || !body.customer_name || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Table number, customer identification, and items are required' }, { status: 400 });
    }
    const id = await createTableOrder({
      table_number: String(body.table_number),
      customer_name: String(body.customer_name),
      items: body.items,
      total_amount: Number(body.total_amount) || 0
    });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Id and status are required' }, { status: 400 });
    }
    await updateTableOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }
    await deleteTableOrder(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
