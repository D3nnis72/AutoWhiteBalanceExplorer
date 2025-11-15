'use client';

/** Main white balance explorer component. */

import { useExplorerState } from '@/hooks/useExplorerState';
import { AlgorithmControls } from './AlgorithmControls';
import { ColorSpaceConfiguration } from './ColorSpaceConfiguration';
import { ComparisonSplitView } from './ComparisonSplitView';
import { ComparisonGrid } from './ComparisonGrid';
import { ImagePreview } from './ImagePreview';

export function WhiteBalanceExplorer() {
  const state = useExplorerState();

  // Find the processed image for split view
  const splitViewProcessedImage = state.splitViewAlgorithm
    ? state.processedImages.find(
        (img) => img.algorithm === state.splitViewAlgorithm
      )
    : null;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch'>
        {/* Left: Image Preview - matches height of right column */}
        <div>
          <ImagePreview
            previewUrl={state.originalPreviewUrl}
            onFileSelect={state.setImage}
            onFileDrop={(files) => {
              if (files.length > 0) {
                state.setImage(files[0]);
              }
            }}
            error={state.error}
          />
        </div>

        {/* Right: Settings stacked */}
        <div className='flex flex-col gap-6'>
          <AlgorithmControls
            selectedAlgorithms={state.selectedAlgorithms}
            splitViewAlgorithm={state.splitViewAlgorithm}
            onToggleAlgorithm={state.toggleAlgorithm}
            onSplitViewAlgorithmChange={state.setSplitViewAlgorithm}
          />

          <ColorSpaceConfiguration
            mode={state.colorSpaceMode}
            inputColorSpace={state.inputColorSpace}
            processingSpace={state.processingSpace}
            onModeChange={state.setColorSpaceMode}
            onInputColorSpaceChange={state.setInputColorSpace}
            onProcessingSpaceChange={state.setProcessingSpace}
          />
        </div>
      </div>

      {/* Processing indicator */}
      {state.isProcessing && (
        <div className='text-center text-muted-foreground'>
          Processing image...
        </div>
      )}

      {/* Comparison views */}
      {!state.isProcessing &&
        state.processedImages.length > 0 &&
        state.originalPreviewUrl && (
          <div className='space-y-6'>
            {/* Split view - show when split view algorithm is selected */}
            {splitViewProcessedImage && (
              <ComparisonSplitView
                originalSrc={state.originalPreviewUrl}
                processedSrc={splitViewProcessedImage.imageSrc}
              />
            )}

            {/* Comparison grid - always show when multiple algorithms */}
            {state.processedImages.length > 1 && (
              <ComparisonGrid
                originalSrc={state.originalPreviewUrl}
                processedImages={state.processedImages}
                selectedAlgorithm={state.splitViewAlgorithm}
                onImageClick={state.setSplitViewAlgorithm}
              />
            )}
          </div>
        )}
    </div>
  );
}
