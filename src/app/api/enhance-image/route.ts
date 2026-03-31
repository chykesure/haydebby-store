import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const ext = path.extname(file.name) || '.jpg';

    const prodDir = path.join(process.cwd(), 'public', 'images', 'products');
    if (!existsSync(prodDir)) await mkdir(prodDir, { recursive: true });

    const filename = product_ + timestamp + ext;
    await writeFile(path.join(prodDir, filename), buffer);
    const imageUrl = /images/products/ + filename;

    return NextResponse.json({ success: true, originalUrl: imageUrl, enhancedUrl: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ success: false, error: 'Failed to process image' }, { status: 500 });
  }
}
