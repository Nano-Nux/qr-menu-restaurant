import { NextResponse } from 'next/server';
import { getGallery, createGalleryItem, deleteGalleryItem } from '@/lib/db';

export async function GET() {
  try {
    const gallery = await getGallery();
    return NextResponse.json({ success: true, gallery });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { image, caption, category } = await req.json();
    if (!image) return NextResponse.json({ success: false, error: 'Image URL required' }, { status: 400 });
    const id = await createGalleryItem(image, caption || '', category || 'Culinary');
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing gallery id' }, { status: 400 });
    await deleteGalleryItem(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
