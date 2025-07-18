import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthPage } from './auth/AuthPage';
import { ErrorScreen } from './ErrorScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, error, clearError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorScreen
        title="Authentication Error"
        message={error}
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
      />
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <>{children}</>;
};