/** Typed API client for backend communication. */

import type { WhiteBalanceRequest, WhiteBalanceResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchJson<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function applyWhiteBalance(
  file: File,
  request: WhiteBalanceRequest
): Promise<WhiteBalanceResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const params = new URLSearchParams({
    algorithm: request.algorithm,
    input_color_space: request.input_color_space,
    processing_space: request.processing_space,
  });

  const url = `${API_BASE_URL}/white-balance/apply?${params.toString()}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

