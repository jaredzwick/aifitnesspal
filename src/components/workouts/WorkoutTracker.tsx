import React, { useState, useEffect } from 'react';
import {
  Play,
  Plus,
  Target,
  Timer,
  Heart,
  Activity,
  Save,
  SkipForward,
  CheckCircle2,
  Minus
} from 'lucide-react';
import { ButtonSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { WorkoutSet, PersonalizedPlan, WeeklyWorkoutPlan, UserWorkout } from '../../../common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { workoutService } from '../../services/workoutService';


export const WorkoutTracker: React.FC<{ plan: PersonalizedPlan, inProgressUserWorkout?: UserWorkout, prefersMetric: boolean }> = ({ plan, inProgressUserWorkout, prefersMetric }) => {

  const [activeWorkout, setActiveWorkout] = useState<WeeklyWorkoutPlan | null>(null);
  const [currentInProgressWorkout, setCurrentInProgressWorkout] = useState<UserWorkout | undefined>(inProgressUserWorkout);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(() => {
    if (!inProgressUserWorkout?.exercises) return 0;
    const newWorkout = inProgressUserWorkout.exercises as WeeklyWorkoutPlan;
    if (!newWorkout.workout) return 0;
    let cnt = 0;
    for (let i = 0; i < newWorkout.workout!.length; i++) {
      if (newWorkout.workout![i].userSets?.length) {
        if (newWorkout.workout![i].userSets!.length >= newWorkout.workout![i].numberOfSets!) {
          cnt++;
        }
      }
    }
    return cnt;
  });
  const [currentSetIndex, setCurrentSetIndex] = useState(() => {
    if (!inProgressUserWorkout?.exercises) return 0;
    const newWorkout = inProgressUserWorkout.exercises as WeeklyWorkoutPlan;
    if (newWorkout.workout && newWorkout.workout[currentExerciseIndex] && newWorkout.workout[currentExerciseIndex].userSets) {
      const newIdx = newWorkout.workout[currentExerciseIndex].userSets?.length;
      console.log('~newIdx', newIdx)
      if (newIdx >= newWorkout.workout[currentExerciseIndex].numberOfSets!) {
        setCurrentExerciseIndex(prev => prev + 1);
        return 0;
      }
      return newIdx;
    }
    return 0;
  });
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  useEffect(() => {
    if (inProgressUserWorkout) {
      setActiveWorkout(inProgressUserWorkout.exercises as WeeklyWorkoutPlan);
    }
  }, [inProgressUserWorkout]);

  const { data: recentWorkouts, isLoading: recentWorkoutsLoading, error: recentWorkoutsError } = useQuery({
    queryKey: ['getRecentWorkouts'],
    queryFn: workoutService.getRecentWorkouts
  })

  // Get available workouts
  let workoutsError: Error | null = null;

  const startWorkoutMutation = useMutation({
    mutationFn: workoutService.startWorkout,
    onError: (error: Error) => {
      console.error(error);
      workoutsError = error;
    }
  })

  const persistCompletedSetMutation = useMutation({
    mutationFn: workoutService.persistCompletedSet,
    onError: (error: Error) => {
      console.error(error);
      workoutsError = error;
    }
  })

  const completeWorkoutMutation = useMutation({
    mutationFn: workoutService.completeWorkout,
    onError: (error: Error) => {
      console.error(error);
      workoutsError = error;
    },

  })

  const startWorkout = async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todaysWorkout = plan.trainingRegimen!.find(workout => workout.day === today)
    if (todaysWorkout) {
      const response = await startWorkoutMutation.mutateAsync({ day: today, workout: todaysWorkout });
      setActiveWorkout(todaysWorkout);
      setCurrentInProgressWorkout(response);
    }
  };

  const completeWorkout = () => {
    if (activeWorkout && inProgressUserWorkout) {
      completeWorkoutMutation.mutate({
        activeWorkout,
        userWorkout: inProgressUserWorkout
      });
      setActiveWorkout(null);
      setCurrentInProgressWorkout(undefined);
      window.location.reload();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = activeWorkout?.workout ? activeWorkout.workout[currentExerciseIndex] : null;

  // Initialize userSets if it doesn't exist
  if (currentExercise && !currentExercise.userSets) {
    currentExercise.userSets = [];
  }

  // Get current set or create a default one
  const currentSet = currentExercise?.userSets?.[currentSetIndex] || {
    id: `set-${currentSetIndex}`,
    set_number: currentSetIndex + 1,
    reps: currentExercise?.reps,
    duration: currentExercise?.duration,
    completed: false,
    exercise_id: '1'
  };

  const isStrengthExercise = currentExercise?.type === 'strength';
  const isCardioExercise = currentExercise?.type === 'cardio';

  const updateSet = (updates: Partial<WorkoutSet>) => {
    console.log('~updates', updates)
    console.log('~currentSet', currentSet)
    console.log('~currentExercise', currentExercise)
    console.log('~activeWorkout', activeWorkout)
    console.log('~currentExerciseIndex', currentExerciseIndex)
    console.log('~currentSetIndex', currentSetIndex)
    if (!activeWorkout || !currentSet) return;
    console.log('~didnt return')
    setActiveWorkout(prev => {
      if (!prev || !prev.workout) return prev;

      const newWorkout = { ...prev };
      const set = currentExercise?.userSets?.[currentSetIndex] || null;
      console.log('~set', set)

      // Ensure workout exists and has the exercise at the current index
      if (newWorkout.workout && newWorkout.workout[currentExerciseIndex] && newWorkout.workout[currentExerciseIndex].userSets) {
        newWorkout.workout[currentExerciseIndex].userSets![currentSetIndex] = {
          ...set,
          ...updates
        };
      }
      console.log('~newWorkout', newWorkout)
      return newWorkout;
    });
  };

  const completeSet = () => {
    updateSet({ completed: true });

    // Move to next set or exercise
    if (currentSetIndex < (currentExercise!.numberOfSets! - 1)) {
      setCurrentSetIndex(prev => prev + 1);
      // Start rest timer if not the last set
      if (currentExercise!.restTime > 0) {
        setRestTimer(currentExercise!.restTime);
        setIsResting(true);
      }
    } else if (currentExerciseIndex < activeWorkout!.workout!.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    }
    persistCompletedSetMutation.mutate({
      activeWorkout: activeWorkout!,
      userWorkout: currentInProgressWorkout!
    });
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  if (workoutsError) {
    return (
      <div className="p-6">
        <ErrorMessage error={workoutsError} variant="card" />
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Workout Tracker
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Start a workout to track your progress
              </p>
            </div>
            <button
              onClick={() => startWorkout()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              <span>Start Workout</span>
            </button>
          </div>


          {/* Recent Workouts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Workouts
            </h3>
            {recentWorkoutsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentWorkoutsError ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Failed to load recent workouts</p>
                <p className="text-sm">Please try again later</p>
              </div>
            ) : !recentWorkouts || recentWorkouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent workouts</p>
                <p className="text-sm">Start your first workout to see it here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentWorkouts.map((workout) => {
                  const workoutDate = new Date(workout.started_at!);
                  const isToday = workoutDate.toDateString() === new Date().toDateString();
                  const isYesterday = workoutDate.toDateString() === new Date(Date.now() - 86400000).toDateString();

                  let dateDisplay;
                  if (isToday) {
                    dateDisplay = 'Today';
                  } else if (isYesterday) {
                    dateDisplay = 'Yesterday';
                  } else {
                    dateDisplay = workoutDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }

                  const workoutPlan = workout.exercises as WeeklyWorkoutPlan;
                  const exerciseCount = workoutPlan?.workout?.length || 0;
                  const completedSets = workoutPlan?.workout?.reduce((total, exercise) =>
                    total + (exercise.userSets?.length || 0), 0
                  ) || 0;

                  const statusColor = workout.status === 'completed'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : workout.status === 'in_progress'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';

                  const statusIcon = workout.status === 'completed'
                    ? <CheckCircle2 className="w-4 h-4" />
                    : workout.status === 'in_progress'
                      ? <Timer className="w-4 h-4" />
                      : <Activity className="w-4 h-4" />;

                  return (
                    <div
                      key={workout.id}
                      className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                      {/* Workout Type Indicator */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Workout Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors duration-200">
                              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          </div>

                          {/* Workout Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {workoutPlan?.day ? workoutPlan.day.charAt(0).toUpperCase() + workoutPlan.day.slice(1) : 'Workout'}
                              </h4>
                              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                {statusIcon}
                                <span className="capitalize">{workout.status?.replace('_', ' ')}</span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>{exerciseCount} exercises</span>
                              </span>
                              {completedSets > 0 && (
                                <span className="flex items-center space-x-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>{completedSets} sets</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Date and Duration */}
                        <div className="flex flex-col items-end space-y-1 text-right">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {dateDisplay}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {workoutDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!activeWorkout?.workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Rest Day</h1>
              <p className="text-blue-100 text-lg">Your body grows stronger during recovery</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Today is your recovery day
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  Rest days are just as important as workout days. Your muscles repair and grow stronger during recovery periods.
                </p>
              </div>

              {/* Rest Day Activities */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Light Movement</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Take a gentle walk or do some light stretching
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hydration</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Stay hydrated and focus on proper nutrition
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sleep Well</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Prioritize quality sleep for optimal recovery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Workout Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{activeWorkout?.workout?.[currentExerciseIndex].name}</h2>
              <p className="text-emerald-100">
                Exercise {currentExerciseIndex + 1} of {activeWorkout?.workout?.length}
              </p>
              <p className="text-emerald-100">
                Set {currentSetIndex + 1} of {currentExercise!.numberOfSets}
              </p>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentExerciseIndex + (currentSetIndex / currentExercise!.numberOfSets!)) / activeWorkout?.workout?.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 text-center">
            <Timer className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">
              Rest Time
            </h3>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              {formatTime(restTimer)}
            </div>
            <button
              onClick={skipRest}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip Rest</span>
            </button>
          </div>
        )}

        {/* Current Exercise */}
        {currentExercise && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentExercise.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {currentExercise.type === 'strength' && (
                  <Target className="w-5 h-5 text-blue-500" />
                )}
                {currentExercise.type === 'cardio' && (
                  <Heart className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            {/* Exercise Instructions */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions:</h4>
              <ul className="space-y-1">
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300 text-sm flex items-start">
                    <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            {/* Current Set */}
            {currentSet && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Set {currentSet.set_number} of {currentExercise.numberOfSets}
                  </h4>
                  {currentSet.completed && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>

                {isStrengthExercise && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* Reps Counter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-center mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Repetitions
                        </label>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Target: {currentExercise?.reps || 0} reps
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => updateSet({ reps: Math.max(0, (currentSet.reps || 0) - 1) })}
                          className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Decrease reps"
                        >
                          <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="flex-1 max-w-24">
                          <input
                            type="number"
                            min="0"
                            value={currentSet.reps || 0}
                            onChange={(e) => updateSet({ reps: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-full text-center text-3xl font-bold bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Number of repetitions"
                          />
                        </div>

                        <button
                          onClick={() => updateSet({ reps: (currentSet.reps || 0) + 1 })}
                          className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-700 hover:from-emerald-200 hover:to-emerald-300 dark:hover:from-emerald-700 dark:hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Increase reps"
                        >
                          <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                        </button>
                      </div>
                    </div>

                    {/* Weight Counter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-center mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Weight ({prefersMetric ? 'kg' : 'lbs'})
                        </label>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Target: {prefersMetric ? '0 kg' : '0 lbs'}
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => {
                            const decrement = prefersMetric ? 2.5 : 5;
                            const currentWeight = prefersMetric
                              ? (currentSet.weight || 0)
                              : ((currentSet.weight || 0) * 2.20462);
                            const newWeight = Math.max(0, currentWeight - decrement);
                            updateSet({
                              weight: prefersMetric ? newWeight : (newWeight / 2.20462)
                            });
                          }}
                          className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Decrease weight"
                        >
                          <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="flex-1 max-w-28">
                          <input
                            type="number"
                            min="0"
                            step={prefersMetric ? "0.5" : "1"}
                            value={prefersMetric
                              ? (currentSet.weight || 0).toFixed(1)
                              : ((currentSet.weight || 0) * 2.20462).toFixed(0)
                            }
                            onChange={(e) => {
                              const inputValue = parseFloat(e.target.value) || 0;
                              const weightInKg = prefersMetric ? inputValue : (inputValue / 2.20462);
                              updateSet({ weight: Math.max(0, weightInKg) });
                            }}
                            className="w-full text-center text-3xl font-bold bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-700 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label={`Weight in ${prefersMetric ? 'kilograms' : 'pounds'}`}
                          />
                        </div>

                        <button
                          onClick={() => {
                            const increment = prefersMetric ? 2.5 : 5;
                            const currentWeight = prefersMetric
                              ? (currentSet.weight || 0)
                              : ((currentSet.weight || 0) * 2.20462);
                            const newWeight = currentWeight + increment;
                            updateSet({
                              weight: prefersMetric ? newWeight : (newWeight / 2.20462)
                            });
                          }}
                          className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700 dark:hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Increase weight"
                        >
                          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isCardioExercise && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* Duration Counter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-center mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </label>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          Target: {formatTime(currentExercise.duration || 0)}
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => updateSet({ duration: Math.max(0, (currentSet.duration || 0) - 30) })}
                          className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Decrease duration by 30 seconds"
                        >
                          <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="flex-1 max-w-32">
                          <input
                            type="number"
                            min="0"
                            step="15"
                            value={currentSet.duration || 0}
                            onChange={(e) => updateSet({ duration: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-full text-center text-2xl font-bold bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Duration in seconds"
                          />
                          <div className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">
                            {formatTime(currentSet.duration || 0)}
                          </div>
                        </div>

                        <button
                          onClick={() => updateSet({ duration: (currentSet.duration || 0) + 30 })}
                          className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 hover:from-purple-200 hover:to-purple-300 dark:hover:from-purple-700 dark:hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Increase duration by 30 seconds"
                        >
                          <Plus className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                        </button>
                      </div>
                    </div>

                    {/* Distance Counter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-center mb-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Distance ({prefersMetric ? 'm' : 'ft'})
                        </label>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Target: {prefersMetric ? '0 m' : '0 ft'}
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => {
                            const decrement = prefersMetric ? 50 : 50; // 50m or 50ft
                            const currentDistance = prefersMetric
                              ? (currentSet.distance || 0)
                              : ((currentSet.distance || 0) * 3.28084);
                            const newDistance = Math.max(0, currentDistance - decrement);
                            updateSet({
                              distance: prefersMetric ? newDistance : (newDistance / 3.28084)
                            });
                          }}
                          className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Decrease distance"
                        >
                          <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div className="flex-1 max-w-32">
                          <input
                            type="number"
                            min="0"
                            step={prefersMetric ? "10" : "10"}
                            value={prefersMetric
                              ? Math.round(currentSet.distance || 0)
                              : Math.round((currentSet.distance || 0) * 3.28084)
                            }
                            onChange={(e) => {
                              const inputValue = parseInt(e.target.value) || 0;
                              const distanceInMeters = prefersMetric ? inputValue : (inputValue / 3.28084);
                              updateSet({ distance: Math.max(0, distanceInMeters) });
                            }}
                            className="w-full text-center text-3xl font-bold bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-700 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label={`Distance in ${prefersMetric ? 'meters' : 'feet'}`}
                          />
                        </div>

                        <button
                          onClick={() => {
                            const increment = prefersMetric ? 50 : 50; // 50m or 50ft
                            const currentDistance = prefersMetric
                              ? (currentSet.distance || 0)
                              : ((currentSet.distance || 0) * 3.28084);
                            const newDistance = currentDistance + increment;
                            updateSet({
                              distance: prefersMetric ? newDistance : (newDistance / 3.28084)
                            });
                          }}
                          className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-700 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-700 dark:hover:to-orange-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                          aria-label="Increase distance"
                        >
                          <Plus className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={completeSet}
                  disabled={currentSet.completed}
                  className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {currentSet.completed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Set Completed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Set</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* All Sets Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">All Sets</h4>
              </div>

              <div className="grid gap-2">
                {currentExercise?.userSets?.map((set, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${index === currentSetIndex
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : set.completed
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Set {index + 1}
                      </span>
                      <div className="flex items-center space-x-4 text-sm">
                        {isStrengthExercise && (
                          <>
                            <span className="text-gray-600 dark:text-gray-300">
                              {set.reps || 0} reps
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {prefersMetric
                                ? `${set.weight?.toFixed(0) || 0}kg`
                                : `${Math.round(((set.weight || 0) * 2.20462) * 10) / 10}lbs`
                              }
                            </span>
                          </>
                        )}
                        {isCardioExercise && (
                          <>
                            <span className="text-gray-600 dark:text-gray-300">
                              {formatTime(set.duration || 0)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {prefersMetric
                                ? `${set.distance?.toFixed(0) || 0}m`
                                : `${Math.round(((set.distance || 0) * 3.28084) * 10) / 10}ft`
                              }
                            </span>
                          </>
                        )}
                        {set.completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workout Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center">
            <button
              onClick={() => completeWorkout()}
              disabled={completeWorkoutMutation.isPending}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-200"
            >
              {completeWorkoutMutation.isPending ? (
                <ButtonSpinner />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Complete Workout</span>
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};