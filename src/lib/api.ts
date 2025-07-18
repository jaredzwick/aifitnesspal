import { supabase } from './supabase';

// Base API configuration
const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// API Response types
export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Request configuration
interface RequestConfig extends RequestInit {
  timeout?: number;
}

// Custom error class for API errors
export class ApiError extends Error {
  code?: string;
  details?: any;
  status?: number;

  constructor(message: string, code?: string, details?: any, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// Timeout utility
const withTimeout = (promise: Promise<Response>, timeout: number): Promise<Response> => {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new ApiError('Request timeout', 'TIMEOUT')), timeout)
    ),
  ]);
};

// Base API client
class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new ApiError(errorMessage, 'HTTP_ERROR', errorDetails, response.status);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new ApiError('Failed to parse response', 'PARSE_ERROR', error);
    }
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { timeout = 10000, ...requestConfig } = config;
    
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await withTimeout(
        fetch(`${API_BASE_URL}${endpoint}`, {
          ...requestConfig,
          headers: {
            ...headers,
            ...requestConfig.headers,
          },
        }),
        timeout
      );

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }
      
      throw new ApiError('An unexpected error occurred', 'UNKNOWN_ERROR', error);
    }
  }

  // HTTP method helpers
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // File upload helper
  async uploadFile(file: File, bucket: string = 'progress-photos', folder: string = 'uploads'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('folder', folder);

    const headers = await this.getAuthHeaders();
    delete (headers as any)['Content-Type']; // Let browser set content-type for FormData

    const response = await withTimeout(
      fetch(`${API_BASE_URL}/file-upload`, {
        method: 'POST',
        headers: {
          'Authorization': (headers as any).Authorization,
        },
        body: formData,
      }),
      30000 // 30 second timeout for file uploads
    );

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();