import { NextRequest, NextResponse } from 'next/server';
import { updateAdminCredentials, verifyAdminCredentials } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let sessionCookie = req.cookies.get('aurelia_admin_session')?.value;
    if (!sessionCookie) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionCookie = authHeader.substring(7);
      }
    }
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedString = Buffer.from(sessionCookie, 'base64').toString('utf-8');
    const sessionData = JSON.parse(decodedString);

    if (!sessionData || !sessionData.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, newName } = await req.json();

    if (currentPassword) {
      const isValid = await verifyAdminCredentials(sessionData.username, currentPassword);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
    }

    if (newPassword && newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    const updated = await updateAdminCredentials(sessionData.username, newPassword, newName);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Admin credentials updated successfully' });
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
