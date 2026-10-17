import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let dataUrl = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      dataUrl = body.avatarData || body.image || '';
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = file.type || 'image/jpeg';
        dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    }

    if (!dataUrl || !dataUrl.startsWith('data:')) {
      return NextResponse.json(
        { error: 'Valid image file or Data URL is required' },
        { status: 400 }
      );
    }

    // Size limit check: max 4MB for avatars in DB
    if (dataUrl.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file size must be less than 4MB' },
        { status: 400 }
      );
    }

    // Update avatar in PostgreSQL / in-memory store
    const result = db.updateUserAvatar(auth.userId, dataUrl);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    db.addAuditLog(
      result.user.email,
      result.user.role,
      'UPLOAD_PROFILE_PICTURE',
      'USER',
      result.user.id,
      { avatarUrl: result.avatarUrl }
    );

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded and saved in database successfully',
      avatarUrl: result.avatarUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}
