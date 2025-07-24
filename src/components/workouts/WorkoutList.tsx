import { useState } from 'react';
import { Clock, Zap, Users, Filter, Search } from 'lucide-react';
import { useQuery } from '../../hooks/useApi';
import { workoutService, Workout, WorkoutFilters } from '../../services/workoutService';
import { SkeletonList } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface WorkoutListProps {
  onSelectWorkout?: (workout: Workout) => void;
  filters?: WorkoutFilters;
  showFilters?: boolean;
}

export const WorkoutList: React.FC<WorkoutListProps> = ({
  onSelectWorkout,
  filters: initialFilters = {},
  showFilters = true,
}) => {
  const [filters, setFilters] = useState<WorkoutFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    data: workouts,
    loading,
    error,
    retry,
  } = useQuery(
    () => workoutService.getWorkouts(filters),
    {
      immediate: true,
      onError: (error) => {
        console.error('Failed to load workouts:', error);
      },
    }
  );

  // Filter workouts by search query
  const filteredWorkouts = workouts?.filter(workout =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.muscle_groups.some(group =>
      group.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const handleFilterChange = (newFilters: Partial<WorkoutFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage
          error={error}
          onRetry={retry}
          variant="card"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Search and Filters */}
        {showFilters && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {(Object.keys(filters).length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Workout Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange({ type: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Types</option>
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="hiit">HIIT</option>
                      <option value="yoga">Yoga</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={filters.difficulty || ''}
                      onChange={(e) => handleFilterChange({ difficulty: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Template Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source
                    </label>
                    <select
                      value={filters.is_template === undefined ? '' : filters.is_template.toString()}
                      onChange={(e) => handleFilterChange({
                        is_template: e.target.value === '' ? undefined : e.target.value === 'true'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Workouts</option>
                      <option value="true">Templates</option>
                      <option value="false">My Workouts</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <SkeletonList count={6} />
        )}

        {/* Empty State */}
        {!loading && filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No workouts found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : 'Start by creating your first workout'
              }
            </p>
          </div>
        )}

        {/* Workout Grid */}
        {!loading && filteredWorkouts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <div
                key={workout.id}
                onClick={() => onSelectWorkout?.(workout)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                    {workout.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                </div>

                {/* Description */}
                {workout.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {workout.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{workout.calories_burned_estimate} cal</span>
                  </div>
                  {workout.is_template && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Template</span>
                    </div>
                  )}
                </div>

                {/* Muscle Groups */}
                <div className="flex flex-wrap gap-1">
                  {workout.muscle_groups.slice(0, 3).map((group) => (
                    <span
                      key={group}
                      className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                    >
                      {group}
                    </span>
                  ))}
                  {workout.muscle_groups.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      +{workout.muscle_groups.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};