/** Shared frontend types and DTOs. */

export type WhiteBalanceAlgorithm = 'grey_world' | 'white_patch' | 'grey_edge';

export type ColorSpace = 'sRGB' | 'linear_rgb';
export type ColorSpaceMode = 'auto' | 'manual';

export interface WhiteBalanceRequest {
  algorithm: WhiteBalanceAlgorithm;
  input_color_space: ColorSpace;
  processing_space: ColorSpace;
}

export interface WhiteBalanceResponse {
  algorithm: WhiteBalanceAlgorithm;
  processing_space: ColorSpace;
  image_base64: string;
  avg_rgb_before?: [number, number, number];
  avg_rgb_after?: [number, number, number];
}

export interface ProcessedImage {
  imageSrc: string;
  algorithm: WhiteBalanceAlgorithm;
  processingSpace: ColorSpace;
  avgRgbBefore?: [number, number, number];
  avgRgbAfter?: [number, number, number];
}

export interface ExplorerState {
  selectedAlgorithms: WhiteBalanceAlgorithm[];
  splitViewAlgorithm: WhiteBalanceAlgorithm | null;
  colorSpaceMode: ColorSpaceMode;
  inputColorSpace: ColorSpace;
  processingSpace: ColorSpace;
  originalFile: File | null;
  originalPreviewUrl: string | null;
  processedImages: ProcessedImage[];
  isProcessing: boolean;
  error: string | null;
}
