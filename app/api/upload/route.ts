import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedImageToDb } from '@/lib/db';

export async function GET() {
  const useSqliteEnv = process.env.USE_SQLITE ?? process.env.NEXT_PUBLIC_USE_SQLITE ?? 'true';
  const useSqlite = useSqliteEnv.toLowerCase() === 'true';

  const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryConfigured = Boolean(cloudinaryCloudName && (cloudinaryUploadPreset || process.env.CLOUDINARY_API_KEY));

  return NextResponse.json({
    useSqlite,
    cloudinaryConfigured,
    mode: useSqlite ? 'sqlite' : 'cloudinary'
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const useSqliteEnv = process.env.USE_SQLITE ?? process.env.NEXT_PUBLIC_USE_SQLITE ?? 'true';
    const useSqlite = useSqliteEnv.toLowerCase() === 'true';

    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // Direct Image Upload Choice
    if (useSqlite) {
      // Direct to SQLite .db database
      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeType = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const saved = await saveUploadedImageToDb(file.name, mimeType, dataUrl);
      return NextResponse.json({
        success: true,
        url: saved.dataUrl,
        storage: 'sqlite',
        id: saved.id
      });
    } else {
      // Use Cloudinary Setup
      if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
        // Fallback or error if Cloudinary variables are missing in env
        return NextResponse.json(
          {
            error: 'Cloudinary credentials missing in .env. Please configure CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET or set USE_SQLITE=true.'
          },
          { status: 400 }
        );
      }

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', cloudinaryUploadPreset);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData
        }
      );

      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        return NextResponse.json(
          { error: cloudData.error?.message || 'Failed to upload to Cloudinary' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        url: cloudData.secure_url,
        storage: 'cloudinary'
      });
    }
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: err.message || 'Image upload failed' }, { status: 500 });
  }
}
