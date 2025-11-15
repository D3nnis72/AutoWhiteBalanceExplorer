/** Hook for handling image upload and preview. */

import { useCallback, useEffect, useState } from 'react';
import { createImageUrl, revokeImageUrl, validateImageFile } from '@/lib/imageHelpers';

export interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  handleFileSelect: (file: File) => void;
  handleFileDrop: (files: FileList) => void;
  clearImage: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setFile(selectedFile);
    const url = createImageUrl(selectedFile);
    setPreviewUrl(url);
  }, []);

  const handleFileDrop = useCallback((files: FileList) => {
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const clearImage = useCallback(() => {
    if (previewUrl) {
      revokeImageUrl(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeImageUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    file,
    previewUrl,
    error,
    handleFileSelect,
    handleFileDrop,
    clearImage,
  };
}

