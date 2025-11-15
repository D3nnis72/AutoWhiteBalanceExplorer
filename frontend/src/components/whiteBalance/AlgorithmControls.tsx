'use client';

/** Algorithm controls component. */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import type { WhiteBalanceAlgorithm } from '@/lib/types';

export interface AlgorithmControlsProps {
  selectedAlgorithms: WhiteBalanceAlgorithm[];
  splitViewAlgorithm: WhiteBalanceAlgorithm | null;
  onToggleAlgorithm: (algorithm: WhiteBalanceAlgorithm) => void;
  onSplitViewAlgorithmChange: (algorithm: WhiteBalanceAlgorithm | null) => void;
}

const ALL_ALGORITHMS: WhiteBalanceAlgorithm[] = [
  'grey_world',
  'white_patch',
  'grey_edge',
];

const ALGORITHM_LABELS: Record<WhiteBalanceAlgorithm, string> = {
  grey_world: 'Grey World',
  white_patch: 'White Patch',
  grey_edge: 'Grey Edge',
};

const ALGORITHM_DESCRIPTIONS: Record<WhiteBalanceAlgorithm, string> = {
  grey_world:
    'Assumes that the average color over the whole image should be neutral grey. Adjusts each channel so that the mean becomes grey.',
  white_patch:
    'Uses the brightest patch in the image as reference white. Scales the channels so that this patch becomes white.',
  grey_edge:
    'Uses edges and gradients to estimate the illumination color from local contrast instead of global averages.',
};

export function AlgorithmControls({
  selectedAlgorithms,
  splitViewAlgorithm,
  onToggleAlgorithm,
  onSplitViewAlgorithmChange,
}: AlgorithmControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Settings</CardTitle>
        <CardDescription>
          Select one or more algorithms to compare
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Algorithms</label>
          <div className='space-y-3'>
            {ALL_ALGORITHMS.map((algorithm) => (
              <div key={algorithm} className='space-y-1.5'>
                <Checkbox
                  id={`algorithm-${algorithm}`}
                  label={ALGORITHM_LABELS[algorithm]}
                  checked={selectedAlgorithms.includes(algorithm)}
                  onChange={() => onToggleAlgorithm(algorithm)}
                />
                <p className='pl-6 text-xs text-muted-foreground'>
                  {ALGORITHM_DESCRIPTIONS[algorithm]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedAlgorithms.length > 1 && (
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Split View Algorithm</label>
            <Select
              value={splitViewAlgorithm || ''}
              onValueChange={(value) =>
                onSplitViewAlgorithmChange(
                  value ? (value as WhiteBalanceAlgorithm) : null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select algorithm for split view' />
              </SelectTrigger>
              <SelectContent>
                {selectedAlgorithms.map((algorithm) => (
                  <SelectItem key={algorithm} value={algorithm}>
                    {ALGORITHM_LABELS[algorithm]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-xs text-muted-foreground'>
              Choose which algorithm to display in the split view comparison
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
