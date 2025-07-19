import React, { useState } from 'react';
import { FitnessUser } from '../../types';
import { AuthForm } from '../auth/AuthForm';
import { ForgotPasswordForm } from '../auth/ForgotPasswordForm';
import { ErrorScreen } from '../ErrorScreen';

interface AuthStepProps {
  userData: Partial<FitnessUser>;
  onComplete: (user: any) => void;
  onPrev: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot-password';

export const AuthStep: React.FC<AuthStepProps> = ({ userData, onComplete, onPrev }) => {
  const [currentView, setCurrentView] = useState<AuthView>('signup');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthError = (error: string) => {
    setAuthError(error);
  };

  const handleRetry = () => {
    setAuthError(null);
  };

  if (authError) {
    return (
      <ErrorScreen
        title="Authentication Failed"
        message={authError}
        onRetry={handleRetry}
        onGoHome={onPrev}
        showGoHome={true}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Almost there, {userData.name}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create your account to save your personalized fitness plan and start your journey.
        </p>
      </div>

      {currentView === 'forgot-password' ? (
        <ForgotPasswordForm 
          onBack={() => setCurrentView('signin')} 
          onError={handleAuthError}
        />
      ) : (
        <AuthForm
          mode={currentView}
          onToggleMode={() => setCurrentView(currentView === 'signin' ? 'signup' : 'signin')}
          onForgotPassword={() => setCurrentView('forgot-password')}
          onSuccess={onComplete}
          defaultEmail={userData.email}
          onError={handleAuthError}
          userData={userData}
        />
      )}

      <div className="flex justify-center">
        <button
          onClick={onPrev}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
        >
          ← Back to preferences
        </button>
      </div>
    </div>
  );
};