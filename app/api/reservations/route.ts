import { NextResponse } from 'next/server';
import { getReservations, createReservation } from '@/lib/db';

export async function GET() {
  try {
    const reservations = await getReservations();
    return NextResponse.json({ success: true, reservations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.guest_name || !body.email || !body.phone || !body.date || !body.time) {
      return NextResponse.json({ success: false, error: 'Missing required reservation fields' }, { status: 400 });
    }
    const id = await createReservation(body);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
