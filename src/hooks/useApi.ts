import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, ApiError } from '../lib/api';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Hook options
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  retry?: {
    attempts: number;
    delay: number;
  };
}

// Hook return type
interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  state: LoadingState;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
}

// Generic API hook
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    retry: retryConfig = { attempts: 3, delay: 1000 }
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [state, setState] = useState<LoadingState>('idle');

  const lastArgsRef = useRef<any[]>([]);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!mountedRef.current) return null;

    lastArgsRef.current = args;
    setLoading(true);
    setError(null);
    setState('loading');

    try {
      const result = await apiFunction(...args);
      
      if (!mountedRef.current) return null;

      setData(result);
      setState('success');
      retryCountRef.current = 0;
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      if (!mountedRef.current) return null;

      const apiError = err instanceof ApiError ? err : new ApiError('Unknown error occurred');
      setError(apiError);
      setState('error');
      onError?.(apiError);
      
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (retryCountRef.current >= retryConfig.attempts) {
      return null;
    }

    retryCountRef.current++;
    
    // Add exponential backoff delay
    const delay = retryConfig.delay * Math.pow(2, retryCountRef.current - 1);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return execute(...lastArgsRef.current);
  }, [execute, retryConfig]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setState('idle');
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    state,
    execute,
    reset,
    retry,
  };
}

// Specialized hooks for common patterns
export function useQuery<T>(
  queryFn: () => Promise<T>,
  options: UseApiOptions<T> & { enabled?: boolean } = {}
) {
  const { enabled = true, ...apiOptions } = options;
  
  return useApi(queryFn, {
    ...apiOptions,
    immediate: enabled,
  });
}

export function useMutation<T, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  return useApi(mutationFn, {
    ...options,
    immediate: false,
  });
}