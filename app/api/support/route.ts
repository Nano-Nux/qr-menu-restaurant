import { NextResponse } from 'next/server';
import { getSupportTickets, createSupportTicket, replyToSupportTicket, deleteSupportTicket } from '@/lib/db';

export async function GET() {
  try {
    const tickets = await getSupportTickets();
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_name, email, phone, subject, message } = body;
    if (!customer_name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 });
    }
    const id = await createSupportTicket(customer_name, email, phone || '', subject || '', message);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, admin_reply } = await req.json();
    if (!id || !admin_reply) {
      return NextResponse.json({ success: false, error: 'ID and reply content are required' }, { status: 400 });
    }
    await replyToSupportTicket(id, admin_reply);
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
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 });
    }
    await deleteSupportTicket(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
