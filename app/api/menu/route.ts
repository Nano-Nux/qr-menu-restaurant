import { NextResponse } from 'next/server';
import { getCategories, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    const items = await getMenuItems();
    return NextResponse.json({ success: true, categories, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newId = await createMenuItem(body);
    return NextResponse.json({ success: true, id: newId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'Missing item id' }, { status: 400 });
    await updateMenuItem(id, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing item id' }, { status: 400 });
    await deleteMenuItem(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
