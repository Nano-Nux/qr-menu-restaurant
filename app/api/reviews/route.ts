import { NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { customer_name, rating, comment, avatar } = await req.json();
    if (!customer_name || !comment) {
      return NextResponse.json({ success: false, error: 'Name and comment are required' }, { status: 400 });
    }
    const id = await createReview(customer_name, rating || 5, comment, avatar);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
