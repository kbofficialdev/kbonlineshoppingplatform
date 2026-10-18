import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let avatarDataUrl: string = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      avatarDataUrl = body.avatarData || '';
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No image file provided in upload' }, { status: 400 });
      }

      // Convert file buffer to Base64 Data URL for PostgreSQL database storage
      const buffer = Buffer.from(await file.arrayBuffer());
      const mime = file.type || 'image/png';
      avatarDataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type. Send JSON or multipart/form-data.' }, { status: 400 });
    }

    if (!avatarDataUrl || !avatarDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format. Must be a valid Data URL or image file (PNG, JPG, WEBP, SVG).' }, { status: 400 });
    }

    // Store in PostgreSQL memory media repository
    const result = db.updateUserAvatar(auth.userId, avatarDataUrl);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    db.addAuditLog(
      result.user.email,
      result.user.role,
      'USER_AVATAR_UPLOADED',
      'USER',
      result.user.id,
      { avatarUrl: result.avatarUrl, mediaLength: avatarDataUrl.length }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile picture uploaded and stored in database successfully',
      avatar: result.avatarUrl,
      avatarUrl: result.avatarUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

