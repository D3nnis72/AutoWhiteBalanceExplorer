'use client';

/** Comparison split view component with slider. */

import { useState, useCallback } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface ComparisonSplitViewProps {
  originalSrc: string;
  processedSrc: string;
}

export function ComparisonSplitView({ originalSrc, processedSrc }: ComparisonSplitViewProps) {
  const [splitPosition, setSplitPosition] = useState(50);

  const handleSliderChange = useCallback((value: number[]) => {
    setSplitPosition(value[0]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Split View Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16/9' }}>
          {/* Original image (left side) */}
          <div className="absolute inset-0">
            <img
              src={originalSrc}
              alt="Original"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Processed image (right side, clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
          >
            <img
              src={processedSrc}
              alt="Processed"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-primary"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-lg" />
          </div>
        </div>

        <div className="mt-4">
          <Slider
            value={[splitPosition]}
            onValueChange={handleSliderChange}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Original</span>
            <span>Processed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

