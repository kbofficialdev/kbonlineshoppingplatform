import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const contentType = req.headers.get('content-type') || '';

    // 1. Multipart Form Data (File Picker upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const productId = (formData.get('productId') as string) || 'prod-custom';

      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save to public/uploads directory
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${sanitizedName}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      const imgId = `img-${Date.now()}`;

      // Register in DB productImages
      db.productImages.push({
        id: imgId,
        productId,
        name: file.name,
        mimeType: file.type || 'image/jpeg',
        data: publicUrl,
        isPrimary: true,
        createdAt: new Date().toISOString(),
      });
      db.saveToDisk();

      return NextResponse.json({
        success: true,
        url: publicUrl,
        id: imgId,
        message: 'Image uploaded successfully',
      });
    }

    // 2. JSON Base64 or External URL upload
    const body = await req.json();
    const { data: rawData, name, productId = 'prod-custom', isExternalUrl } = body;

    if (!rawData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    let publicUrl = rawData;
    const imgId = `img-${Date.now()}`;

    // If base64 data URL, convert to file in public/uploads for optimal web delivery
    if (rawData.startsWith('data:image/')) {
      const [header, base64Data] = rawData.split(',');
      const extMatch = header.match(/image\/(png|jpeg|jpg|webp|gif)/);
      const ext = extMatch ? (extMatch[1] === 'jpeg' ? 'jpg' : extMatch[1]) : 'jpg';

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      publicUrl = `/uploads/${filename}`;
    }

    db.productImages.push({
      id: imgId,
      productId,
      name: name || 'Uploaded Garment Photography',
      mimeType: rawData.startsWith('data:') ? 'image/jpeg' : 'image/webp',
      data: publicUrl,
      isPrimary: true,
      createdAt: new Date().toISOString(),
    });
    db.saveToDisk();

    return NextResponse.json({
      success: true,
      url: publicUrl,
      id: imgId,
      message: 'Product photography registered successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Image upload failed' }, { status: 500 });
  }
}

