/** Hook for white balance API communication. */

import { useCallback, useState } from 'react';
import { applyWhiteBalance } from '@/lib/apiClient';
import { base64ToDataUrl } from '@/lib/imageHelpers';
import type { ProcessedImage, WhiteBalanceRequest } from '@/lib/types';

export interface UseWhiteBalanceApiReturn {
  processImage: (file: File, request: WhiteBalanceRequest) => Promise<ProcessedImage>;
  isProcessing: boolean;
  error: string | null;
}

export function useWhiteBalanceApi(): UseWhiteBalanceApiReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (file: File, request: WhiteBalanceRequest): Promise<ProcessedImage> => {
      setIsProcessing(true);
      setError(null);

      try {
        const response = await applyWhiteBalance(file, request);
        const imageSrc = base64ToDataUrl(response.image_base64);

        return {
          imageSrc,
          algorithm: response.algorithm,
          processingSpace: response.processing_space,
          avgRgbBefore: response.avg_rgb_before,
          avgRgbAfter: response.avg_rgb_after,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    processImage,
    isProcessing,
    error,
  };
}

