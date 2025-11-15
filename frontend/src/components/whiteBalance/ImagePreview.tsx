'use client';

/** Image preview component for left side. */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ImagePreviewProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onFileDrop: (files: FileList) => void;
  error: string | null;
}

export function ImagePreview({
  previewUrl,
  onFileSelect,
  onFileDrop,
  error,
}: ImagePreviewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files);
      }
    },
    [onFileDrop]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader>
        <CardTitle>Original Image</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/jpg,image/png'
          onChange={handleFileChange}
          className='hidden'
        />
        {previewUrl ? (
          <div className='flex flex-col flex-1 space-y-4'>
            <div className='relative w-full flex-1 overflow-hidden rounded-lg border min-h-0'>
              <img
                src={previewUrl}
                alt='Original'
                className='w-full h-full object-contain'
              />
            </div>
            <Button onClick={handleClick} variant='outline' className='w-full'>
              Change Image
            </Button>
            {error && <p className='text-sm text-destructive'>{error}</p>}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className='flex flex-1 min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50'
          >
            <div className='space-y-4 text-center'>
              <p className='text-muted-foreground'>
                Drag and drop an image here, or
              </p>
              <Button onClick={handleClick}>Select Image</Button>
            </div>
            {error && <p className='mt-4 text-sm text-destructive'>{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

