import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = body?.username;
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await verifyAdminCredentials(username, password);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const sessionData = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      loginAt: Date.now()
    };

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: admin,
      token: sessionString
    });

    response.cookies.set({
      name: 'aurelia_admin_session',
      value: sessionString,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err: any) {
    console.error('Login route error:', err);
    return NextResponse.json({ error: err?.message || 'An unexpected error occurred during login' }, { status: 500 });
  }
}

