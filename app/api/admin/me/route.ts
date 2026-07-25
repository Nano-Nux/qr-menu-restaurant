import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let sessionCookie = req.cookies.get('aurelia_admin_session')?.value;

    if (!sessionCookie) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionCookie = authHeader.substring(7);
      }
    }

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const sessionData = JSON.parse(decodedString);

    if (!sessionData || !sessionData.username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionData.id,
        username: sessionData.username,
        name: sessionData.name,
        role: sessionData.role
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
