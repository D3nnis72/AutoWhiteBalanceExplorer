'use client';

/** Image upload panel component. */

import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

export interface ImageUploadPanelProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onFileDrop: (files: FileList) => void;
  error: string | null;
}

export function ImageUploadPanel({
  previewUrl,
  onFileSelect,
  onFileDrop,
  error,
}: ImageUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files);
      }
    },
    [onFileDrop]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          Upload a JPEG or PNG image to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/jpg,image/png'
          onChange={handleFileChange}
          className='hidden'
        />
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50'
        >
          {previewUrl ? (
            <div className='space-y-4'>
              <img
                src={previewUrl}
                alt='Preview'
                className='max-h-64 max-w-full rounded-lg object-contain'
              />
              <Button onClick={handleClick} variant='outline'>
                Change Image
              </Button>
            </div>
          ) : (
            <div className='space-y-4 text-center'>
              <p className='text-muted-foreground'>
                Drag and drop an image here, or
              </p>
              <Button onClick={handleClick}>Select Image</Button>
            </div>
          )}
          {error && <p className='mt-4 text-sm text-destructive'>{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
