import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const image = db.productImages.find(img => img.id === id || img.productId === id);

  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  // If stored as Data URL (SVG or Base64)
  if (image.data.startsWith('data:')) {
    const [header, base64OrSvg] = image.data.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const contentType = mimeMatch ? mimeMatch[1] : image.mimeType;

    if (header.includes('base64')) {
      const buffer = Buffer.from(base64OrSvg, 'base64');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      // Raw URI-encoded SVG
      const decoded = decodeURIComponent(base64OrSvg);
      return new NextResponse(decoded, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return NextResponse.json({
    id: image.id,
    name: image.name,
    mimeType: image.mimeType,
    data: image.data,
  });
}
