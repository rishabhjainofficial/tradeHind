import { NextResponse } from 'next/server';
import {
  DEFAULT_MAX_IMAGE_SIZE_BYTES,
  DEFAULT_MAX_VIDEO_SIZE_BYTES,
  formatFileSize,
} from '@/lib/media-optimizer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mediaType = (formData.get('mediaType') as string) === 'video' ? 'video' : 'image';

    if (!file) {
      return NextResponse.json(
        { error: 'No media file attached to upload request.' },
        { status: 400 }
      );
    }

    // Strict Max File Size Validation
    const maxSizeBytes =
      mediaType === 'video' ? DEFAULT_MAX_VIDEO_SIZE_BYTES : DEFAULT_MAX_IMAGE_SIZE_BYTES;

    if (file.size > maxSizeBytes) {
      const readableMax = formatFileSize(maxSizeBytes);
      const readableActual = formatFileSize(file.size);
      return NextResponse.json(
        {
          error: `File size (${readableActual}) exceeds the maximum allowed limit of ${readableMax} for ${mediaType}s.`,
          maxAllowedBytes: maxSizeBytes,
          uploadedBytes: file.size,
        },
        { status: 400 }
      );
    }

    const isWebP = file.type === 'image/webp' || file.name.endsWith('.webp');
    const assetId = `asset_${Date.now()}`;
    const generatedUrl = `/uploads/${assetId}_${file.name}`;

    return NextResponse.json({
      success: true,
      message: isWebP
        ? 'WebP optimized asset validated and uploaded successfully.'
        : 'Media file validated and uploaded successfully.',
      asset: {
        id: assetId,
        fileName: file.name,
        fileType: file.type,
        isWebP,
        sizeBytes: file.size,
        readableSize: formatFileSize(file.size),
        url: generatedUrl,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process media upload payload.' },
      { status: 500 }
    );
  }
}
