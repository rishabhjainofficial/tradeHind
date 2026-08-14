/**
 * TradeHind Centralized API Client (Separation of Concerns & DRY)
 * Handles background network dispatch with error isolation and standard headers.
 */

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  threatType?: string;
  message?: string;
}

/**
 * Dispatches a POST request to an internal /api endpoint safely without blocking the UI thread
 */
export async function apiPost<T = any>(
  endpoint: string,
  payload: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network request failed',
    };
  }
}
