import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { ApiError } from '../../lib/api';

interface ErrorMessageProps {
  error: ApiError | Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'banner';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = '',
}) => {
  const getErrorMessage = (error: ApiError | Error | string): string => {
    if (typeof error === 'string') return error;
    if (error instanceof ApiError) return error.message;
    return error.message || 'An unexpected error occurred';
  };

  const getErrorCode = (error: ApiError | Error | string): string | undefined => {
    if (error instanceof ApiError) return error.code;
    return undefined;
  };

  const message = getErrorMessage(error);
  const code = getErrorCode(error);

  const baseClasses = "flex items-start space-x-3 text-red-700 dark:text-red-300";
  
  const variantClasses = {
    inline: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg",
    card: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm",
    banner: "p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
        
        {code && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Error Code: {code}
          </p>
        )}
        
        {(onRetry || onDismiss) && (
          <div className="flex items-center space-x-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-1 text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again</span>
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Specialized error components
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage
    error="Unable to connect to the server. Please check your internet connection."
    onRetry={onRetry}
    variant="card"
  />
);

export const NotFoundError: React.FC<{ resource?: string }> = ({ resource = 'resource' }) => (
  <ErrorMessage
    error={`The requested ${resource} could not be found.`}
    variant="card"
  />
);

export const UnauthorizedError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage
    error="You don't have permission to access this resource. Please sign in and try again."
    onRetry={onRetry}
    variant="card"
  />
);