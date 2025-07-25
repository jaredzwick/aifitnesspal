import React, { useState } from 'react';
import {
  Camera,
  Target,
  Award,
  Scale,
  Ruler,
  Plus,
  Upload,
  BarChart3,
  Trophy
} from 'lucide-react';
import { progressService } from '../../services/progressService';
import { LoadingSpinner, SkeletonCard } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const ProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'measurements' | 'goals'>('overview');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);

  const progressSummary = null;
  const summaryLoading = null;
  const summaryError = null;
  const refreshSummary = () => { };
  const progressPhotos: any[] = [];
  const photosLoading = null;
  const refreshPhotos = null;
  const achievements: any[] = [];
  const achievementsLoading = null;
  const uploadPhoto = () => { };
  const uploadingPhoto = null;



  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Camera className="w-8 h-8" />
            <span className="text-2xl font-bold">{0}</span>
          </div>
          <h3 className="font-semibold mb-1">Progress Photos</h3>
          <p className="text-blue-100 text-sm">Visual journey</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Scale className="w-8 h-8" />
            <span className="text-2xl font-bold">{0}kg</span>
          </div>
          <h3 className="font-semibold mb-1">Current Weight</h3>
          <p className="text-green-100 text-sm">
            {'No change'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-2xl font-bold">{0}</span>
          </div>
          <h3 className="font-semibold mb-1">Active Goals</h3>
          <p className="text-purple-100 text-sm">{0} completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-2xl font-bold">{0}</span>
          </div>
          <h3 className="font-semibold mb-1">Achievements</h3>
          <p className="text-orange-100 text-sm">Milestones reached</p>
        </div>
      </div>

      {/* Recent Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Photos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Photos</h3>
            <label className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <span>Add Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {photosLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} className="aspect-square" />
              ))}
            </div>
          ) : progressPhotos && progressPhotos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {progressPhotos.slice(0, 6).map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden"
                >
                  <img
                    src={photo.image_url}
                    alt="Progress photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No progress photos yet</p>
              <p className="text-sm">Upload your first photo to track visual progress</p>
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
            <button className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
              View all
            </button>
          </div>

          {achievementsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} className="h-16" />
              ))}
            </div>
          ) : achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No achievements yet</p>
              <p className="text-sm">Keep working towards your goals!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Photos</h3>
        <label className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold cursor-pointer transition-all duration-200">
          <Upload className="w-5 h-5" />
          <span>Upload Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {photosLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} className="aspect-[3/4]" />
          ))}
        </div>
      ) : progressPhotos && progressPhotos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700">
                <img
                  src={photo.image_url}
                  alt="Progress photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {photo.photo_type}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(photo.taken_at).toLocaleDateString()}
                  </span>
                </div>
                {photo.weight_at_time && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Weight: {photo.weight_at_time}kg
                  </p>
                )}
                {photo.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {photo.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No progress photos yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start documenting your fitness journey with progress photos
          </p>
          <label className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold cursor-pointer transition-colors">
            <Camera className="w-5 h-5" />
            <span>Take First Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );

  const renderMeasurements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Body Measurements</h3>
        <button
          onClick={() => setShowAddMeasurement(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Measurement</span>
        </button>
      </div>

      <div className="text-center py-16">
        <Ruler className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Body measurements coming soon
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Track your body measurements and see your progress over time
        </p>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Goals</h3>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="text-center py-16">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Goal tracking coming soon
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Set and track your fitness goals to stay motivated
        </p>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'photos':
        return renderPhotos();
      case 'measurements':
        return renderMeasurements();
      case 'goals':
        return renderGoals();
      default:
        return renderOverview();
    }
  };

  if (summaryError) {
    return (
      <div className="p-6">
        <ErrorMessage
          error={summaryError}
          onRetry={refreshSummary}
          variant="card"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Progress Tracker</h2>
              <p className="text-purple-100 text-lg">
                Track your fitness journey and celebrate your achievements
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-purple-100">Today</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'photos', label: 'Photos', icon: Camera },
              { id: 'measurements', label: 'Measurements', icon: Ruler },
              { id: 'goals', label: 'Goals', icon: Target },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === id
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-32" />
            ))}
          </div>
        ) : (
          renderCurrentTab()
        )}

        {/* Upload Loading Overlay */}
        {uploadingPhoto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Uploading photo...
              </p>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};