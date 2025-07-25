import React, { useState } from 'react';
import { Dumbbell, Heart, Target, LogIn } from 'lucide-react';
import logo from '../../assets/logo-t.png';
import { AuthForm } from '../auth/AuthForm';
import { useAuth } from '../../hooks/useAuth';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useAuth();

  // If user is already signed in, they shouldn't see the welcome step
  if (user) {
    return null;
  }

  if (showSignIn) {
    return (
      <div className="max-w-md mx-auto py-8">
        <AuthForm
          mode="signin"
          onToggleMode={() => setShowSignIn(false)}
          onForgotPassword={() => {/* Handle forgot password */ }}
          onSuccess={() => {
            // User will be redirected automatically by auth state change
          }}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowSignIn(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to welcome
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 py-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Fit Fly Logo"
            className="w-40 h-40 object-contain mx-auto"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to Fit Fly
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Personalized coaching. Effortless tracking. Lasting Support - with AI that adapts to you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customized Plans</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get AI-personalized workout and nutrition plans tailored to your goals and lifestyle
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Intelligent Tracking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Track workouts, meals, and progress effortlessly—with smart insights that keep you improving
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support That Shows Up</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Always in your corner. Real Coaching. Real-time accountability
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNext}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start your fitness transformation for free!
        </button>

        <div className="text-gray-600 dark:text-gray-300">
          <span className="text-sm">Already have an account? </span>
          <button
            onClick={() => setShowSignIn(true)}
            className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};