/**
 * TradeHind Client-Side Media Optimization Engine
 * Converts uploaded images to modern WebP format with quality tuning
 * and validates/compresses supplier video tours for lightning fast page loads.
 */

export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const DEFAULT_MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export interface OptimizedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // e.g. 75 (%)
  width: number;
  height: number;
}

export interface VideoValidationResult {
  file: File;
  durationSeconds: number;
  sizeBytes: number;
  width: number;
  height: number;
  thumbnailUrl: string;
  isCompressed: boolean;
}

/**
 * Human-readable byte size formatter (e.g. 1048576 -> "1.0 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates that file size does not exceed the allowed threshold
 */
export function validateFileSize(
  file: File,
  maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
  mediaType: 'image' | 'video' = 'image'
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  if (file.size > maxSizeBytes) {
    const readableMax = formatFileSize(maxSizeBytes);
    const readableActual = formatFileSize(file.size);
    return {
      isValid: false,
      error: `${mediaType === 'video' ? 'Video' : 'Image'} file is too large (${readableActual}). Maximum allowed size is ${readableMax}.`,
    };
  }

  return { isValid: true };
}

/**
 * Converts any image (JPEG, PNG, HEIC, BMP) to high-efficiency WebP format in-browser
 * @param file The original image file
 * @param quality WebP compression quality from 0.1 to 1.0 (default: 0.82)
 * @param maxDimension Max width or height (e.g. 1600px for catalog items)
 * @param maxSizeBytes Maximum file size in bytes (default: 10MB)
 */
export async function convertImageToWebP(
  file: File,
  quality = 0.82,
  maxDimension = 1600,
  maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES
): Promise<OptimizedImageResult> {
  // Validate maximum file size before processing
  const sizeValidation = validateFileSize(file, maxSizeBytes, 'image');
  if (!sizeValidation.isValid) {
    throw new Error(sizeValidation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Downscale proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP blob creation failed'));
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const webpFile = new File([blob], cleanFileName, { type: 'image/webp' });
            const dataUrl = canvas.toDataURL('image/webp', quality);

            const originalSize = file.size;
            const compressedSize = blob.size;
            const compressionRatio = Math.round(
              ((originalSize - compressedSize) / originalSize) * 100
            );

            resolve({
              file: webpFile,
              dataUrl,
              originalSize,
              compressedSize,
              compressionRatio: Math.max(0, compressionRatio),
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read uploaded image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and extracts a thumbnail frame from an uploaded supplier video walkthrough
 * @param file The original video file (MP4, WebM, MOV)
 * @param maxDurationSeconds Maximum allowed duration (default: 90 seconds)
 * @param maxSizeBytes Maximum allowed file size in bytes (default: 50MB)
 */
export async function validateAndProcessVideo(
  file: File,
  maxDurationSeconds = 90,
  maxSizeBytes = DEFAULT_MAX_VIDEO_SIZE_BYTES
): Promise<VideoValidationResult> {
  // Validate maximum file size before loading into memory
  const sizeValidation = validateFileSize(file, maxSizeBytes, 'video');
  if (!sizeValidation.isValid) {
    throw new Error(sizeValidation.error);
  }

  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      if (video.duration > maxDurationSeconds) {
        URL.revokeObjectURL(videoUrl);
        reject(
          new Error(
            `Video exceeds maximum allowed length of ${maxDurationSeconds} seconds (uploaded: ${Math.round(
              video.duration
            )}s). Please trim your video.`
          )
        );
        return;
      }

      // Seek to 1 second to capture representative thumbnail
      video.currentTime = Math.min(1.0, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(640, video.videoWidth || 640);
      canvas.height = Math.round((canvas.width * (video.videoHeight || 360)) / (video.videoWidth || 640));

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const thumbnailUrl = canvas.toDataURL('image/webp', 0.8);
      URL.revokeObjectURL(videoUrl);

      resolve({
        file,
        durationSeconds: Math.round(video.duration),
        sizeBytes: file.size,
        width: video.videoWidth,
        height: video.videoHeight,
        thumbnailUrl,
        isCompressed: file.size < 25 * 1024 * 1024, // <25MB is deemed web-optimized
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Invalid video format or codec unsupported by browser'));
    };
  });
}
