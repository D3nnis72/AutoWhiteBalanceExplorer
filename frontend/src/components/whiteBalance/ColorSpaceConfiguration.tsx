'use client';

/** Color space configuration component. */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { ColorSpace, ColorSpaceMode } from '@/lib/types';

export interface ColorSpaceConfigurationProps {
  mode: ColorSpaceMode;
  inputColorSpace: ColorSpace;
  processingSpace: ColorSpace;
  onModeChange: (mode: ColorSpaceMode) => void;
  onInputColorSpaceChange: (space: ColorSpace) => void;
  onProcessingSpaceChange: (space: ColorSpace) => void;
}

const COLOR_SPACE_DESCRIPTIONS: Record<ColorSpace, string> = {
  sRGB:
    'Gamma-corrected RGB color space used by most displays and image formats. Values are non-linear (gamma encoded) to match human perception.',
  linear_rgb:
    'Linear RGB color space where values are proportional to light intensity. More accurate for image processing operations.',
};

export function ColorSpaceConfiguration({
  mode,
  inputColorSpace,
  processingSpace,
  onModeChange,
  onInputColorSpaceChange,
  onProcessingSpaceChange,
}: ColorSpaceConfigurationProps) {
  const isAuto = mode === 'auto';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Space Configuration</CardTitle>
        <CardDescription>
          Configure how color spaces are handled during processing
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Mode</label>
          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='auto'>Auto (Recommended)</SelectItem>
              <SelectItem value='manual'>Manual</SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-muted-foreground'>
            {isAuto
              ? 'Automatically detects sRGB input and processes in linear RGB for accurate results'
              : 'Manually configure input and processing color spaces'}
          </p>
        </div>

        {!isAuto && (
          <>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Input Color Space</label>
              <Select
                value={inputColorSpace}
                onValueChange={onInputColorSpaceChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sRGB'>sRGB</SelectItem>
                  <SelectItem value='linear_rgb'>Linear RGB</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>
                {COLOR_SPACE_DESCRIPTIONS[inputColorSpace]}
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Processing Space</label>
              <Select
                value={processingSpace}
                onValueChange={onProcessingSpaceChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sRGB'>sRGB (gamma corrected)</SelectItem>
                  <SelectItem value='linear_rgb'>Linear RGB</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>
                {COLOR_SPACE_DESCRIPTIONS[processingSpace]}
              </p>
            </div>
          </>
        )}

        {isAuto && (
          <div className='space-y-2 rounded-lg bg-muted p-3'>
            <div className='text-sm font-medium'>Current Configuration</div>
            <div className='space-y-1 text-xs text-muted-foreground'>
              <div>
                Input: <span className='font-medium text-foreground'>sRGB</span>{' '}
                (detected automatically from uploaded images)
              </div>
              <div>
                Processing:{' '}
                <span className='font-medium text-foreground'>Linear RGB</span>{' '}
                (recommended for accurate white balance)
              </div>
            </div>
            <div className='mt-3 space-y-1 text-xs text-muted-foreground'>
              <p className='font-medium text-foreground'>Why Linear RGB?</p>
              <p>
                White balance algorithms work with light intensities. Processing
                in linear RGB (where values are proportional to light) gives
                more accurate results than processing in gamma-corrected sRGB.
                The system automatically converts from sRGB to linear RGB before
                processing, then back to sRGB for display.
              </p>
            </div>
          </div>
        )}

        {!isAuto && (
          <div className='space-y-2 rounded-lg bg-muted p-3'>
            <div className='text-sm font-medium'>
              What&apos;s the Difference?
            </div>
            <div className='space-y-2 text-xs text-muted-foreground'>
              <div>
                <p className='font-medium text-foreground'>
                  Processing in Linear RGB:
                </p>
                <p>
                  More accurate results because algorithms work with actual
                  light intensities. Requires conversion from sRGB to linear RGB
                  before processing, then back to sRGB for display.
                </p>
              </div>
              <div>
                <p className='font-medium text-foreground'>
                  Processing in sRGB:
                </p>
                <p>
                  Faster (no conversion needed) but less accurate because gamma
                  correction affects the mathematical operations. May produce
                  slightly different color shifts.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
