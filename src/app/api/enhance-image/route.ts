import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createZAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, WebP, and GIF are accepted.' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const timestamp = Date.now();
    const ext = path.extname(file.name) || '.jpg';

    const rawDir = path.join(process.cwd(), 'public', 'images', 'products', 'raw');
    const prodDir = path.join(process.cwd(), 'public', 'images', 'products');

    if (!existsSync(rawDir)) await mkdir(rawDir, { recursive: true });
    if (!existsSync(prodDir)) await mkdir(prodDir, { recursive: true });

    // Save original
    const rawFilename = `raw_${timestamp}${ext}`;
    await writeFile(path.join(rawDir, rawFilename), buffer);
    const originalUrl = `/images/products/raw/${rawFilename}`;

    // Get X-Token from incoming request for AI API auth
    const requestToken = request.headers.get('x-token') || undefined;

    // ── Step 1: VLM — analyze the uploaded product image ──
    let analysis = '';
    try {
      const zai = await createZAI(requestToken);
      const vlmResponse = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a product photo analyst. Look at this product image and describe ONLY the product in detail. Output in this exact JSON format (no markdown, no code fences):
{"product_type":"","main_color":"","material":"","key_features":"","brand_style":""}
Be concise and specific. Identify if it's a kitchen appliance, electronics, or other product type.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        thinking: { type: 'disabled' },
      });

      let rawContent = vlmResponse.choices[0]?.message?.content || '';
      // Strip code fences if present
      rawContent = rawContent.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
      analysis = rawContent;
    } catch (vlmError) {
      console.error('VLM analysis failed:', vlmError);
      return NextResponse.json({
        success: false,
        error: 'AI vision service is unavailable. Your photo has been saved and will be used directly.',
        originalUrl,
      });
    }

    // ── Step 2: Generate stunning professional product photo ──
    try {
      const zai = await createZAI(requestToken);

      const enhancementPrompt = `Premium e-commerce product photography. A professional studio-shot ${analysis} on a clean minimalist surface. Pure white background with very subtle soft gray gradient at the edges. Professional studio three-point lighting with soft shadows. Ultra sharp focus, shallow depth of field. The product is perfectly centered and slightly angled to show dimension. No text, no watermarks, no people, no hands. Commercial photography quality, photorealistic, 8K resolution. Clean, luxurious, trustworthy feel suitable for a premium Nigerian kitchen appliance brand website.`;

      const imgResponse = await zai.images.generations.create({
        prompt: enhancementPrompt,
        size: '1024x1024',
      });

      const enhancedBase64 = imgResponse.data[0].base64;
      const enhancedBuffer = Buffer.from(enhancedBase64, 'base64');

      const enhancedFilename = `enhanced_${timestamp}.png`;
      await writeFile(path.join(prodDir, enhancedFilename), enhancedBuffer);
      const enhancedUrl = `/images/products/${enhancedFilename}`;

      return NextResponse.json({
        success: true,
        originalUrl,
        enhancedUrl,
        analysis,
      });
    } catch (imgError) {
      console.error('Image generation failed:', imgError);
      return NextResponse.json({
        success: false,
        error: 'AI image generation is unavailable. Your photo has been saved and will be used directly.',
        originalUrl,
      });
    }
  } catch (error) {
    console.error('Error enhancing image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
