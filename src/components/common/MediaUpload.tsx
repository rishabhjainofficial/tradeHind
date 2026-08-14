'use client';

import React, { useState, useRef } from 'react';
import {
  convertImageToWebP,
  validateAndProcessVideo,
  validateFileSize,
  formatFileSize,
  DEFAULT_MAX_IMAGE_SIZE_BYTES,
  DEFAULT_MAX_VIDEO_SIZE_BYTES,
  OptimizedImageResult,
  VideoValidationResult,
} from '@/lib/media-optimizer';
import { UploadCloud, Image as ImageIcon, Video, CheckCircle2, AlertCircle, X, Sparkles, Loader2 } from 'lucide-react';

interface MediaUploadProps {
  acceptType?: 'image' | 'video';
  maxDimension?: number;
  maxSizeBytes?: number;
  quality?: number;
  label?: string;
  helperText?: string;
  onImageOptimized?: (result: OptimizedImageResult) => void;
  onVideoOptimized?: (result: VideoValidationResult) => void;
}

export default function MediaUpload({
  acceptType = 'image',
  maxDimension = 1600,
  maxSizeBytes,
  quality = 0.82,
  label = 'Upload Media Asset',
  helperText,
  onImageOptimized,
  onVideoOptimized,
}: MediaUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<OptimizedImageResult | null>(null);
  const [videoResult, setVideoResult] = useState<VideoValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolved max size limit based on type
  const effectiveMaxBytes =
    maxSizeBytes ||
    (acceptType === 'video' ? DEFAULT_MAX_VIDEO_SIZE_BYTES : DEFAULT_MAX_IMAGE_SIZE_BYTES);

  const defaultHelperText =
    acceptType === 'image'
      ? `Auto-converts to WebP format. Max file size: ${formatFileSize(effectiveMaxBytes)}.`
      : `Max length 90s, max size: ${formatFileSize(effectiveMaxBytes)}.`;

  const handleFile = async (file: File) => {
    setError(null);

    // 1. Validate Max File Size before any processing
    const sizeCheck = validateFileSize(file, effectiveMaxBytes, acceptType);
    if (!sizeCheck.isValid) {
      setError(sizeCheck.error || 'File size exceeds maximum allowed limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);

    try {
      if (acceptType === 'image') {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please upload a valid image file (PNG, JPEG, WebP, BMP).');
        }
        const optimized = await convertImageToWebP(file, quality, maxDimension, effectiveMaxBytes);
        setImageResult(optimized);
        if (onImageOptimized) onImageOptimized(optimized);
      } else {
        if (!file.type.startsWith('video/')) {
          throw new Error('Please upload a valid video file (MP4, WebM, MOV).');
        }
        const videoRes = await validateAndProcessVideo(file, 90, effectiveMaxBytes);
        setVideoResult(videoRes);
        if (onVideoOptimized) onVideoOptimized(videoRes);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process media file');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearMedia = () => {
    setImageResult(null);
    setVideoResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
          {label}
        </label>
      )}

      {/* Dropzone Box */}
      {!imageResult && !videoResult ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? '2px dashed #008080' : '2px dashed #cbd5e1',
            background: isDragging ? '#e6f2f2' : '#f8fafc',
            borderRadius: '12px',
            padding: '1.75rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept={acceptType === 'image' ? 'image/*' : 'video/*'}
            style={{ display: 'none' }}
          />

          {isProcessing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#008080' }}>
              <Loader2 className="animate-spin" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {acceptType === 'image' ? 'Compressing & Converting to WebP...' : 'Processing & Optimizing Video...'}
              </span>
            </div>
          ) : (
            <>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#e6f2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#008080',
                }}
              >
                {acceptType === 'image' ? (
                  <ImageIcon style={{ width: '24px', height: '24px' }} />
                ) : (
                  <Video style={{ width: '24px', height: '24px' }} />
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Click or drag {acceptType === 'image' ? 'photo' : 'video'} to upload
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {helperText || defaultHelperText}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Optimized Preview Card */
        <div
          style={{
            border: '1px solid #bbf7d0',
            background: '#f0fdf4',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Media Thumbnail */}
          {imageResult && (
            <img
              src={imageResult.dataUrl}
              alt="Optimized WebP Preview"
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #86efac',
              }}
            />
          )}

          {videoResult && (
            <img
              src={videoResult.thumbnailUrl}
              alt="Video Thumbnail"
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #86efac',
              }}
            />
          )}

          {/* Details & Savings Badge */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              {imageResult ? 'Converted to WebP & Compressed' : 'Video Validated & Optimized'}
            </div>

            {imageResult && (
              <div style={{ fontSize: '0.8rem', color: '#166534', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span>
                  {formatFileSize(imageResult.originalSize)} ➔ <strong>{formatFileSize(imageResult.compressedSize)}</strong>
                </span>
                <span
                  style={{
                    background: '#22c55e',
                    color: '#ffffff',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Sparkles style={{ width: '11px', height: '11px' }} />
                  {imageResult.compressionRatio}% Smaller / Faster
                </span>
              </div>
            )}

            {videoResult && (
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                Duration: <strong>{videoResult.durationSeconds}s</strong> • Size: <strong>{formatFileSize(videoResult.sizeBytes)}</strong>
              </div>
            )}
          </div>

          {/* Clear Button */}
          <button
            type="button"
            onClick={clearMedia}
            style={{
              border: 'none',
              background: '#ffffff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#64748b',
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontSize: '0.8rem' }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          {error}
        </div>
      )}
    </div>
  );
}
