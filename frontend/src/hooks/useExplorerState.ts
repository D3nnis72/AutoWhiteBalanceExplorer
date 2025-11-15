/** Central hook for explorer UI state management. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useImageUpload } from './useImageUpload';
import { useWhiteBalanceApi } from './useWhiteBalanceApi';
import type {
  ColorSpace,
  ColorSpaceMode,
  ExplorerState,
  ProcessedImage,
  WhiteBalanceAlgorithm,
} from '@/lib/types';

export interface UseExplorerStateReturn extends ExplorerState {
  toggleAlgorithm: (algorithm: WhiteBalanceAlgorithm) => void;
  setAlgorithms: (algorithms: WhiteBalanceAlgorithm[]) => void;
  setSplitViewAlgorithm: (algorithm: WhiteBalanceAlgorithm | null) => void;
  setColorSpaceMode: (mode: ColorSpaceMode) => void;
  setInputColorSpace: (space: ColorSpace) => void;
  setProcessingSpace: (space: ColorSpace) => void;
  setImage: (file: File) => void;
  reprocess: () => Promise<void>;
  clearImage: () => void;
}

export function useExplorerState(): UseExplorerStateReturn {
  const imageUpload = useImageUpload();
  const whiteBalanceApi = useWhiteBalanceApi();

  const [selectedAlgorithms, setSelectedAlgorithms] = useState<
    WhiteBalanceAlgorithm[]
  >(['grey_world']);
  const [
    splitViewAlgorithm,
    setSplitViewAlgorithm,
  ] = useState<WhiteBalanceAlgorithm | null>('grey_world');
  const [colorSpaceMode, setColorSpaceMode] = useState<ColorSpaceMode>('auto');
  const [inputColorSpace, setInputColorSpace] = useState<ColorSpace>('sRGB');
  const [processingSpace, setProcessingSpace] = useState<ColorSpace>(
    'linear_rgb'
  );
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessingInternal, setIsProcessingInternal] = useState(false);
  const processingRef = useRef(false);

  // Auto mode: automatically set to sRGB input and linear RGB processing
  useEffect(() => {
    if (colorSpaceMode === 'auto') {
      setInputColorSpace('sRGB');
      setProcessingSpace('linear_rgb');
    }
  }, [colorSpaceMode]);

  // Reprocess when settings change
  useEffect(() => {
    if (
      !imageUpload.file ||
      processingRef.current ||
      whiteBalanceApi.isProcessing ||
      selectedAlgorithms.length === 0
    ) {
      return;
    }

    processingRef.current = true;
    let cancelled = false;

    const processImages = async () => {
      setIsProcessingInternal(true);
      try {
        // Determine actual color spaces to use
        const actualInputSpace =
          colorSpaceMode === 'auto' ? 'sRGB' : inputColorSpace;
        const actualProcessingSpace =
          colorSpaceMode === 'auto' ? 'linear_rgb' : processingSpace;

        // Process all selected algorithms in parallel
        const promises = selectedAlgorithms.map((algorithm) =>
          whiteBalanceApi.processImage(imageUpload.file!, {
            algorithm,
            input_color_space: actualInputSpace,
            processing_space: actualProcessingSpace,
          })
        );

        const results = await Promise.all(promises);
        if (!cancelled) {
          setProcessedImages(results);
          // Ensure split view algorithm is set if not already set or if current one is not in results
          setSplitViewAlgorithm((prev) => {
            if (prev && results.some((r) => r.algorithm === prev)) {
              return prev;
            }
            return results.length > 0 ? results[0].algorithm : null;
          });
        }
      } catch (error) {
        // Error is handled by useWhiteBalanceApi
        if (!cancelled) {
          console.error('Failed to process images:', error);
        }
      } finally {
        if (!cancelled) {
          setIsProcessingInternal(false);
          processingRef.current = false;
        }
      }
    };

    processImages();

    return () => {
      cancelled = true;
      processingRef.current = false;
    };
  }, [
    selectedAlgorithms,
    imageUpload.file,
    colorSpaceMode,
    inputColorSpace,
    processingSpace,
  ]);

  const toggleAlgorithm = useCallback(
    (algorithm: WhiteBalanceAlgorithm) => {
      setSelectedAlgorithms((prev) => {
        if (prev.includes(algorithm)) {
          // Remove if already selected, but keep at least one
          const filtered = prev.filter((a) => a !== algorithm);
          const newAlgorithms = filtered.length > 0 ? filtered : prev;

          // Update split view algorithm if the removed one was selected
          if (splitViewAlgorithm === algorithm && newAlgorithms.length > 0) {
            setSplitViewAlgorithm(newAlgorithms[0]);
          }

          return newAlgorithms;
        } else {
          // Add if not selected
          const newAlgorithms = [...prev, algorithm];
          // Set as split view if it's the first one
          if (!splitViewAlgorithm) {
            setSplitViewAlgorithm(algorithm);
          }
          return newAlgorithms;
        }
      });
    },
    [splitViewAlgorithm]
  );

  const setAlgorithms = useCallback((algorithms: WhiteBalanceAlgorithm[]) => {
    if (algorithms.length > 0) {
      setSelectedAlgorithms(algorithms);
      // Update split view algorithm if current one is not in the new list
      setSplitViewAlgorithm((prev) => {
        if (prev && algorithms.includes(prev)) {
          return prev;
        }
        return algorithms[0];
      });
    }
  }, []);

  const setSplitViewAlgorithmCallback = useCallback(
    (algorithm: WhiteBalanceAlgorithm | null) => {
      setSplitViewAlgorithm(algorithm);
    },
    []
  );

  const setColorSpaceModeCallback = useCallback((mode: ColorSpaceMode) => {
    setColorSpaceMode(mode);
  }, []);

  const setInputColorSpaceCallback = useCallback((space: ColorSpace) => {
    setInputColorSpace(space);
  }, []);

  const setProcessingSpaceCallback = useCallback((space: ColorSpace) => {
    setProcessingSpace(space);
  }, []);

  const setImage = useCallback(
    (file: File) => {
      imageUpload.handleFileSelect(file);
    },
    [imageUpload]
  );

  const reprocess = useCallback(async () => {
    if (
      !imageUpload.file ||
      processingRef.current ||
      whiteBalanceApi.isProcessing ||
      selectedAlgorithms.length === 0
    ) {
      return;
    }

    processingRef.current = true;
    setIsProcessingInternal(true);
    try {
      // Determine actual color spaces to use
      const actualInputSpace =
        colorSpaceMode === 'auto' ? 'sRGB' : inputColorSpace;
      const actualProcessingSpace =
        colorSpaceMode === 'auto' ? 'linear_rgb' : processingSpace;

      const promises = selectedAlgorithms.map((algorithm) =>
        whiteBalanceApi.processImage(imageUpload.file!, {
          algorithm,
          input_color_space: actualInputSpace,
          processing_space: actualProcessingSpace,
        })
      );
      const results = await Promise.all(promises);
      setProcessedImages(results);
      // Ensure split view algorithm is set
      setSplitViewAlgorithm((prev) => {
        if (prev && results.some((r) => r.algorithm === prev)) {
          return prev;
        }
        return results.length > 0 ? results[0].algorithm : null;
      });
    } catch (error) {
      console.error('Failed to process images:', error);
    } finally {
      setIsProcessingInternal(false);
      processingRef.current = false;
    }
  }, [
    imageUpload.file,
    selectedAlgorithms,
    whiteBalanceApi,
    colorSpaceMode,
    inputColorSpace,
    processingSpace,
  ]);

  const clearImage = useCallback(() => {
    imageUpload.clearImage();
    setProcessedImages([]);
  }, [imageUpload]);

  return {
    selectedAlgorithms,
    splitViewAlgorithm,
    colorSpaceMode,
    inputColorSpace,
    processingSpace,
    originalFile: imageUpload.file,
    originalPreviewUrl: imageUpload.previewUrl,
    processedImages,
    isProcessing: whiteBalanceApi.isProcessing || isProcessingInternal,
    error: imageUpload.error || whiteBalanceApi.error,
    toggleAlgorithm,
    setAlgorithms,
    setSplitViewAlgorithm: setSplitViewAlgorithmCallback,
    setColorSpaceMode: setColorSpaceModeCallback,
    setInputColorSpace: setInputColorSpaceCallback,
    setProcessingSpace: setProcessingSpaceCallback,
    setImage,
    reprocess,
    clearImage,
  };
}
