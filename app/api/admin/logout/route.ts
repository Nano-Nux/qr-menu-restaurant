import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'aurelia_admin_session',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0
  });
  return response;
}
