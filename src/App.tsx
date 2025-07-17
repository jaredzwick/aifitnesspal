import React, { useState, useEffect } from 'react';
import { User as FitnessUser } from './types';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ErrorScreen } from './components/ErrorScreen';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';

function App() {
  useTheme(); // Initialize theme
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, error, clearError } = useUserProfile();

  const handleOnboardingComplete = () => {
    // Profile will be automatically refreshed by useUserProfile
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorScreen
        title="Profile Error"
        message={error}
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
      />
    );
  }

  return (
    <>
      {!user ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : !profile || !profile.onboardingComplete ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <Dashboard user={profile} />
      )}
    </>
  );
}


export default App;