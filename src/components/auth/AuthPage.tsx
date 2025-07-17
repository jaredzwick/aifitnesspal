import React, { useState } from 'react';
import { Dumbbell, Heart, Target } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ThemeToggle } from '../ThemeToggle';

type AuthView = 'signin' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">FitCoach AI</h1>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Your AI Fitness Journey Starts Here
              </h2>
              <p className="text-xl text-emerald-100">
                Personalized workouts, nutrition tracking, and 24/7 AI coaching to help you achieve your fitness goals.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Personalized Plans</h3>
                  <p className="text-emerald-100">AI-powered workout and nutrition plans tailored to your unique goals and preferences.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Smart Tracking</h3>
                  <p className="text-emerald-100">Effortless tracking of workouts, nutrition, and progress with intelligent insights.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">24/7 AI Coach</h3>
                  <p className="text-emerald-100">Your personal AI coach is always there to motivate, guide, and keep you accountable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-emerald-100">
            "FitCoach AI transformed my fitness journey. The personalized approach and constant motivation kept me on track like never before."
          </p>
          <p className="font-semibold mt-2">- Sarah M., Beta User</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {currentView === 'forgot-password' ? (
            <ForgotPasswordForm onBack={() => setCurrentView('signin')} />
          ) : (
            <AuthForm
              mode={currentView}
              onToggleMode={() => setCurrentView(currentView === 'signin' ? 'signup' : 'signin')}
              onForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}
        </div>
      </div>
    </div>
  );
};