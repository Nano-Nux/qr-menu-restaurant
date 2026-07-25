import { NextResponse } from 'next/server';
import { getServerCalls, createServerCall, updateServerCallStatus, deleteServerCall } from '@/lib/db';

export async function GET() {
  try {
    const calls = await getServerCalls();
    return NextResponse.json({ success: true, calls });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { table_number, request_type } = await req.json();
    if (!table_number || !request_type) {
      return NextResponse.json({ success: false, error: 'Table number and request type required' }, { status: 400 });
    }
    const id = await createServerCall(table_number, request_type);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ success: false, error: 'Id and status required' }, { status: 400 });
    await updateServerCallStatus(id, status);
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
      return NextResponse.json({ success: false, error: 'Call ID is required' }, { status: 400 });
    }
    await deleteServerCall(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
