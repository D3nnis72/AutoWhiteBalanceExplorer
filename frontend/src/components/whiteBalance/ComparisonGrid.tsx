'use client';

/** Comparison grid component. */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ProcessedImage, WhiteBalanceAlgorithm } from '@/lib/types';

export interface ComparisonGridProps {
  originalSrc: string;
  processedImages: ProcessedImage[];
  selectedAlgorithm?: WhiteBalanceAlgorithm | null;
  onImageClick?: (algorithm: WhiteBalanceAlgorithm) => void;
}

const ALGORITHM_LABELS: Record<string, string> = {
  grey_world: 'Grey World',
  white_patch: 'White Patch',
  grey_edge: 'Grey Edge',
};

const SPACE_LABELS: Record<string, string> = {
  sRGB: 'sRGB',
  linear_rgb: 'Linear RGB',
};

export function ComparisonGrid({
  originalSrc,
  processedImages,
  selectedAlgorithm,
  onImageClick,
}: ComparisonGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Original */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Original</h3>
            <img
              src={originalSrc}
              alt='Original'
              className='w-full rounded-lg border object-contain'
            />
          </div>

          {/* Processed images */}
          {processedImages.map((img, index) => {
            const isSelected = selectedAlgorithm === img.algorithm;
            const isClickable = !!onImageClick;

            return (
              <div key={`${img.algorithm}-${index}`} className='space-y-2'>
                <h3 className='text-sm font-medium'>
                  {ALGORITHM_LABELS[img.algorithm]} (
                  {SPACE_LABELS[img.processingSpace]})
                </h3>
                <div
                  onClick={() => isClickable && onImageClick?.(img.algorithm)}
                  className={`relative w-full rounded-lg border-2 overflow-hidden transition-all ${
                    isClickable
                      ? 'cursor-pointer hover:border-primary hover:shadow-md'
                      : ''
                  } ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={img.imageSrc}
                    alt={`${img.algorithm} ${img.processingSpace}`}
                    className='w-full object-contain'
                  />
                  {isSelected && (
                    <div className='absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded'>
                      Selected
                    </div>
                  )}
                </div>
                {isClickable && (
                  <p className='text-xs text-muted-foreground text-center'>
                    Click to view in split comparison
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

