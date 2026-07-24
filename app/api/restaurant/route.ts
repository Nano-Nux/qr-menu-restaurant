import { NextResponse } from 'next/server';
import { getRestaurantInfo, updateRestaurantInfo } from '@/lib/db';

export async function GET() {
  try {
    const restaurant = await getRestaurantInfo();
    return NextResponse.json({ success: true, data: restaurant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await updateRestaurantInfo(body);
    const updated = await getRestaurantInfo();
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
