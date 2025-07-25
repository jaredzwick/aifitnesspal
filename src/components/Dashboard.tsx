import React, { useState } from 'react';
import {
  Activity,
  Apple,
  Camera,
  TrendingUp,
  Target,
  Calendar,
  Dumbbell,
  Zap,
  Plus,
  Play
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { WorkoutTracker } from './workouts/WorkoutTracker';
import { NutritionTracker } from './nutrition/NutritionTracker';
import { ProgressTracker } from './progress/ProgressTracker';
import { useAuth } from '../hooks/useAuth';
import { User } from '@supabase/supabase-js';
import { ErrorBoundary } from './ui/ErrorBoundary';
import logo from '../assets/logo-navbar.png';
import { FitnessUser, PersonalizedPlan, UserWorkout, WeeklyWorkoutPlan, WORKOUT_STATUS } from '../../common';
import { TrainingRegimen } from './training/TrainingRegimen';
import { workoutService } from '../services/workoutService';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface DashboardProps {
  user: User;
}

type DashboardView = 'overview' | 'training-regimen' | 'workout-tracker' | 'nutrition' | 'progress';

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { signOut } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const { data: activeWorkout, isLoading: activeWorkoutLoading, error: activeWorkoutError } = useQuery({
    queryKey: ['getActiveWorkout'],
    queryFn: async () => {
      const response = await workoutService.getActiveWorkout();
      console.log('~response.activeWorkout', response);
      if (response) {
        if (response.status === WORKOUT_STATUS.IN_PROGRESS) {
          setCurrentView('workout-tracker')
        }
      }
      return response
    },
  })
  console.log('~dashboard.activeWorkout ', activeWorkout)
  const handleSignOut = async () => {
    await signOut();
  };

  const formatWeight = () => {
    // format to lbs or kg whether user_metadata.prefersMetric is true or false
    const weight = (user.user_metadata as FitnessUser).weight;
    if (!weight) return 'N/A';
    if ((user.user_metadata as FitnessUser).prefersMetric) {
      return `${weight.toFixed(0)} kg`;
    } else {
      const lbs = convertWeightToLbs(weight);
      return `${lbs.toFixed(0)} lbs`;
    }
  };

  const convertWeightToLbs = (kg: number) => {
    return kg * 2.20462;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back, {user.user_metadata.name}! 👋</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to crush your fitness goals today?
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div className="text-gray-600 dark:text-gray-300">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('workout-tracker')}
            className="flex flex-col items-center space-y-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-colors"
          >
            <Play className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {activeWorkout ? 'Resume Workout' : 'Start Workout'}
            </span>
          </button>

          <button
            onClick={() => setCurrentView('nutrition')}
            className="flex flex-col items-center space-y-2 p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-colors"
          >
            <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Log Food
            </span>
          </button>

          <button
            onClick={() => setCurrentView('progress')}
            className="flex flex-col items-center space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
          >
            <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Progress Photo
            </span>
          </button>

          <button
            onClick={() => setCurrentView('progress')}
            className="flex flex-col items-center space-y-2 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              View Progress
            </span>
          </button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Workout */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Active Workout</h3>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          {activeWorkoutLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : activeWorkout ? (
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                In Progress
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activeWorkout.name.charAt(0).toUpperCase() + activeWorkout.name.slice(1) || 'Current workout'}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                None
              </div>
              <button
                onClick={() => setCurrentView('workout-tracker')}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Start workout
              </button>
            </div>
          )}
          {/* //TODO: ADD ABILITY TO GO TO ACTIVE WORKOUT. SHOULD PROBABLY AUTO ROUTE THERE */}
        </div>

        {/* Today's Calories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Calories Today</h3>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          {/* {nutritionLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : ( */}
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              0
              {/* TODO: GET TODAY'S CALORIES */}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Goal: {(user.user_metadata as FitnessUser).personalizedPlan?.nutritionRegimen?.dailyCalorieTarget || 2000} cal
            </p>
          </div>
          {/* )} */}
        </div>

        {/* Current Weight */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Current Weight</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          {/* {progressLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : ( */}
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatWeight()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No change
            </p>
          </div>
          {/* )} */}
          {/* TODO: GET CURRENT WEIGHT */}
        </div>

        {/* Active Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">Active Goals</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          {/* {progressLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : ( */}
          <div>
            {/* <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {progressSummary?.activeGoals || 0}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {progressSummary?.completedGoals || 0} completed
              </p> */}
          </div>
          {/* )} */}
          {/* TODO: GET ACTIVE GOALS */}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Workouts
            </h3>
            <button
              onClick={() => setCurrentView('w')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
            >
              View all
            </button>
          </div> */}
          {/* TODO: GET RECENT WORKOUTS */}

          {/* {workoutsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} className="h-16" />
              ))}
            </div>
          ) : recentWorkouts && recentWorkouts.length > 0 ? ( */}
          {/* <div className="space-y-3">
              {[].slice(0, 3).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {workout.workout?.name || 'Workout'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {workout.completed_at ?
                          new Date(workout.completed_at).toLocaleDateString() :
                          'In progress'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${workout.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : workout.status === WORKOUT_STATUS.IN_PROGRESS
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                      {workout.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : ( */}
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent workouts</p>
            <button
              onClick={() => setCurrentView('workout-tracker')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mt-1"
            >
              Start your first workout
            </button>
          </div>
          {/* )} */}
        </div>
        {/* TODO: GET RECENT WORKOUTS */}

        {/* Nutrition Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Nutrition
            </h3>
            <button
              onClick={() => setCurrentView('nutrition')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
            >
              Track food
            </button>
          </div>

          {/* {nutritionLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} className="h-12" />
              ))}
            </div>
          ) : todayNutrition ? ( */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Calories</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {todayNutrition?.total_calories || 0} / 2000 */}
                0 / 2000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Protein</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {todayNutrition?.total_protein || 0}g / 150g */}
                0 / 150g
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Carbs</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {todayNutrition.total_carbs}g / 250g */}
                0 / 250g
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Fat</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {/* {todayNutrition.total_fat}g / 67g */}
                0 / 67g
              </span>
            </div>
          </div>
          {/* TODO: GET TODAY'S MACROS */}
          {/* ) : ( */}
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Apple className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No food logged today</p>
            <button
              onClick={() => setCurrentView('nutrition')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mt-1"
            >
              Log your first meal
            </button>
          </div>
          {/* )} */}
        </div>
      </div>


    </div >
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'workout-tracker':
        return <WorkoutTracker plan={user?.user_metadata.personalizedPlan as PersonalizedPlan} inProgressUserWorkout={activeWorkout as UserWorkout} prefersMetric={user?.user_metadata.prefersMetric as boolean} />;
      case 'training-regimen':
        return <TrainingRegimen plan={user?.user_metadata.personalizedPlan as PersonalizedPlan} />;
      case 'nutrition':
        return <NutritionTracker />;
      case 'progress':
        return <ProgressTracker />;
      default:
        return renderOverview();
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="Fit Fly Logo"
                  className="w-10 h-10 object-contain"
                />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Fit Fly
                </h1>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'training-regimen', label: 'Training Regimen', icon: Calendar },
                  { id: 'workout-tracker', label: 'Workout', icon: Dumbbell },
                  { id: 'nutrition', label: 'Nutrition', icon: Apple },
                  { id: 'progress', label: 'Progress', icon: TrendingUp },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentView(id as DashboardView)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === id
                      ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="relative">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.user_metadata.name ? user.user_metadata.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block">{user.user_metadata.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'workout-tracker', label: 'Workout', icon: Dumbbell },
                { id: 'workouts', label: 'Workouts', icon: Calendar },
                { id: 'nutrition', label: 'Nutrition', icon: Apple },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as DashboardView)}
                  className={`flex flex-col items-center space-y-1 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${currentView === id
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {activeWorkoutLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="xxl" />
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderCurrentView()}
          </main>
        )}
      </div>
    </ErrorBoundary>
  );
};