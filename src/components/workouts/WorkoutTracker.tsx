import React, { useState, useEffect } from 'react';
import {
  Play,
  Plus,
  Minus,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  Timer,
  Heart,
  Activity,
  TrendingUp,
  Save,
  SkipForward
} from 'lucide-react';
import { LoadingSpinner, ButtonSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ActiveWorkout, WorkoutSet, Workout } from '../../../common';


export const WorkoutTracker: React.FC = () => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);

  // Get available workouts
  const workouts: Workout[] = [];
  const workoutsLoading = false;
  const workoutsError = null;

  // Start workout mutation
  const startWorkout = () => { };

  const completeWorkout = () => { };
  const completingWorkout = false;


  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeWorkout && !isResting) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting]);

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

  const currentExercise = activeWorkout?.workout.exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];
  const isStrengthExercise = currentExercise?.exercise.exercise_type === 'strength';
  const isCardioExercise = currentExercise?.exercise.exercise_type === 'cardio';

  const updateSet = (updates: Partial<WorkoutSet>) => {
    if (!activeWorkout || !currentSet) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;

      const newWorkout = { ...prev };
      const exercise = newWorkout.workout.exercises[currentExerciseIndex];
      const set = exercise.sets[currentSetIndex];

      Object.assign(set, updates);

      return newWorkout;
    });
  };

  const completeSet = () => {
    if (!currentSet) return;

    updateSet({ completed: true });

    // Move to next set or exercise
    if (currentSetIndex < currentExercise!.sets.length - 1) {
      setCurrentSetIndex(prev => prev + 1);
      // Start rest timer if not the last set
      if (currentExercise!.rest_time > 0) {
        setRestTimer(currentExercise!.rest_time);
        setIsResting(true);
      }
    } else if (currentExerciseIndex < activeWorkout!.workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const addSet = () => {
    if (!activeWorkout || !currentExercise) return;

    const newSet: WorkoutSet = {
      id: `set-${currentExercise.sets.length}`,
      exercise_id: currentExercise.exercise_id,
      set_number: currentExercise.sets.length + 1,
      reps: isStrengthExercise ? currentExercise.target_reps : undefined,
      weight: isStrengthExercise ? currentExercise.target_weight : undefined,
      duration: isCardioExercise ? currentExercise.target_duration : undefined,
      distance: isCardioExercise ? currentExercise.target_distance : undefined,
      completed: false,
    };

    setActiveWorkout(prev => {
      if (!prev) return prev;

      const newWorkout = { ...prev };
      newWorkout.workout.exercises[currentExerciseIndex].sets.push(newSet);

      return newWorkout;
    });
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
              onClick={() => setShowWorkoutSelector(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              <span>Start Workout</span>
            </button>
          </div>

          {/* Workout Selection Modal */}
          {showWorkoutSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Choose a Workout
                  </h3>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                  {workoutsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" text="Loading workouts..." />
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {workouts?.map((workout) => (
                        <div
                          key={workout.id}
                          onClick={() => startWorkout()}
                          className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {workout.name}
                            </h4>
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                              {workout.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {workout.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{workout.duration_minutes} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{workout.calories_burned_estimate} cal</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowWorkoutSelector(false)}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Workouts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Workouts
            </h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent workouts</p>
              <p className="text-sm">Start your first workout to see it here</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Workout Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{activeWorkout.workout.name}</h2>
              <p className="text-emerald-100">
                Exercise {currentExerciseIndex + 1} of {activeWorkout.workout.exercises.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(workoutTimer)}</div>
              <div className="text-emerald-100 text-sm">Total Time</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentExerciseIndex + (currentSetIndex / currentExercise!.sets.length)) / activeWorkout.workout.exercises.length) * 100}%`
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
                  {currentExercise.exercise.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentExercise.exercise.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {currentExercise.exercise.exercise_type === 'strength' && (
                  <Target className="w-5 h-5 text-blue-500" />
                )}
                {currentExercise.exercise.exercise_type === 'cardio' && (
                  <Heart className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            {/* Exercise Instructions */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions:</h4>
              <ul className="space-y-1">
                {currentExercise.exercise.instructions.map((instruction, index) => (
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
                    Set {currentSet.set_number} of {currentExercise.sets.length}
                  </h4>
                  {currentSet.completed && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>

                {isStrengthExercise && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Reps */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reps
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateSet({ reps: Math.max(0, (currentSet.reps || 0) - 1) })}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={currentSet.reps || 0}
                            onChange={(e) => updateSet({ reps: parseInt(e.target.value) || 0 })}
                            className="w-full text-center text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
                          />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Target: {currentExercise.target_reps}
                          </div>
                        </div>
                        <button
                          onClick={() => updateSet({ reps: (currentSet.reps || 0) + 1 })}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Weight (kg)
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateSet({ weight: Math.max(0, (currentSet.weight || 0) - 2.5) })}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            step="0.5"
                            value={currentSet.weight || 0}
                            onChange={(e) => updateSet({ weight: parseFloat(e.target.value) || 0 })}
                            className="w-full text-center text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
                          />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Target: {currentExercise.target_weight || 0}kg
                          </div>
                        </div>
                        <button
                          onClick={() => updateSet({ weight: (currentSet.weight || 0) + 2.5 })}
                          className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isCardioExercise && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (seconds)
                      </label>
                      <div className="text-center">
                        <input
                          type="number"
                          value={currentSet.duration || 0}
                          onChange={(e) => updateSet({ duration: parseInt(e.target.value) || 0 })}
                          className="w-full text-center text-2xl font-bold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Target: {formatTime(currentExercise.target_duration || 0)}
                        </div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Distance (m)
                      </label>
                      <div className="text-center">
                        <input
                          type="number"
                          value={currentSet.distance || 0}
                          onChange={(e) => updateSet({ distance: parseInt(e.target.value) || 0 })}
                          className="w-full text-center text-2xl font-bold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Target: {currentExercise.target_distance || 0}m
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Complete Set Button */}
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
                <button
                  onClick={addSet}
                  className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Set</span>
                </button>
              </div>

              <div className="grid gap-2">
                {currentExercise.sets.map((set, index) => (
                  <div
                    key={set.id}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${index === currentSetIndex
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : set.completed
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Set {set.set_number}
                      </span>
                      <div className="flex items-center space-x-4 text-sm">
                        {isStrengthExercise && (
                          <>
                            <span className="text-gray-600 dark:text-gray-300">
                              {set.reps || 0} reps
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {set.weight || 0}kg
                            </span>
                          </>
                        )}
                        {isCardioExercise && (
                          <>
                            <span className="text-gray-600 dark:text-gray-300">
                              {formatTime(set.duration || 0)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {set.distance || 0}m
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => completeWorkout()}
                disabled={completingWorkout}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-200"
              >
                {completingWorkout ? (
                  <ButtonSpinner />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Complete Workout</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <TrendingUp className="w-4 h-4" />
              <span>
                {activeWorkout.workout.exercises.reduce((total, ex) =>
                  total + ex.sets.filter(s => s.completed).length, 0
                )} / {activeWorkout.workout.exercises.reduce((total, ex) =>
                  total + ex.sets.length, 0
                )} sets completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};